import type { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

import type { StudyRoom } from '@/libs/supabase'
import {
  addComments,
  deleteComment,
  getComments,
  type CommentsWithProfile,
} from '@/libs/supabase/api/comments'

import CommentForm from './comment-form'
import CommentLists from './comment-lists'

interface Props {
  studyRoomData: StudyRoom
  user: User | null
}

function CommentsSection({ studyRoomData, user }: Props) {
  const [commentData, setCommentData] = useState<CommentsWithProfile[] | []>([])

  useEffect(() => {
    const commentFetch = async () => {
      const data = await getComments(studyRoomData.id)

      setCommentData(data)
    }

    commentFetch()
  }, [studyRoomData.id])

  const commentsHandler = async (
    comment: string,
    commentId?: string,
    type?: 'MODIFY'
  ) => {
    const data = await addComments(studyRoomData.id, comment, commentId)

    if (type === 'MODIFY') {
      setCommentData((prev) =>
        prev.map((item: CommentsWithProfile) =>
          item.id === data.id ? data : item
        )
      )
    } else {
      setCommentData((prev) => [data, ...prev])
    }
  }

  const commentDeleteHandler = async (commentId: string) => {
    await deleteComment(commentId)

    setCommentData((prev) =>
      prev.filter((item: CommentsWithProfile) => item.id !== commentId)
    )
  }

  return (
    <section>
      <div className="comment-heading">
        <h3>댓글 ({commentData.length})</h3>
      </div>
      <CommentForm userId={user?.id} commentsHandler={commentsHandler} />
      <CommentLists
        commentData={commentData}
        user={user}
        commentsHandler={commentsHandler}
        commentDeleteHandler={commentDeleteHandler}
      />
    </section>
  )
}

export default CommentsSection
