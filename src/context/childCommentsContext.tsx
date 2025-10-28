'use client'
import type { PropsWithChildren } from 'react'
import { createContext, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

import {
  getChildComments,
  type CommentsWithProfile,
} from '@/libs/supabase/api/comments'
import type { ResultType } from '@/types/apiResultsType'

export interface ChildCommentsContextValue {
  isLoading: boolean
  commentsChildData: ResultType<CommentsWithProfile[]> | null | undefined
}

export const ChildCommentsContext =
  createContext<ChildCommentsContextValue | null>(null)

ChildCommentsContext.displayName = 'ChildCommentsContext'

const fetcher = async (
  studyId: string,
  parentId: string,
  fetchFn: (
    studyId: string,
    parentId: string
  ) => Promise<ResultType<CommentsWithProfile[]> | null>
): Promise<ResultType<CommentsWithProfile[]> | null> => {
  if (!studyId) return null

  return fetchFn(studyId, parentId)
}

export function ChildCommentsProvider({
  children,
  studyId,
  parentId,
}: PropsWithChildren<{ studyId: string; parentId: string }>) {
  const swrKey =
    studyId && parentId ? [`commentsChild_${studyId}_${parentId}`] : null
  const { data, isLoading } = useSWR(
    swrKey,
    () => fetcher(studyId, parentId, getChildComments),
    {
      revalidateOnFocus: false,
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

  const contextState: ChildCommentsContextValue = useMemo(() => {
    return {
      isLoading,
      commentsChildData: data ?? { ok: true, data: [] },
    }
  }, [data, isLoading])

  return (
    <ChildCommentsContext.Provider value={contextState}>
      {children}
    </ChildCommentsContext.Provider>
  )
}
