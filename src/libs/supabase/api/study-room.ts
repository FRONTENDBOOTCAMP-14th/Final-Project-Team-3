'use server'
import type { Profile, StudyRoom, StudyRoomRequests } from '..'
import { createClient } from '../server'

export const getLatestStudyRoom = async (): Promise<StudyRoom[]> => {
  const supabase = await createClient()
  const { data: studyRoomData, error } = await supabase
    .from('study_room')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(15)

  if (error) {
    throw new Error(error.message)
  }

  return studyRoomData ?? []
}

export const getAllStudyRoom = async (): Promise<StudyRoom[]> => {
  const supabase = await createClient()
  const { data: studyRoomData, error } = await supabase
    .from('study_room')
    .select('*')

  if (error) {
    throw new Error(error.message)
  }

  return studyRoomData ?? []
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

export const filterStudyRoom = async (
  region?: string,
  depth?: string,
  search?: string
): Promise<StudyRoom[]> => {
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
    throw new Error(error.message)
  }
  return queryData
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
): Promise<StudyRoomRequests[] | null> => {
  if (!studyId) return null

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
): Promise<void | null> => {
  if (!studyId || !userId) return null

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
  status: 'PENDING' | 'REJECTED' | 'APPROVED'
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
        .select('*')
        .single()

      if (participantError) {
        new Error(participantError.message)
        return requestsData
      }

      return requestsData
    }

    default:
      return null
  }
}

export const studyRoomRequestsLists = async (
  studyId: string
): Promise<Profile[] | null> => {
  const supabase = await createClient()

  const { data } = await supabase
    .from('study_requests')
    .select('profile(*)')
    .eq('room_id', studyId)
    .eq('status', 'PENDING')

  if (!data) return null

  const profileLists = data.map((item) => item.profile)

  return profileLists ?? []
}

export const getStudyRoomParticipants = async (
  studyId: string
): Promise<Profile[] | null> => {
  const supabase = await createClient()

  const { data, error: participantsError } = await supabase
    .from('study_participants')
    .select('profile(*)')
    .eq('room_id', studyId)

  if (participantsError) {
    throw new Error(participantsError.message)
  }

  if (!data) return null

  const profileLists = data.map((item) => item.profile)

  return profileLists ?? []
}

export const studyRoomDeportation = async (
  userId: string,
  status: 'DEPORTATION'
) => {
  const supabase = await createClient()

  const { error } = await supabase
    .from('study_participants')
    .delete()
    .eq('user_id', userId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const { error: requestsError } = await supabase
    .from('study_requests')
    .update({
      status,
      request_message: '추방 되었습니다.',
    })
    .eq('user_id', userId)
    .select('*')
    .single()

  if (requestsError) {
    throw new Error(requestsError.message)
  }
}
