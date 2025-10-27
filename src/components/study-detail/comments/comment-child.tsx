import type { User } from '@supabase/supabase-js'

import Spinner from '@/components/ui/spinner'
import { useCommentsChild } from '@/hooks/useCommentsChild'

import CommentLists from './comment-lists'

interface Props {
  user: User | null
  ownerId: string
  childCommentForm?: boolean
  parentId?: string
}

function ChildCommentsContainer({ user, ownerId }: Props) {
  const { commentsChildData, isLoading } = useCommentsChild()

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <CommentLists
        user={user}
        ownerId={ownerId}
        commentsData={commentsChildData}
      />
    </>
  )
}

export default ChildCommentsContainer
