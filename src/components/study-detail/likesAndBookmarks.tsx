import type { User } from '@supabase/supabase-js'
import { useState } from 'react'

import Icons from '@/components/icons'
import { useBookMark } from '@/hooks/useBookmark'
import { useLikes } from '@/hooks/useLikes'
import type { StudyRoom } from '@/libs/supabase'

interface Props {
  user: User | null
  studyRoomData: StudyRoom
}

function LikesAndBookmarks({ user, studyRoomData }: Props) {
  const [isDisabled, setIsDisabled] = useState(false)

  const { bookmarkHandler, isRoomBookmarked } = useBookMark()
  const { likesHandler, isRoomLiked } = useLikes()

  const isBookmark = isRoomBookmarked(studyRoomData.id)
  const isLikes = isRoomLiked(studyRoomData.id)

  const bookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }
    setIsDisabled(true)

    await bookmarkHandler(studyRoomData.id, user.id)

    setIsDisabled(false)
  }

  const likesToggle = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }
    setIsDisabled(true)

    await likesHandler(studyRoomData.id, user.id)

    setIsDisabled(false)
  }
  return (
    <>
      <button
        type="button"
        aria-label="좋아요 버튼"
        className="contents-icons-btn"
        disabled={isDisabled}
        onClick={likesToggle}
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
      >
        <Icons
          name={isBookmark ? 'star-yellow-fill' : 'star'}
          width={32}
          height={32}
        />
      </button>
    </>
  )
}

export default LikesAndBookmarks
