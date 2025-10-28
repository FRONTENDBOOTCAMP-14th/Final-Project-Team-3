'use client'
import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import useSWR, { mutate } from 'swr'

import { useAuth } from '@/hooks/useAuth'
import {
  addComments,
  deleteComment,
  getComments,
  type CommentsWithProfile,
} from '@/libs/supabase/api/comments'
import type { ResultType } from '@/types/apiResultsType'

export interface CommentsContextValue {
  isAdding: boolean
  isLoading: boolean
  commentsData: ResultType<CommentsWithProfile[]>
  upsertCommentsHandler: (
    comment: string,
    commentId?: string,
    option?: {
      type?: 'MODIFY' | 'CHILD_MODIFY'
    }
  ) => Promise<void>
  deleteCommentHandler: (commentId: string, parentId: string) => Promise<void>
}

export const CommentsContex = createContext<CommentsContextValue | null>(null)
CommentsContex.displayName = 'CommentsContex'

const fetcher = async (
  studyId: string,
  fetchFn: (
    studyId: string
  ) => Promise<ResultType<CommentsWithProfile[]> | null>
): Promise<ResultType<CommentsWithProfile[]> | null> => {
  if (!studyId) return null

  return fetchFn(studyId)
}

export function CommentsProvider({
  children,
  studyId,
  commentsData,
}: PropsWithChildren<{
  studyId: string
  commentsData: ResultType<CommentsWithProfile[]>
}>) {
  const { user, isAuthenticated } = useAuth()
  const [isAdding, setIsAdding] = useState(false)
  const swrKey = studyId ? [`comments_${studyId}`] : null
  const {
    data,
    isLoading,
    mutate: commentsMutation,
  } = useSWR(swrKey, () => fetcher(studyId, getComments), {
    revalidateOnFocus: false,
    fallbackData: commentsData,
  })

  useEffect(() => {
    if (!data?.ok && data !== undefined) {
      toast.error(data?.message, {
        action: {
          label: '확인',
          onClick: () => {},
        },
      })
    }
  }, [data])

  const upsertCommentsHandler = useCallback(
    async (
      comment: string,
      commentId?: string,
      options?: { type?: 'MODIFY' | 'CHILD_MODIFY'; parentId?: string }
    ) => {
      if (!user || !isAuthenticated) {
        toast.error('로그인이 필요합니다.', {
          action: {
            label: '확인',
            onClick: () => {},
          },
        })
        return
      }

      const prevData: ResultType<CommentsWithProfile[]> | null | undefined =
        data ?? { ok: true, data: [] }

      const optimisticUpdate = () => {
        const list = data?.data ?? []

        if (comment && options?.type === 'MODIFY' && !options.parentId) {
          const modifyComment = list.map((item) =>
            item.id === commentId ? { ...item, comment } : item
          )

          return {
            ok: true,
            data: [...modifyComment],
          }
        } else if (
          comment &&
          options?.type === 'CHILD_MODIFY' &&
          options.parentId
        ) {
          return {
            ok: true,
            data: [...list],
          }
        } else {
          const newComment: CommentsWithProfile = {
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            comment,
            room_id: studyId,
            user_id: user.id,
            profile: {
              id: user.id,
              nickname: user?.user_metadata.full_name,
              profile_url: user?.user_metadata.avatar_url,
            },
            parent_comment_Id: options?.parentId ?? null,
            child_comments_count: 0,
          }

          return {
            ok: true,
            data: [newComment, ...list],
          }
        }
      }

      await commentsMutation(optimisticUpdate, { revalidate: false })

      setIsAdding(true)

      let result: { ok: boolean; message?: string | undefined }

      if (options?.type === 'MODIFY') {
        result = await addComments(studyId, comment, { commentId })
      } else if (options?.type === 'CHILD_MODIFY') {
        result = await addComments(studyId, comment, {
          commentId,
          parentId: options.parentId,
        })
      } else {
        result = await addComments(studyId, comment)
      }
      await commentsMutation()
      await mutate([`commentsChild_${studyId}_${options?.parentId}`])

      if (result.ok) {
        toast.success(result.message, {
          action: {
            label: '확인',
            onClick: () => {},
          },
        })
      } else {
        await commentsMutation(() => prevData, { revalidate: false })
        toast.error(result.message, {
          action: {
            label: '확인',
            onClick: () => {},
          },
        })
      }

      setIsAdding(false)
    },
    [commentsMutation, data, isAuthenticated, studyId, user]
  )

  const deleteCommentHandler = useCallback(
    async (commentId: string, parentId: string) => {
      if (!user || !isAuthenticated) {
        toast.error('로그인이 필요합니다.', {
          action: {
            label: '확인',
            onClick: () => {},
          },
        })
        return
      }
      const prevData: ResultType<CommentsWithProfile[]> = data ?? {
        ok: true,
        data: [],
      }

      const optimisticUpdate = () => {
        const list = data?.data ?? []

        return {
          ok: true,
          data: list.filter((item) => item.id !== commentId),
        }
      }

      await commentsMutation(optimisticUpdate, { revalidate: false })

      setIsAdding(true)

      const result = await deleteComment(commentId)
      await commentsMutation()
      await mutate([`commentsChild_${studyId}_${parentId}`])

      if (result.ok) {
        toast.success(result.message, {
          action: {
            label: '확인',
            onClick: () => {},
          },
        })
      } else {
        await commentsMutation(() => prevData, { revalidate: false })
        toast.error(result.message, {
          action: {
            label: '확인',
            onClick: () => {},
          },
        })
      }

      setIsAdding(false)
    },
    [commentsMutation, data, isAuthenticated, studyId, user]
  )

  const contextState: CommentsContextValue = useMemo(() => {
    return {
      isAdding,
      isLoading,
      commentsData: data ?? { ok: true, data: [] },
      upsertCommentsHandler,
      deleteCommentHandler,
    }
  }, [data, deleteCommentHandler, isAdding, isLoading, upsertCommentsHandler])

  return (
    <CommentsContex.Provider value={contextState}>
      {children}
    </CommentsContex.Provider>
  )
}
