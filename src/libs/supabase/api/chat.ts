import type { ResultType } from '@/types/apiResultsType'

import type { Chat, Profile } from '..'
import supabase from '../client'

export type ChatWithProfile = Chat & {
  profile: Pick<Profile, 'id' | 'nickname' | 'profile_url'>
}

export const getChatMessages = async (
  studyId: string
): Promise<ResultType<ChatWithProfile[]>> => {
  const { data: chat, error: chatError } = await supabase
    .from('chat')
    .select('*, profile:user_id(id, nickname, profile_url)')
    .eq('room_id', studyId)
    .order('created_at', { ascending: true })

  if (chatError) {
    return { ok: false, message: '채팅 메세지 조회 실패...' }
  }

  return { ok: true, data: chat }
}

export const insertMessage = async (
  studyId: string,
  userId: string,
  message: string
): Promise<ResultType<void>> => {
  const { error: chatError } = await supabase.from('chat').insert({
    room_id: studyId,
    user_id: userId,
    message,
  })

  if (chatError) {
    return { ok: false, message: '채팅 메세지 입력 실패...' }
  }

  return { ok: true }
}
