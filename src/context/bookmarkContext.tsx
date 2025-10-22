'use client'
import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

import { useAuth } from '@/hooks/useAuth'
import type { Bookmark } from '@/libs/supabase'
import {
  getMyBookMarkStudyRoom,
  removeBookMarkStudyRoom,
  setBookMarkStudyRoom,
} from '@/libs/supabase/api/user'
import type { ResultType } from '@/types/apiResultsType'

export interface BookMarkContextValue {
  isLoading: boolean
  bookmarkData: ResultType<Bookmark[]> | null
  isRoomBookmarked: (roomId: string) => boolean
  bookmarkHandler: (studyId: string, userId: string) => Promise<void>
}

export const BookMarkContext = createContext<BookMarkContextValue | null>(null)
BookMarkContext.displayName = 'BookMarkContext'

const fetcher = async (
  userId: string,
  fetchFn: (userId: string) => Promise<ResultType<Bookmark[]> | null>
): Promise<ResultType<Bookmark[]> | null> => {
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

  const isRoomBookmarked = useCallback(
    (studyId: string) => {
      return !!data?.data?.some((bookmark) => bookmark.room_id === studyId)
    },
    [data]
  )

  const bookmarkHandler = useCallback(
    async (studyId: string, userId: string) => {
      const isCurrentBookmark = isRoomBookmarked(studyId)

      let prevData: ResultType<Bookmark[]> | undefined | null

      const optimisticUpdate = (
        data: ResultType<Bookmark[]> | undefined | null
      ) => {
        prevData = data
        const list = data?.data ?? []

        if (!isCurrentBookmark) {
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
      await bookmarkMutation(optimisticUpdate, {
        revalidate: false,
      })

      let result: { ok: boolean; message?: string | undefined }

      if (!isCurrentBookmark) {
        result = await setBookMarkStudyRoom(studyId, userId)
      } else {
        result = await removeBookMarkStudyRoom(studyId, userId)
      }

      if (result.ok) {
        toast.success(result.message)
      } else {
        await bookmarkMutation(() => prevData, { revalidate: false })
        toast.error(result.message)
      }
    },
    [bookmarkMutation, isRoomBookmarked]
  )

  const contextState: BookMarkContextValue = useMemo(
    () => ({
      bookmarkData: data ?? { ok: true, data: [] },
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
