'use client'
import '@/styles/study-detail/comment.css'
import type { User } from '@supabase/supabase-js'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import Icons from '@/components/icons'
import { useComments } from '@/hooks/useComments'
import { useWindowResize } from '@/hooks/useWindowResize'
import type { CommentsWithProfile } from '@/libs/supabase/api/comments'

import CommentForm from './comment-form'

interface Props {
  commentData: CommentsWithProfile
  user: User | null
  ownerId: string
}

function CommentItem({ commentData, user, ownerId }: Props) {
  const [isShow, setIsShow] = useState<boolean>(false)
  const [btnVisibled, setBtnVisibled] = useState<boolean>(false)
  const [modifyComment, setModifyComment] = useState<boolean>(false)
  const [childCommentForm, setChildCommentForm] = useState<boolean>(false)
  const [childComment, setChildComment] = useState<boolean>(false)
  const pRef = useRef<HTMLParagraphElement | null>(null)
  const { deleteCommentHandler } = useComments()
  const size = useWindowResize()

  useEffect(() => {
    if (!pRef.current) return

    setBtnVisibled(pRef.current.scrollHeight > pRef.current.clientHeight)
  }, [size])

  const showCommentHandler = () => {
    setIsShow((prev) => !prev)
  }

  const deleteHandler = () => {
    if (!user) return

    deleteCommentHandler(commentData.id)
  }

  const modifyCommentHandler = () => {
    setModifyComment((prev) => !prev)
  }

  const childCommentFormHandler = () => {
    setChildCommentForm((prev) => !prev)
  }

  const childCommentHandler = () => {
    setChildComment((prev) => !prev)
  }

  return (
    <li className="comment-list-item" key={commentData.id}>
      <div className="comment-lists-user">
        <Image
          src={commentData.profile.profile_url ?? '/images/default-avatar'}
          alt={`${commentData.profile.nickname} 이미지`}
          width={50}
          height={50}
        />
        {ownerId === commentData.user_id && (
          <Icons
            className="owner-icon"
            name="star-blue-fill"
            width={18}
            height={18}
          />
        )}
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
                onClick={deleteHandler}
              >
                삭제
              </button>
            </>
          )}
        </div>
        {modifyComment ? (
          <CommentForm
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

        <div className="comment-info-button-group">
          <div className="child-comment-show-btn">
            <button type="button" onClick={childCommentHandler}>
              {childComment ? '답글 접기' : '답글 보기'}
            </button>
          </div>
          <div className="comment-etc-btn-group">
            <button
              type="button"
              className="child-commnet-form-btn"
              onClick={childCommentFormHandler}
            >
              {childCommentForm ? '닫기' : '답글'}
            </button>
            {btnVisibled && !modifyComment && (
              <button
                type="button"
                className="comment-more"
                onClick={showCommentHandler}
              >
                {isShow ? '접기' : '더보기'}
              </button>
            )}
          </div>
        </div>
        {childCommentForm && <CommentForm userId={user?.id} />}
        {childComment && (
          <ul>
            <li>대댓글 내용</li>
          </ul>
        )}
      </div>
    </li>
  )
}

export default CommentItem
