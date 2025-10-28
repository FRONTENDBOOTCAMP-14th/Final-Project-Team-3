'use server'

import type { ResultType } from '@/types/apiResultsType'

import type { Comments, Profile } from '..'
import { createClient } from '../server'

export type CommentsWithProfile = Comments & {
  profile: Pick<Profile, 'id' | 'nickname' | 'profile_url'>
}

export const getComments = async (
  studyId: string
): Promise<ResultType<CommentsWithProfile[]>> => {
  const supabase = await createClient()

  const { data: commentData, error: commentError } = await supabase
    .from('comments')
    .select('*, profile:user_id(id, nickname, profile_url)')
    .eq('room_id', studyId)
    .is('parent_comment_Id', null)
    .order('created_at', { ascending: false })

  if (commentError) {
    return { ok: false, message: '댓글을 가져오지 못했습니다...' }
  }

  return { ok: true, data: commentData ?? [] }
}

export const addComments = async (
  studyId: string,
  comment: string,
  option?: {
    commentId?: string
    parentId?: string | null
  }
): Promise<ResultType<CommentsWithProfile>> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, message: '로그인이 필요합니다...' }
  }

  const commentIdObject = option?.commentId ? { id: option?.commentId } : {}

  const { data: commentData, error: commentError } = await supabase
    .from('comments')
    .upsert({
      ...commentIdObject,
      room_id: studyId,
      user_id: user.id,
      comment,
      parent_comment_Id: option?.parentId ?? null,
    })
    .select('*, profile:user_id(id, nickname, profile_url)')
    .single()

  if (commentError) {
    return { ok: false, message: '댓글 추가 수정 실패...' }
  }

  return {
    ok: true,
    data: commentData,
    message: option?.commentId
      ? '댓글이 수정 되었습니다.'
      : '댓글이 추가 되었습니다.',
  }
}

export const deleteComment = async (
  commentId: string
): Promise<ResultType<void>> => {
  const supabase = await createClient()

  const { error } = await supabase.from('comments').delete().eq('id', commentId)

  if (error) {
    return { ok: false, message: '댓글 삭제 실패...' }
  }

  return { ok: true, message: '댓글이 삭제 되었습니다.' }
}

export const getChildComments = async (
  studyId: string,
  parentId: string
): Promise<ResultType<CommentsWithProfile[]>> => {
  const supabase = await createClient()

  const { data: childCommentData, error: commentError } = await supabase
    .from('comments')
    .select('*, profile:user_id(id, nickname, profile_url)')
    .eq('room_id', studyId)
    .eq('parent_comment_Id', parentId)
    .order('created_at', { ascending: false })

  if (commentError) {
    return { ok: false, message: '댓글을 가져오지 못했습니다...' }
  }

  return { ok: true, data: childCommentData ?? [] }
}
