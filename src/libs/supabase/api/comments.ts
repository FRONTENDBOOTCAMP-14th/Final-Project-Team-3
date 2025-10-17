'use server'

import { revalidatePath } from 'next/cache'

import type { Comments, Profile } from '..'
import { createClient } from '../server'

export type CommentsWithProfile = Comments & {
  profile: Pick<Profile, 'id' | 'nickname' | 'profile_url'>
}

export const getComments = async (
  studyId: string
): Promise<CommentsWithProfile[]> => {
  const supabase = await createClient()

  const { data: commentData, error: commentError } = await supabase
    .from('comments')
    .select('*, profile:user_id(id, nickname, profile_url)')
    .eq('room_id', studyId)
    .order('created_at', { ascending: false })

  if (commentError) throw new Error('댓글을 가져오지 못했습니다...')

  return commentData
}

export const addComments = async (
  studyId: string,
  comment: string,
  commentId?: string
): Promise<void> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('로그인이 필요합니다.')

  const commentIdObject = commentId ? { id: commentId } : {}

  const { error: commentError } = await supabase.from('comments').upsert({
    ...commentIdObject,
    room_id: studyId,
    user_id: user.id,
    comment,
  })

  if (commentError) throw new Error('댓글 추가 수정 실패...')

  revalidatePath(`/study-detail/${studyId}`)
}

export const deleteComment = async (
  commentId: string,
  studyId: string,
  userId: string
): Promise<void> => {
  const supabase = await createClient()

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)

  revalidatePath(`/study-detail/${studyId}`)
}
