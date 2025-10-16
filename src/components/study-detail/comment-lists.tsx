import '@/styles/study-detail/comment.css'

import type { CommentsWithProfile } from '@/libs/supabase/api/comments'

import CommentItem from './comment-item'

interface Props {
  commentData: CommentsWithProfile[]
}

function CommentLists({ commentData }: Props) {
  return (
    <div className="comment-lists-wrapper">
      {commentData.length !== 0 ? (
        <ul className="comment-lists">
          {commentData.map((item) => (
            <CommentItem commentData={item} key={item.id} />
          ))}
        </ul>
      ) : (
        <p>댓글이 없습니다...</p>
      )}
    </div>
  )
}

export default CommentLists
