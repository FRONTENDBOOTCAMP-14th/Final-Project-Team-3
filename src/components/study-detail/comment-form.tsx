import '@/styles/study-detail/comment.css'
import { useTransition } from 'react'

import { addComments } from '@/libs/supabase/api/comments'

interface Props {
  studyId: string
  userId?: string | null
}

function CommentForm({ studyId }: Props) {
  const [isPending, startTransition] = useTransition()

  const submitHandler = async (formData: FormData) => {
    const comment = formData.get('comment') as string

    if (!comment.trim()) return

    startTransition(async () => {
      try {
        await addComments(studyId, comment)
        alert('댓글 추가 성공!')
      } catch (_error) {
        alert('댓글 추가 실패')
      }
    })
  }

  return (
    <div className="comment-wrapper">
      <div className="comment-heading">
        <h3>댓글 (0)</h3>
      </div>

      <div className="comment-form-wrapper">
        <form className="comment-form" action={submitHandler}>
          <label htmlFor="comment-input"></label>
          <input
            type="text"
            placeholder="댓글 쓰기..."
            id="comment-input"
            className="comment-input"
            name="comment"
            required
            autoComplete="off"
          />

          <div className="comment-btn-group">
            <button type="button" className="comment-btn cancel-btn">
              취소
            </button>
            <button type="submit" className="comment-btn" disabled={isPending}>
              {isPending ? '추가 중...' : '댓글'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CommentForm
