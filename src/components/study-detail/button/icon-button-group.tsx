'use client'
import type { User } from '@supabase/supabase-js'
import { useState } from 'react'

import Icons from '@/components/icons'
import { useBookMark } from '@/hooks/useBookmark'
import { useLikes } from '@/hooks/useLikes'
import { useMember } from '@/hooks/useMember'
import { useModal } from '@/hooks/useModal'
import type { StudyRoom } from '@/libs/supabase'

interface Props {
  user: User | null
  studyRoomData: StudyRoom
}

function IconsButtonGroup({ user, studyRoomData }: Props) {
  const [isDisabled, setIsDisabled] = useState(false)

  const { bookmarkHandler, isRoomBookmarked } = useBookMark()
  const { likesHandler, isRoomLiked } = useLikes()
  const { setOpenModal, setModalType } = useModal()
  const { participantsMembersData } = useMember()

  const isBookmark = isRoomBookmarked(studyRoomData.id)
  const isLikes = isRoomLiked(studyRoomData.id)

  const bookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!user) {
      alert('로그인이 필요합니다. : Bookmark')
      return
    }
    setIsDisabled(true)

    await bookmarkHandler(studyRoomData.id, user.id)

    setIsDisabled(false)
  }

  const likesToggle = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!user) {
      alert('로그인이 필요합니다. : Likes')
      return
    }
    setIsDisabled(true)

    await likesHandler(studyRoomData.id, user.id)

    setIsDisabled(false)
  }

  const isChat = () => {
    if (!user) {
      return
    }

    const isChecked =
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      participantsMembersData?.some((item) => item.id === user.id) ||
      studyRoomData.owner_id === user.id

    return isChecked
  }

  return (
    <>
      <button
        type="button"
        aria-label="좋아요 버튼"
        className="contents-icons-btn"
        disabled={isDisabled}
        onClick={likesToggle}
        title="좋아요 버튼"
      >
        <Icons
          name={isLikes ? 'heart-fill' : 'heart'}
          aria-hidden="true"
          width={32}
          height={32}
        />
      </button>
      <button
        type="button"
        aria-label="즐겨찾기 버튼"
        className="contents-icons-btn"
        disabled={isDisabled}
        onClick={bookmarkToggle}
        title="즐겨찾기 버튼"
      >
        <Icons
          name={isBookmark ? 'star-yellow-fill' : 'star'}
          width={32}
          height={32}
        />
      </button>
      {isChat() && (
        <button
          type="button"
          aria-label="채팅 버튼"
          className="contents-icons-btn"
          disabled={isDisabled}
          title="채팅 버튼"
          onClick={() => {
            setModalType('CHAT')
            setOpenModal(true)
          }}
        >
          <Icons name={'chat'} aria-hidden="true" width={32} height={32} />
        </button>
      )}
    </>
  )
}

export default IconsButtonGroup
