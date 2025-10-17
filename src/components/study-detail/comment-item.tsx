import '@/styles/study-detail/comment.css'
import type { User } from '@supabase/supabase-js'
import Image from 'next/image'
import { useEffect, useRef, useState, useTransition } from 'react'

import {
  type CommentsWithProfile,
  deleteComment,
} from '@/libs/supabase/api/comments'

import CommentForm from './comment-form'

interface Props {
  commentData: CommentsWithProfile
  user: User | null
}

function CommentItem({ commentData, user }: Props) {
  const [isShow, setIsShow] = useState<boolean>(false)
  const [btnVisibled, setBtnVisibled] = useState<boolean>(false)
  const [modifyComment, setModifyComment] = useState<boolean>(false)
  const pRef = useRef<HTMLParagraphElement | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!pRef.current) return

    setBtnVisibled(pRef.current.scrollHeight > pRef.current.clientHeight)
  }, [])

  const showCommentHandler = () => {
    setIsShow((prev) => !prev)
  }

  const deleteCommentHandler = async () => {
    if (!user) return

    startTransition(async () => {
      try {
        await deleteComment(commentData.id, commentData.room_id, user.id)

        alert('삭제 되었습니다.')
      } catch (error) {
        alert(`삭제 실패!! ${error.message}`)
      }
    })
  }

  const modifyCommentHandler = () => {
    setModifyComment((prev) => !prev)
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
        <div>
          <span>{commentData.profile.nickname}</span>
          {commentData.profile.id === user?.id && (
            <>
              <button
                type="button"
                className="comment-btn modify"
                onClick={modifyCommentHandler}
              >
                {modifyComment ? '취소' : '수정'}
              </button>
              <button
                type="button"
                className="comment-btn delete"
                onClick={deleteCommentHandler}
              >
                {isPending ? '삭제 중...' : '삭제'}
              </button>
            </>
          )}
        </div>
        {modifyComment ? (
          <CommentForm
            studyId={commentData.room_id}
            userId={user?.id}
            setModifyComment={setModifyComment}
            type="MODIFY"
            commentId={commentData.id}
            comment={commentData.comment}
          />
        ) : (
          <p className={isShow ? 'active' : ''} ref={pRef}>
            {commentData.comment}
          </p>
        )}

        {btnVisibled && !modifyComment && (
          <button className="comment-more" onClick={showCommentHandler}>
            {isShow ? '접기' : '더보기'}
          </button>
        )}
      </div>
    </li>
  )
}

export default CommentItem
