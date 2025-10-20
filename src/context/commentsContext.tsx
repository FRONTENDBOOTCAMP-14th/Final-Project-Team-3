'use client'
import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'

import { useAuth } from '@/hooks/useAuth'
import {
  addComments,
  deleteComment,
  getComments,
  type CommentsWithProfile,
} from '@/libs/supabase/api/comments'

export interface CommentsContextValue {
  isAdding: boolean
  isLoading: boolean
  commentsData: CommentsWithProfile[]
  upsertCommentsHandler: (
    comment: string,
    commentId?: string,
    type?: 'MODIFY'
  ) => Promise<void>
  deleteCommentHandler: (commentId: string) => Promise<void>
}

export const CommentsContex = createContext<CommentsContextValue | null>(null)

const fetcher = async (
  studyId: string,
  fetchFn: (studyId: string) => Promise<CommentsWithProfile[] | null>
): Promise<CommentsWithProfile[] | null> => {
  if (!studyId) return null

  return fetchFn(studyId)
}

export function CommentsProvider({
  children,
  studyId,
}: PropsWithChildren<{ studyId: string }>) {
  const { user, isAuthenticated } = useAuth()
  const [isAdding, setIsAdding] = useState(false)
  const swrKey = studyId ? ['comments', studyId] : null
  const {
    data,
    isLoading,
    mutate: commentsMutation,
  } = useSWR(swrKey, ([_key, studyId]) => fetcher(studyId, getComments), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 10000,
  })

  const upsertCommentsHandler = useCallback(
    async (comment: string, commentId?: string, type?: 'MODIFY') => {
      if (!user || !isAuthenticated) return

      const prevData: CommentsWithProfile[] | null | undefined = data ?? []

      const optimisticUpdate = () => {
        const list = data ?? []

        if (comment && type === 'MODIFY') {
          const modifyComment = list.map((item) =>
            item.id === commentId ? { ...item, comment } : item
          )

          return [...modifyComment]
        } else {
          if (!user && !isAuthenticated) return

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
          }

          return [...list, newComment]
        }
      }

      await commentsMutation(optimisticUpdate, { revalidate: false })

      setIsAdding(true)

      try {
        if (type === 'MODIFY') {
          await addComments(studyId, comment, commentId)
          alert('댓글 수정 성공!')
        } else {
          await addComments(studyId, comment)
          alert('댓글 추가 성공!')
        }
        await commentsMutation()
      } catch (error) {
        await commentsMutation(() => prevData, { revalidate: false })
        alert(`댓글 추가, 수정 실패 : ${error.message}`)
      } finally {
        setIsAdding(false)
      }
    },
    [commentsMutation, data, isAuthenticated, studyId, user]
  )

  const deleteCommentHandler = useCallback(
    async (commentId: string) => {
      if (!user || !isAuthenticated) return
      const prevData: CommentsWithProfile[] | null | undefined = data ?? []

      const optimisticUpdate = () => {
        const list = data ?? []

        return list.filter((item) => item.id !== commentId)
      }

      await commentsMutation(optimisticUpdate, { revalidate: false })
      try {
        await deleteComment(commentId)

        alert('댓글 삭제 성공')
        await commentsMutation()
      } catch (error) {
        await commentsMutation(() => prevData, { revalidate: false })
        alert(`댓글 삭제 실패 : ${error.message}`)
      }
    },
    [commentsMutation, data, isAuthenticated, user]
  )

  const contextState: CommentsContextValue = useMemo(() => {
    return {
      isAdding,
      isLoading,
      commentsData: data ?? [],
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
