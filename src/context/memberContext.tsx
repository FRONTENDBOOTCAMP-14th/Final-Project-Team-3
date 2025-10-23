'use client'
import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

import { useAuth } from '@/hooks/useAuth'
import type { Profile, StudyRoom, StudyRoomRequests } from '@/libs/supabase'
import {
  getStudyRoomDetail,
  getStudyRoomParticipants,
  StudyRoomRequestsFn,
  studyRoomRequestsLists,
} from '@/libs/supabase/api/study-room'
import type { ResultType } from '@/types/apiResultsType'

export interface MemberContextValue {
  studyRoomData: ResultType<StudyRoom> | null | undefined
  requestMembersData: ResultType<Profile[]> | null | undefined
  participantsMembersData: ResultType<Profile[]> | null | undefined
  requestsHandler: (
    memberId: string,
    status: 'REJECTED' | 'APPROVED' | 'DEPORTATION' | 'PENDING'
  ) => Promise<ResultType<StudyRoomRequests> | null | undefined>
}

export const MemberContext = createContext<MemberContextValue | null>(null)
MemberContext.displayName = 'MemberContext'

const studyFetcher = async (
  studyId: string,
  fetchFn: (studyId: string) => Promise<ResultType<StudyRoom>>
) => {
  if (!studyId) return null
  return fetchFn(studyId)
}

const memberFetcher = async (
  studyId: string,
  fetchFn: (studyId: string) => Promise<ResultType<Profile[]>>
) => {
  if (!studyId) return null
  return fetchFn(studyId)
}
const participantsFetcher = async (
  studyId: string,
  fetchFn: (studyId: string) => Promise<ResultType<Profile[]>>
) => {
  if (!studyId) return null
  return fetchFn(studyId)
}

export function MemberProvider({
  children,
  studyId,
  studyData,
}: PropsWithChildren<{ studyId: string; studyData: ResultType<StudyRoom> }>) {
  const { user } = useAuth()
  const swrStudyKey = studyId ? [`study_room_data_${studyId}`] : null
  const swrMemberKey = studyId ? [`member_data_${studyId}`] : null
  const swrApplicantKey = studyId ? [`applicant_data_${studyId}`] : null
  const { data: studyRoomData, mutate: studyDataMutation } = useSWR(
    swrStudyKey,
    () => studyFetcher(studyId, getStudyRoomDetail),
    {
      revalidateOnFocus: false,
      fallbackData: studyData,
    }
  )

  const { data: requestMembersData, mutate: requestMemberDataMutation } =
    useSWR(swrMemberKey, () => memberFetcher(studyId, studyRoomRequestsLists), {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 10000,
    })

  const {
    data: participantsMembersData,
    mutate: participantsMemberDataMutation,
  } = useSWR(
    swrApplicantKey,
    () => participantsFetcher(studyId, getStudyRoomParticipants),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 10000,
    }
  )

  const requestsHandler = useCallback(
    async (
      memberId: string,
      status: 'REJECTED' | 'APPROVED' | 'DEPORTATION' | 'PENDING'
    ) => {
      if (!user) return

      const prevData: ResultType<StudyRoom> | null = studyRoomData ?? null
      const prevMember: ResultType<Profile[]> | null =
        requestMembersData ?? null
      const prevParticipants: ResultType<Profile[]> | null =
        participantsMembersData ?? null

      const optimisticUpdate = () => {
        const list = studyRoomData?.data

        if (!list) return null
        if (status === 'APPROVED') {
          return {
            ok: true,
            data: {
              ...list,
              member_count: Math.max(0, list.member_count + 1),
            },
          }
        } else if (status === 'DEPORTATION') {
          return {
            ok: true,
            data: {
              ...list,
              member_count: Math.max(0, list.member_count - 1),
            },
          }
        } else {
          return { ok: true, data: list }
        }
      }

      const optimisticMemberUpdate = () => {
        const list = prevMember?.data ?? []

        return { ok: true, data: list.filter((item) => item.id !== memberId) }
      }

      const optimisticParticipantsUpdate = () => {
        const list = prevParticipants?.data ?? []

        if (status === 'APPROVED') {
          const approvedMember = requestMembersData?.data?.find(
            (item) => item.id === memberId
          )
          if (!approvedMember) return { ok: true, data: list }
          return { ok: true, data: [...list, approvedMember] }
        } else if (status === 'DEPORTATION') {
          return { ok: true, data: list.filter((item) => item.id !== memberId) }
        }

        return { ok: true, data: list }
      }

      await studyDataMutation(optimisticUpdate, { revalidate: false })
      await requestMemberDataMutation(optimisticMemberUpdate, {
        revalidate: false,
      })
      await participantsMemberDataMutation(optimisticParticipantsUpdate, {
        revalidate: false,
      })

      const result = await StudyRoomRequestsFn(studyId, memberId, status)

      await studyDataMutation()
      await requestMemberDataMutation()
      await participantsMemberDataMutation()

      if (result?.ok) {
        toast.success(result.message, {
          action: {
            label: '확인',
            onClick: () => {},
          },
        })

        return result
      } else {
        await studyDataMutation(() => prevData, { revalidate: false })
        await requestMemberDataMutation(() => prevMember, { revalidate: false })
        await participantsMemberDataMutation(() => prevParticipants, {
          revalidate: false,
        })

        toast.error(result?.message, {
          action: {
            label: '확인',
            onClick: () => {},
          },
        })
      }
    },
    [
      user,
      studyRoomData,
      requestMembersData,
      participantsMembersData,
      studyDataMutation,
      requestMemberDataMutation,
      participantsMemberDataMutation,
      studyId,
    ]
  )

  const contextState: MemberContextValue = useMemo(
    () => ({
      requestsHandler,
      requestMembersData,
      studyRoomData,
      participantsMembersData,
    }),
    [
      participantsMembersData,
      requestMembersData,
      requestsHandler,
      studyRoomData,
    ]
  )

  return (
    <MemberContext.Provider value={contextState}>
      {children}
    </MemberContext.Provider>
  )
}
