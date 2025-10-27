'use server'

import type { Profile, StudyRoom, StudyRoomRequests } from '..'
import { createClient } from '../server'

import type { ResultType } from '@/types/apiResultsType'

export const getLatestStudyRoom = async (): Promise<
  ResultType<StudyRoom[]>
> => {
  const supabase = await createClient()

  const { data: studyRoomData, error } = await supabase
    .from('study_room')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(15)

  if (error) {
    return {
      ok: false,
      message: '최신 스터디룸 데이터 가져오기 실패',
    }
  }

  return { ok: true, data: studyRoomData ?? [] }
}

export const getStudyRoomDetail = async (
  studyRoomId: string
): Promise<StudyRoom> => {
  const supabase = await createClient()
  const { data: studyRoomDetailData, error } = await supabase
    .from('study_room')
    .select('*')
    .eq('id', studyRoomId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return studyRoomDetailData
}

export const getQueryStudyRoom = async (
  region?: string,
  depth?: string,
  search?: string
): Promise<ResultType<StudyRoom[]>> => {
  const supabase = await createClient()
  let query = supabase.from('study_room').select('*')

  if (region && depth && search) {
    query = query
      .eq('region', region)
      .eq('region_depth', depth)
      .or(
        `title.ilike.%${search}%,category.ilike.%${search}%,region_depth.ilike.%${search}%,region.ilike.%${search}%`
      )
  } else if (!region && !depth && search) {
    query = query.or(
      `title.ilike.%${search}%,category.ilike.%${search}%,region_depth.ilike.%${search}%,region.ilike.%${search}%`
    )
  } else if (region && depth && !search) {
    query = query.eq('region', region).eq('region_depth', depth)
  }

  const { data: queryData, error } = await query

  if (error) {
    return {
      ok: false,
      message: '스터디룸 데이터 가져오기 실패',
    }
  }
  return { ok: true, data: queryData ?? [] }
}

export const getOwnerProfile = async (
  studyRoomId: string
): Promise<Profile> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('study_room')
    .select('owner_id')
    .eq('id', studyRoomId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  if (!data.owner_id) {
    throw new Error('모임장의 정보가 없습니다.')
  }

  const { data: profileData, error: profileError } = await supabase
    .from('profile')
    .select('*')
    .eq('id', data.owner_id)
    .single()

  if (profileError) {
    throw new Error(profileError.message)
  }

  return profileData as Profile
}

export const getStudyRoomRequests = async (
  studyId: string
): Promise<StudyRoomRequests[]> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('study_requests')
    .select('*')
    .eq('room_id', studyId)

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}

export const studyRoomRequestCancel = async (
  studyId: string,
  userId: string
): Promise<void> => {
  const supabase = await createClient()

  const { error } = await supabase
    .from('study_requests')
    .delete()
    .eq('room_id', studyId)
    .eq('user_id', userId)

  if (error) {
    throw new Error(error.message)
  }
}

export const StudyRoomRequestsFn = async (
  studyId: string,
  userId: string,
  status: 'PENDING' | 'REJECTED' | 'APPROVED' | 'DEPORTATION'
): Promise<StudyRoomRequests | null> => {
  if (!studyId || !userId) return null

  const supabase = await createClient()

  switch (status) {
    case 'PENDING': {
      const { data, error } = await supabase
        .from('study_requests')
        .insert([
          {
            room_id: studyId,
            user_id: userId,
            status: 'PENDING',
            request_message: '승인 대기중 입니다.',
          },
        ])
        .select('*')
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data as StudyRoomRequests
    }

    case 'REJECTED': {
      const { data, error } = await supabase
        .from('study_requests')
        .update({
          status: 'REJECTED',
          request_message: '승인이 거절 되었습니다.',
        })
        .eq('room_id', studyId)
        .eq('user_id', userId)
        .select('*')
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data as StudyRoomRequests
    }

    case 'APPROVED': {
      const { data: requestsData, error: requestsError } = await supabase
        .from('study_requests')
        .update({
          status: 'APPROVED',
          request_message: '승인 되었습니다.',
        })
        .eq('room_id', studyId)
        .eq('user_id', userId)
        .select('*')
        .single()

      if (requestsError) {
        throw new Error(requestsError.message)
      }

      if (!requestsData) {
        return null
      }

      if (requestsData.status !== 'APPROVED') {
        return requestsData as StudyRoomRequests
      }

      const { error: participantError } = await supabase
        .from('study_participants')
        .insert([
          {
            room_id: studyId,
            user_id: userId,
          },
        ])

      if (participantError) {
        new Error(participantError.message)
        return requestsData
      }

      return requestsData
    }

    case 'DEPORTATION': {
      const { error } = await supabase
        .from('study_participants')
        .delete()
        .eq('room_id', studyId)
        .eq('user_id', userId)

      if (error) {
        throw new Error(error.message)
      }

      const { data: requestsData, error: requestsError } = await supabase
        .from('study_requests')
        .update({
          status,
          request_message: '추방 되었습니다.',
        })
        .eq('room_id', studyId)
        .eq('user_id', userId)
        .select('*')
        .single()

      if (requestsError) {
        throw new Error(requestsError.message)
      }

      return requestsData
    }

    default:
      return null
  }
}

export const studyRoomRequestsLists = async (
  studyId: string
): Promise<Profile[]> => {
  const supabase = await createClient()

  const { data } = await supabase
    .from('study_requests')
    .select('profile(*)')
    .eq('room_id', studyId)
    .eq('status', 'PENDING')

  const profileLists = data?.map((item) => item.profile)

  return profileLists ?? []
}

export const getStudyRoomParticipants = async (
  studyId: string
): Promise<Profile[]> => {
  const supabase = await createClient()

  const { data, error: participantsError } = await supabase
    .from('study_participants')
    .select('profile(*)')
    .eq('room_id', studyId)

  if (participantsError) {
    throw new Error(participantsError.message)
  }

  const profileLists = data.map((item) => item.profile)

  return profileLists ?? []
}
export const deleteStudyRoom = async (
  studyId: string,
  userId?: string
): Promise<{ ok: boolean; message: string }> => {
  const supabase = await createClient()

  // 1) 이 스터디의 owner_id 가져오기 (권한 체크용)
  const { data: roomData, error: roomError } = await supabase
    .from('study_room')
    .select('owner_id')
    .eq('id', studyId)
    .single()

  if (roomError || !roomData) {
    return {
      ok: false,
      message: '스터디 정보를 불러올 수 없습니다.',
    }
  }

  // 2) 만약 userId를 전달받았다면, 여기서 한 번 더 서버에서 검사
  //    (클라이언트에서도 막고 있지만 서버에서도 막아야 안전)
  if (userId && roomData.owner_id !== userId) {
    return {
      ok: false,
      message: '모임장만 삭제할 수 있습니다.',
    }
  }

  // 3) 실제 삭제
  const { error: deleteError } = await supabase
    .from('study_room')
    .delete()
    .eq('id', studyId)

  if (deleteError) {
    console.error('❌ 스터디 삭제 실패:', deleteError.message)
    return {
      ok: false,
      message: '스터디 삭제 중 오류가 발생했습니다.',
    }
  }

  return {
    ok: true,
    message: '스터디가 삭제되었습니다.',
  }
}
