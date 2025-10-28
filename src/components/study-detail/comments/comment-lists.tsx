'use client'
import '@/styles/study-detail/comment.css'

import type { User } from '@supabase/supabase-js'

import type { CommentsWithProfile } from '@/libs/supabase/api/comments'
import type { ResultType } from '@/types/apiResultsType'

import CommentItem from './comment-item'

interface Props {
  user: User | null
  ownerId: string
  commentsData: ResultType<CommentsWithProfile[]> | null | undefined
}

function CommentLists({ user, ownerId, commentsData }: Props) {
  return (
    <div className="comment-lists-wrapper">
      {commentsData?.data?.length !== 0 ? (
        <ul className="comment-lists">
          {commentsData?.data?.map((item) => (
            <CommentItem
              commentData={item}
              key={item.id}
              user={user}
              ownerId={ownerId}
              parentId={item.parent_comment_Id ?? undefined}
              commentsLength={commentsData?.data?.length}
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
