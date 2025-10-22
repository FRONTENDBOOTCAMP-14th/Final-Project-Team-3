'use client'
import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import useSWR, { mutate } from 'swr'

import { useAuth } from '@/hooks/useAuth'
import type { Likes } from '@/libs/supabase'
import {
  getMyLikesStudyRoom,
  removeLikesStudyRoom,
  setLikesStudyRoom,
} from '@/libs/supabase/api/user'
import type { ResultType } from '@/types/apiResultsType'

export interface LikesContextValue {
  isLoading: boolean
  likesData: ResultType<Likes[]> | null
  isRoomLiked: (roomId: string) => boolean
  likesHandler: (studyId: string, userId: string) => Promise<void>
}

export const LikesContext = createContext<LikesContextValue | null>(null)
LikesContext.displayName = 'LikesContext'

const fetcher = async (
  userId: string,
  fetchFn: (userId: string) => Promise<ResultType<Likes[]> | null>
): Promise<ResultType<Likes[]> | null> => {
  if (!userId) return null
  return fetchFn(userId)
}

export function LikesProvider({ children }: PropsWithChildren) {
  const { user, isAuthenticated } = useAuth()
  const userId = user?.id
  const swrKey = isAuthenticated && userId ? ['likes', userId] : null
  const {
    data,
    isLoading,
    mutate: likesMutation,
  } = useSWR(swrKey, ([_key, userId]) => fetcher(userId, getMyLikesStudyRoom), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 10000,
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

  const isRoomLiked = useCallback(
    (studyId: string) => {
      return !!data?.data?.some((likes) => likes.room_id === studyId)
    },
    [data]
  )

  const likesHandler = useCallback(
    async (studyId: string, userId: string) => {
      const isCurrentLikes = isRoomLiked(studyId)

      let prevData: ResultType<Likes[]> | undefined | null

      const optimisticUpdate = (
        data: ResultType<Likes[]> | undefined | null
      ) => {
        prevData = data
        const list = data?.data ?? []

        if (!isCurrentLikes) {
          return {
            ok: true,
            data: [
              ...list,
              {
                id: crypto.randomUUID(),
                user_id: userId,
                room_id: studyId,
                created_at: new Date().toISOString(),
              },
            ],
          }
        } else {
          return {
            ok: true,
            data: list.filter((item) => item.room_id !== studyId),
          }
        }
      }
      await likesMutation(optimisticUpdate, {
        revalidate: false,
      })

      let result: { ok: boolean; message?: string | undefined }

      if (!isCurrentLikes) {
        result = await setLikesStudyRoom(studyId, userId)
        await mutate(['study_room_data', studyId])
      } else {
        result = await removeLikesStudyRoom(studyId, userId)
        await mutate(['study_room_data', studyId])
      }

      if (result.ok) {
        toast.success(result.message, {
          action: {
            label: '확인',
            onClick: () => {},
          },
        })
      } else {
        await likesMutation(() => prevData, { revalidate: false })
        toast.error(result.message, {
          action: {
            label: '확인',
            onClick: () => {},
          },
        })
      }
    },
    [isRoomLiked, likesMutation]
  )

  const contextState: LikesContextValue = useMemo(
    () => ({
      likesData: data ?? { ok: true, data: [] },
      isRoomLiked,
      isLoading,
      likesHandler,
    }),
    [data, isLoading, isRoomLiked, likesHandler]
  )

  return (
    <LikesContext.Provider value={contextState}>
      {children}
    </LikesContext.Provider>
  )
}
