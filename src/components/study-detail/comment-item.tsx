import '@/styles/study-detail/comment.css'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import type { CommentsWithProfile } from '@/libs/supabase/api/comments'

interface Props {
  commentData: CommentsWithProfile
}

function CommentItem({ commentData }: Props) {
  const [isShow, setIsShow] = useState(false)
  const [btnVisibled, setBtnVisibled] = useState<boolean>(false)
  const pRef = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    if (!pRef.current) return

    setBtnVisibled(pRef.current.scrollHeight > pRef.current.clientHeight)
  }, [])

  const showCommentHandler = () => {
    setIsShow((prev) => !prev)
  }

  return (
    <li className="comment-list-item" key={commentData.id}>
      <div className="comment-lists-user">
        <Image
          src={commentData.profile.profile_url ?? '/images/default-avatar'}
          alt={`${commentData.profile.nickname} 이미지`}
          width={60}
          height={60}
        />
      </div>
      <div className="comment-info">
        <span>{commentData.profile.nickname}</span>
        <p className={isShow ? 'active' : ''} ref={pRef}>
          {commentData.comment}
        </p>
        {btnVisibled && (
          <button className="comment-more" onClick={showCommentHandler}>
            {isShow ? '접기' : '더보기'}
          </button>
        )}
      </div>
    </li>
  )
}

export default CommentItem
