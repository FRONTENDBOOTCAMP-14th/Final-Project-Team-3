'use client'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

import type { Chat } from '@/libs/supabase'
import { getChatMessages, type ChatWithProfile } from '@/libs/supabase/api/chat'
import { getUserProfile } from '@/libs/supabase/api/user'
import supabase from '@/libs/supabase/client'
import type { ResultType } from '@/types/apiResultsType'

const fetcher = async (
  studyId: string,
  fetchFn: (studyId: string) => Promise<ResultType<ChatWithProfile[]> | null>
): Promise<ResultType<ChatWithProfile[]> | null> => {
  if (!studyId) return null
  return fetchFn(studyId)
}

export function useChat(studyId: string, userId: string | undefined) {
  const [messages, setMessages] = useState<ChatWithProfile[] | []>([])
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const swrKey = studyId && userId ? [`messages_${studyId}`] : null
  const { data, isLoading } = useSWR(swrKey, () =>
    fetcher(studyId, getChatMessages)
  )

  useEffect(() => {
    if (!studyId) return

    const initialSetup = async () => {
      setMessages(data?.data ?? [])
    }

    initialSetup()

    const channel = supabase.channel(`study_room_${studyId}`)

    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat',
          filter: `room_id=eq.${studyId}`,
        },
        async (payload) => {
          const newMessage = payload.new as Chat

          const data = await getUserProfile(newMessage.user_id)

          const chatWithProfile: ChatWithProfile = {
            ...newMessage,
            profile: {
              id: data?.data?.id as string,
              nickname: data?.data?.nickname as string,
              profile_url: data?.data?.profile_url as string,
            },
          }

          setMessages((prev) => [...prev, chatWithProfile])
        }
      )
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
        } else {
          setIsConnected(false)
        }
      })

    return () => {
      setIsConnected(false)
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [data, studyId, userId])

  return { messages, isConnected, isLoading }
}
