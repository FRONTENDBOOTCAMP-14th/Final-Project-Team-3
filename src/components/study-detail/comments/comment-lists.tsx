'use client'
import '@/styles/study-detail/comment.css'

import type { User } from '@supabase/supabase-js'

import type { CommentsWithProfile } from '@/libs/supabase/api/comments'

import CommentItem from './comment-item'

interface Props {
  commentData: CommentsWithProfile[]
  user: User | null
  commentsHandler: (
    comment: string,
    commentId?: string,
    type?: 'MODIFY'
  ) => Promise<void>
  commentDeleteHandler: (commentId: string) => Promise<void>
}

function CommentLists({
  commentData,
  user,
  commentsHandler,
  commentDeleteHandler,
}: Props) {
  return (
    <div className="comment-lists-wrapper">
      {commentData.length !== 0 ? (
        <ul className="comment-lists">
          {commentData.map((item) => (
            <CommentItem
              commentData={item}
              key={item.id}
              user={user}
              commentsHandler={commentsHandler}
              commentDeleteHandler={commentDeleteHandler}
            />
          ))}
        </ul>
      ) : (
        <p>댓글이 없습니다...</p>
      )}
    </div>
  )
}

export default CommentLists
