'use client'
import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useMemo } from 'react'
import useSWR from 'swr'

import { useAuth } from '@/hooks/useAuth'
import type { Likes } from '@/libs/supabase'
import {
  getMyLikesStudyRoom,
  removeLikesStudyRoom,
  setLikesStudyRoom,
} from '@/libs/supabase/api/user'

export interface LikesContextValue {
  isLoading: boolean
  likesData: Likes[] | null
  isRoomLiked: (roomId: string) => boolean
  likesHandler: (studyId: string, userId: string) => Promise<void>
}

export const LikesContext = createContext<LikesContextValue | null>(null)
LikesContext.displayName = 'LikesContext'

const fetcher = async (
  userId: string,
  fetchFn: (userId: string) => Promise<Likes[] | null>
): Promise<Likes[] | null> => {
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

  const isRoomLiked = useCallback(
    (studyId: string) => {
      return !!data?.some((likes) => likes.room_id === studyId)
    },
    [data]
  )

  const likesHandler = useCallback(
    async (studyId: string, userId: string) => {
      const isCurrentLikes = isRoomLiked(studyId)

      let prevData: Likes[] | undefined | null

      const optimisticUpdate = (data: Likes[] | undefined | null) => {
        prevData = data
        const list = data ?? []

        if (!isCurrentLikes) {
          return [
            ...list,
            {
              id: crypto.randomUUID(),
              user_id: userId,
              room_id: studyId,
              created_at: new Date().toISOString(),
            },
          ]
        } else {
          return list.filter((item) => item.room_id !== studyId)
        }
      }
      await likesMutation(optimisticUpdate, {
        revalidate: false,
      })

      try {
        if (!isCurrentLikes) {
          await setLikesStudyRoom(studyId, userId)
          alert('즐겨찾기에 추가 되었습니다.!')
        } else {
          await removeLikesStudyRoom(studyId, userId)
          alert('즐겨찾기에서 삭제 되었습니다.!')
        }
      } catch (error) {
        await likesMutation(() => prevData, { revalidate: false })
        alert(`즐겨찾기 추가 실패 : ${error.message}`)
      }
    },
    [isRoomLiked, likesMutation]
  )

  const contextState: LikesContextValue = useMemo(
    () => ({
      likesData: data ?? [],
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
