'use client'
import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useMemo } from 'react'
import useSWR from 'swr'

import type { Bookmark } from '@/libs/supabase'
import {
  getMyBookMarkStudyRoom,
  removeBookMarkStudyRoom,
  setBookMarkStudyRoom,
} from '@/libs/supabase/api/user'

import { useAuth } from '../hooks/useAuth'

export interface BookMarkContextValue {
  isLoading: boolean
  bookmarkData: Bookmark[] | null
  isRoomBookmarked: (roomId: string) => boolean
  bookmarkHandler: (studyId: string, userId: string) => Promise<void>
}

export const BookMarkContext = createContext<BookMarkContextValue | null>(null)
BookMarkContext.displayName = 'BookMarkContext'

const fetcher = async (
  userId: string,
  fetchFn: (userId: string) => Promise<Bookmark[] | null>
): Promise<Bookmark[] | null> => {
  if (!userId) return null
  return fetchFn(userId)
}

export function BookMarkProvider({ children }: PropsWithChildren) {
  const { user, isAuthenticated } = useAuth()
  const userId = user?.id
  const swrKey = isAuthenticated && userId ? ['bookmark', userId] : null
  const {
    data,
    isLoading,
    mutate: bookmarkMutation,
  } = useSWR(
    swrKey,
    ([_key, userId]) => fetcher(userId, getMyBookMarkStudyRoom),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 10000,
    }
  )

  const isRoomBookmarked = useCallback(
    (studyId: string) => {
      return !!data?.some((bookmark) => bookmark.room_id === studyId)
    },
    [data]
  )

  const bookmarkHandler = useCallback(
    async (studyId: string, userId: string) => {
      const isCurrentBookmark = isRoomBookmarked(studyId)

      const optimisticUpdate = (data: Bookmark[] | undefined | null) => {
        const list = data ?? []

        if (!isCurrentBookmark) {
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

      const prevData = await bookmarkMutation(optimisticUpdate, {
        revalidate: false,
      })

      try {
        if (!isCurrentBookmark) {
          await setBookMarkStudyRoom(studyId, userId)
          alert('즐겨찾기에 추가 되었습니다.!')
        } else {
          await removeBookMarkStudyRoom(studyId, userId)
          alert('즐겨찾기에서 삭제 되었습니다.!')
        }
      } catch (error) {
        await bookmarkMutation(() => prevData, { revalidate: false })
        alert(`즐겨찾기 추가 실패 : ${error.message}`)
      }
    },
    [bookmarkMutation, isRoomBookmarked]
  )

  const contextState: BookMarkContextValue = useMemo(
    () => ({
      bookmarkData: data ?? [],
      isRoomBookmarked,
      isLoading,
      bookmarkHandler,
    }),
    [bookmarkHandler, data, isLoading, isRoomBookmarked]
  )

  return (
    <BookMarkContext.Provider value={contextState}>
      {children}
    </BookMarkContext.Provider>
  )
}
