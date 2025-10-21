'use client'
import type { User } from '@supabase/supabase-js'

import { useComments } from '@/hooks/useComments'

import CommentForm from './comment-form'
import CommentLists from './comment-lists'

interface Props {
  user: User | null
}

function CommentsSection({ user }: Props) {
  const { commentsData } = useComments()

  return (
    <section>
      <div className="comment-heading">
        <h3>댓글 ({commentsData.length})</h3>
      </div>
      <CommentForm userId={user?.id} />
      <CommentLists commentData={commentsData} user={user} />
    </section>
  )
}

export default CommentsSection
