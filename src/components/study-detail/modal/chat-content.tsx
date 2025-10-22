'use client'
import '@/styles/study-detail/chat.css'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

import Icons from '@/components/icons'
import { useAuth } from '@/hooks/useAuth'
import { useChat } from '@/hooks/useChat'
import { useMember } from '@/hooks/useMember'
import type { ChatWithProfile } from '@/libs/supabase/api/chat'
import { insertMessage } from '@/libs/supabase/api/chat'
import { formatDate, formatDateSeparator } from '@/utils/formatDate'

interface Props {
  studyId: string
}

function ChatContent({ studyId }: Props) {
  const { user } = useAuth()
  const { participantsMembersData } = useMember()
  const { messages, isConnected } = useChat(studyId, user?.id)
  const [newMessage, setNewMessage] = useState<string>('')
  const divRef = useRef<HTMLDivElement | null>(null)

  const length = !participantsMembersData?.length
    ? 1
    : participantsMembersData?.length + 1

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!newMessage.trim()) return

    try {
      await insertMessage(studyId, user.id, newMessage)
      setNewMessage('')
    } catch (error) {
      alert(error.message)
    }
  }

  useEffect(() => {
    if (!divRef.current || messages.length === 0) return

    const frameId = requestAnimationFrame(() => {
      divRef.current?.scrollTo({
        top: divRef.current.scrollHeight,
        behavior: 'smooth',
      })
    })

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [messages])

  const isSameDayInKST = (isoString1: string, isoString2: string) => {
    if (!isoString1 || !isoString2) return false

    const date1 = new Date(isoString1)
    const date2 = new Date(isoString2)

    const format: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Seoul',
    }
    const day1 = date1.toLocaleString('ko-KR', format)
    const day2 = date2.toLocaleString('ko-KR', format)

    return day1 === day2
  }

  return (
    <section className="chat-container">
      <div className="chat-heading">
        <h3>실시간 채팅({length})</h3>
      </div>

      <div className="chat-message-contents" ref={divRef} tabIndex={0}>
        <div className="chat-message-contents-wrapper">
          {messages?.map((item: ChatWithProfile, idx: number) => {
            const isMine = user?.id === item.profile.id
            const prevItem = messages[idx - 1]
            const showDateSeparator =
              idx === 0 || !isSameDayInKST(item.created_at, prevItem.created_at)
            return (
              <React.Fragment key={item.id}>
                {showDateSeparator && (
                  <div className="chat-date-separator">
                    <span>{formatDateSeparator(item.created_at)}</span>
                  </div>
                )}
                <div
                  key={item.id}
                  className={`chat-user-contents ${isMine && 'is-mine'}`}
                >
                  <Image
                    src={item.profile.profile_url ?? '/images/default-avatar'}
                    alt={''}
                    width={36}
                    height={36}
                  />
                  <div className="chat-user">
                    <p className="chat-user-date">
                      <span className="chat-username">
                        {isMine ? '본인' : item.profile.nickname}
                      </span>
                      <span className="chat-date">
                        {formatDate(item.created_at)}
                      </span>
                    </p>
                    <p className="chat-user-message">{item.message}</p>
                  </div>
                </div>
              </React.Fragment>
            )
          })}
        </div>
      </div>

      <div className="chat-message-form-wrapper">
        <form className="chat-message-form" onSubmit={onSubmitHandler}>
          <label htmlFor="chat-message-input" className="sr-only">
            메세지 입력
          </label>
          <input
            type="text"
            id="chat-message-input"
            className="chat-message-input"
            placeholder="채팅 입력"
            value={newMessage}
            required
            autoComplete="off"
            name="message"
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="chat-message-button"
            disabled={!newMessage.trim() || !isConnected}
          >
            <Icons name="navigation" width={26} height={26} />
          </button>
        </form>
      </div>
    </section>
  )
}

export default ChatContent
