'use server'
import type { ResultType } from '@/types/apiResultsType'

import type { Profile, StudyRoom, StudyRoomRequests } from '..'
import { createClient } from '../server'

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
): Promise<ResultType<StudyRoom>> => {
  const supabase = await createClient()
  const { data: studyRoomDetailData, error } = await supabase
    .from('study_room')
    .select('*')
    .eq('id', studyRoomId)
    .single()

  if (error) {
    return { ok: false, message: '스터디룸 정보 조회 실패...' }
  }

  return { ok: true, data: studyRoomDetailData }
}

export const getQueryStudyRoom = async (
  region?: string,
  depth?: string,
  search?: string,
  sort_by?: string
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
  if (sort_by) {
    let sortColumn: string | null = null
    let ascending: boolean | null = null

    console.log(region, depth, search, sort_by)
    switch (sort_by) {
      case 'latest':
        sortColumn = 'created_at'
        ascending = false
        break
      case 'members':
        sortColumn = 'member_count'
        ascending = false
        break
      case 'likes':
        sortColumn = 'likes_count'
        ascending = false
        break

      default:
        break
    }

    if (sortColumn !== null && ascending !== null) {
      query = query.order(sortColumn, { ascending })
    }
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
): Promise<ResultType<Profile>> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('study_room')
    .select('owner_id')
    .eq('id', studyRoomId)
    .single()

  if (error || !data.owner_id) {
    return { ok: false, message: '모임장 정보 가져오기 실패...' }
  }

  const { data: profileData, error: profileError } = await supabase
    .from('profile')
    .select('*')
    .eq('id', data.owner_id)
    .single()

  if (profileError) {
    return { ok: false, message: '프로필 정보 가져오기 실패...' }
  }

  return { ok: true, data: profileData as Profile }
}

export const getStudyRoomRequests = async (
  studyId: string
): Promise<ResultType<StudyRoomRequests[]>> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('study_requests')
    .select('*')
    .eq('room_id', studyId)

  if (error) {
    return { ok: false, message: '신청 정보 가져오기 실패...' }
  }

  return { ok: true, data }
}

export const studyRoomRequestCancel = async (
  studyId: string,
  userId: string
): Promise<ResultType<void>> => {
  const supabase = await createClient()

  const { error } = await supabase
    .from('study_requests')
    .delete()
    .eq('room_id', studyId)
    .eq('user_id', userId)

  if (error) {
    return { ok: false, message: '취소 실패...' }
  }

  return { ok: true, message: '참가 신청이 취소 되었습니다.' }
}

export const StudyRoomRequestsFn = async (
  studyId: string,
  userId: string,
  status: 'PENDING' | 'REJECTED' | 'APPROVED' | 'DEPORTATION'
): Promise<ResultType<StudyRoomRequests> | null> => {
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
        return { ok: false, message: '참가 신청 실패...' }
      }

      return {
        ok: true,
        data: data as StudyRoomRequests,
        message: '참가 신청 되었습니다.',
      }
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
        return { ok: false, message: '승인 거절 실패...' }
      }

      return {
        ok: true,
        data: data as StudyRoomRequests,
        message: '승인이 거절 되었습니다.',
      }
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
        return { ok: false, message: '참가 승인 실패...' }
      }

      if (!requestsData) {
        return null
      }

      // if (requestsData.status !== 'APPROVED') {
      //   return requestsData as StudyRoomRequests
      // }

      const { error: participantError } = await supabase
        .from('study_participants')
        .insert([
          {
            room_id: studyId,
            user_id: userId,
          },
        ])

      if (participantError) {
        // new Error(participantError.message)
        // return requestsData
        return { ok: false, message: '참가자 정보 가져오기 실패...' }
      }

      return { ok: true, data: requestsData, message: '승인 되었습니다.' }
    }

    case 'DEPORTATION': {
      const { error } = await supabase
        .from('study_participants')
        .delete()
        .eq('room_id', studyId)
        .eq('user_id', userId)

      if (error) {
        return { ok: false, message: '추방 실패...' }
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
        return { ok: false, message: '추방 정보 업데이트 실패...' }
      }

      return { ok: true, data: requestsData, message: '추방 되었습니다.' }
    }

    default:
      return null
  }
}

export const studyRoomRequestsLists = async (
  studyId: string
): Promise<ResultType<Profile[]>> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('study_requests')
    .select('profile(*)')
    .eq('room_id', studyId)
    .eq('status', 'PENDING')

  const profileLists = data?.map((item) => item.profile)

  if (error) {
    return { ok: false, message: '프로필 정보 조회 실패...' }
  }

  return { ok: true, data: profileLists ?? [] }
}

export const getStudyRoomParticipants = async (
  studyId: string
): Promise<ResultType<Profile[]>> => {
  const supabase = await createClient()

  const { data, error: participantsError } = await supabase
    .from('study_participants')
    .select('profile(*)')
    .eq('room_id', studyId)

  if (participantsError) {
    return { ok: false, message: '프로필 정보 가져오기 실패...' }
  }

  const profileLists = data.map((item) => item.profile)

  return { ok: true, data: profileLists ?? [] }
}

export const deleteStudyRoom = async (
  studyId: string
): Promise<ResultType<void>> => {
  const supabase = await createClient()

  const { error } = await supabase
    .from('study_room')
    .delete()
    .eq('room_id', studyId)

  if (error) {
    return { ok: false, message: '스터디룸 삭제 실패...' }
  }

  return { ok: true, message: '스터디룸이 삭제 되었습니다.' }
}
