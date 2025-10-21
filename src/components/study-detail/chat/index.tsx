'use client'
import '@/styles/study-detail/chat.css'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import Icons from '@/components/icons'
import { useAuth } from '@/hooks/useAuth'
import type { ChatWithProfile } from '@/libs/supabase/api/chat'
import { insertMessage } from '@/libs/supabase/api/chat'

interface Props {
  studyId: string
  messages: ChatWithProfile[] | []
}

function ChatModal({ studyId, messages }: Props) {
  const { user } = useAuth()
  const [newMessage, setNewMessage] = useState<string>('')
  const divRef = useRef<HTMLDivElement | null>(null)

  const onSubmitHandler = async () => {
    if (!user) return

    if (!newMessage.trim()) return

    await insertMessage(studyId, user.id, newMessage)
  }

  useEffect(() => {
    if (!divRef.current) return

    divRef.current.scrollTo({
      top: divRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages])

  return (
    <section className="chat-container">
      <div className="chat-heading">
        <h3>실시간 채팅</h3>
      </div>

      <div className="chat-message-contents" ref={divRef} tabIndex={0}>
        <div className="chat-message-contents-wrapper">
          {messages?.map((item: ChatWithProfile) => {
            const isMine = user?.id === item.profile.id

            return (
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
                    <span className="chat-date">00:00</span>
                  </p>
                  <p className="chat-user-message">{item.message}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="chat-message-form-wrapper">
        <form className="chat-message-form" action={onSubmitHandler}>
          <label htmlFor="chat-message-input" className="sr-only">
            메세지 입력
          </label>
          <input
            type="text"
            id="chat-message-input"
            className="chat-message-input"
            placeholder="채팅 입력"
            name="message"
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="chat-message-button">
            <Icons name="navigation" width={26} height={26} />
          </button>
        </form>
      </div>
    </section>
  )
}

export default ChatModal
