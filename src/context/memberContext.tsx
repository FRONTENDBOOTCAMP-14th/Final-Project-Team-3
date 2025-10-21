'use client'
import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useMemo } from 'react'
import useSWR from 'swr'

import { useAuth } from '@/hooks/useAuth'
import type { Profile, StudyRoom, StudyRoomRequests } from '@/libs/supabase'
import {
  getStudyRoomDetail,
  getStudyRoomParticipants,
  StudyRoomRequestsFn,
  studyRoomRequestsLists,
} from '@/libs/supabase/api/study-room'

export interface MemberContextValue {
  studyRoomData: StudyRoom | null | undefined
  requestMembersData: Profile[] | null | undefined
  participantsMembersData: Profile[] | null | undefined
  requestsHandler: (
    memberId: string,
    status: 'REJECTED' | 'APPROVED' | 'DEPORTATION' | 'PENDING'
  ) => Promise<StudyRoomRequests | null | undefined>
}

export const MemberContext = createContext<MemberContextValue | null>(null)
MemberContext.displayName = 'MemberContext'

const studyFetcher = async (
  studyId: string,
  fetchFn: (studyId: string) => Promise<StudyRoom>
) => {
  if (!studyId) return null
  return fetchFn(studyId)
}

const memberFetcher = async (
  studyId: string,
  fetchFn: (studyId: string) => Promise<Profile[]>
) => {
  if (!studyId) return null
  return fetchFn(studyId)
}
const participantsFetcher = async (
  studyId: string,
  fetchFn: (studyId: string) => Promise<Profile[]>
) => {
  if (!studyId) return null
  return fetchFn(studyId)
}

export function MemberProvider({
  children,
  studyId,
  studyData,
}: PropsWithChildren<{ studyId: string; studyData: StudyRoom }>) {
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

      const prevData: StudyRoom | null = studyRoomData ?? null
      const prevMember: Profile[] | null = requestMembersData ?? null
      const prevParticipants: Profile[] | null = participantsMembersData ?? null

      const optimisticUpdate = () => {
        const list = studyRoomData

        if (!list) return null
        if (status === 'APPROVED') {
          return {
            ...list,
            member_count: Math.max(0, list.member_count + 1),
          }
        } else if (status === 'DEPORTATION') {
          return {
            ...list,
            member_count: Math.max(0, list.member_count - 1),
          }
        } else {
          return list
        }
      }

      const optimisticMemberUpdate = () => {
        const list = prevMember ?? []

        return list.filter((item) => item.id !== memberId)
      }

      const optimisticParticipantsUpdate = () => {
        const list = prevParticipants ?? []

        if (status === 'APPROVED') {
          const approvedMember = requestMembersData?.find(
            (item) => item.id === memberId
          )
          if (!approvedMember) return list
          return [...list, approvedMember]
        } else if (status === 'DEPORTATION') {
          return list.filter((item) => item.id !== memberId)
        }

        return list
      }

      await studyDataMutation(optimisticUpdate, { revalidate: false })
      await requestMemberDataMutation(optimisticMemberUpdate, {
        revalidate: false,
      })
      await participantsMemberDataMutation(optimisticParticipantsUpdate, {
        revalidate: false,
      })

      try {
        const data = await StudyRoomRequestsFn(studyId, memberId, status)

        alert(data?.request_message)

        await studyDataMutation()
        await requestMemberDataMutation()
        await participantsMemberDataMutation()

        return data
      } catch (error) {
        await studyDataMutation(() => prevData, { revalidate: false })
        await requestMemberDataMutation(() => prevMember, { revalidate: false })
        await participantsMemberDataMutation(() => prevParticipants, {
          revalidate: false,
        })
        alert(error.message)
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
