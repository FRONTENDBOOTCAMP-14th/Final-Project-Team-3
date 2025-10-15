'use client'
import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useMemo } from 'react'
import useSWR from 'swr'

import type { Bookmark } from '@/libs/supabase'
import { getMyBookMarkStudyRoom } from '@/libs/supabase/api/user'

import { useAuth } from '../hooks/useAuth'

export interface BookMarkContextValue {
  isLoading: boolean
  bookmarkData: Bookmark[] | null
  isRoomBookmarked: (roomId: string) => boolean
  bookmarkMutation: (
    updater?: (
      prev: Bookmark[] | null | undefined
    ) => Bookmark[] | null | undefined,
    option?: { revalidate?: boolean }
  ) => Promise<Bookmark[] | null | undefined>
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
  const { data, isLoading, mutate } = useSWR(
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

  const contextState: BookMarkContextValue = useMemo(
    () => ({
      bookmarkData: data ?? [],
      isRoomBookmarked,
      isLoading,
      bookmarkMutation: mutate,
    }),
    [data, isLoading, isRoomBookmarked, mutate]
  )

  return (
    <BookMarkContext.Provider value={contextState}>
      {children}
    </BookMarkContext.Provider>
  )
}
