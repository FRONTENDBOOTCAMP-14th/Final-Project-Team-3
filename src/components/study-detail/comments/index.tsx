'use client'
import type { User } from '@supabase/supabase-js'

import { useComments } from '@/hooks/useComments'

import CommentForm from './comment-form'
import CommentLists from './comment-lists'

interface Props {
  user: User | null
  ownerId: string
}

function CommentsSection({ user, ownerId }: Props) {
  const { commentsData, upsertCommentsHandler, isAdding } = useComments()

  return (
    <section>
      <div className="comment-heading">
        <h3>댓글 ({commentsData.data?.length})</h3>
      </div>
      <CommentForm
        userId={user?.id}
        onCommentsHandler={upsertCommentsHandler}
        isAdding={isAdding}
      />
      <CommentLists user={user} ownerId={ownerId} commentsData={commentsData} />
    </section>
  )
}

export default CommentsSection
