'use server'

import type { ResultType } from '@/types/apiResultsType'

import type { StudyRoom } from '..'
import { createClient } from '../server'

export const getUserBookmarks = async (
  userId: string
): Promise<ResultType<StudyRoom[]>> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bookmark')
    .select('room_id, study_room(*)')
    .eq('user_id', userId)

  if (error) {
    return { ok: false, message: '스터디룸 정보 조회 실패...' }
  }

  return {
    ok: true,
    data: (data.map((item) => item.study_room) as StudyRoom[]) ?? [],
  }
}
