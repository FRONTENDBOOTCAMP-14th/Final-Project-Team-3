'use client'
import '@/styles/study-detail/members-modal.css'
import type { User } from '@supabase/supabase-js'
import { useEffect, useRef, useState } from 'react'

import { useAuth } from '@/hooks/useAuth'
import useFocusTrap from '@/hooks/useFocusTrap'
import useKeyEvent from '@/hooks/useKeyEvent'
import { useModal } from '@/hooks/useModal'
import useScrollLock from '@/hooks/useScrollLock'
import type { Chat, Profile } from '@/libs/supabase'
import type { ChatWithProfile } from '@/libs/supabase/api/chat'
import { getChatMessages } from '@/libs/supabase/api/chat'
import { getUserProfile } from '@/libs/supabase/api/user'
import supabase from '@/libs/supabase/client'

import ChatModal from '../chat'

import ApplicantContent from './applicant-content'
import MembersContent from './members-content'

interface ModalProps {
  isOwner: boolean
  user: User | null
  ownerProfile: Profile
  studyId: string
}

function DetailModal({ isOwner, ownerProfile, studyId }: ModalProps) {
  const requestModalRef = useRef<HTMLDivElement | null>(null)
  const { user } = useAuth()
  const { modalType, openModal, setModalType, setOpenModal } = useModal()
  const [messages, setMessages] = useState<ChatWithProfile[] | []>([])

  useScrollLock(openModal, 'member-list-modal-container')
  useFocusTrap(requestModalRef, openModal)
  useKeyEvent(
    'Escape',
    () => {
      setOpenModal(false)
      setModalType(null)
    },
    openModal
  )

  useEffect(() => {
    const messageFetch = async () => {
      const data = await getChatMessages(studyId)

      setMessages(data)
    }

    messageFetch()
  }, [studyId])

  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel(`study_room_${studyId}`)
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
              id: data?.id as string,
              nickname: data?.nickname as string,
              profile_url: data?.profile_url as string,
            },
          }

          setMessages((prev) => [...prev, chatWithProfile])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [studyId, user])

  return (
    openModal && (
      <div
        className="member-list-modal-container"
        ref={requestModalRef}
        onClick={() => {
          setOpenModal((prev) => !prev)
          setModalType(null)
        }}
      >
        <div
          className="member-list-modal-wrapper"
          onClick={(e) => e.stopPropagation()}
        >
          {ModalContentType(
            { modalType },
            isOwner,
            ownerProfile,
            studyId,
            messages
          )}
        </div>
      </div>
    )
  )
}

export default DetailModal

function ModalContentType(
  { modalType }: { modalType: 'MEMBER' | 'APPLICANT' | 'CHAT' | null },
  isOwner: boolean = false,
  ownerProfile: Profile,
  studyId: string,
  messages: ChatWithProfile[] | []
) {
  switch (modalType) {
    case 'MEMBER':
      return <MembersContent isOwner={isOwner} ownerProfile={ownerProfile} />

    case 'APPLICANT':
      return <ApplicantContent isOwner={isOwner} />

    case 'CHAT':
      return <ChatModal studyId={studyId} messages={messages} />

    default:
      return null
  }
}
