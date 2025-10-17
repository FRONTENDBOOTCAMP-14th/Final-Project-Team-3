import '@/styles/study-detail/comment.css'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useRef, useState, useTransition } from 'react'

import { addComments } from '@/libs/supabase/api/comments'

interface Props {
  studyId: string
  userId?: string | null
  commentId?: string
  comment?: string
  type?: 'MODIFY'
  setModifyComment?: Dispatch<SetStateAction<boolean>>
}

function CommentForm({
  studyId,
  userId,
  type,
  commentId,
  comment,
  setModifyComment,
}: Props) {
  const formRef = useRef<HTMLFormElement | null>(null)
  const [inputValue, setInputValue] = useState<string>(
    type === 'MODIFY' && comment && userId ? comment : ''
  )
  const [debounceValue, setDebounceValue] = useState<string>('')

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(inputValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [inputValue])

  useEffect(() => {
    if (!userId) setInputValue('')
  }, [userId])

  const submitHandler = async (formData: FormData) => {
    const comment = formData.get('comment') as string

    if (!comment.trim()) {
      alert('최소 한 글자 이상 적어주세요...')
      return
    }

    startTransition(async () => {
      try {
        await addComments(studyId, comment, commentId)

        if (type === 'MODIFY' && setModifyComment) setModifyComment(false)
        setInputValue('')
        alert(type === 'MODIFY' ? '댓글 수정 성공!' : '댓글 추가 성공!')
      } catch (_error) {
        alert(type === 'MODIFY' ? '댓글 수정 실패...' : '댓글 추가 실패...')
      }
    })
  }

  return (
    <div className="comment-wrapper">
      <div className="comment-form-wrapper">
        <form className="comment-form" action={submitHandler} ref={formRef}>
          <label htmlFor="comment-input"></label>
          <input
            type="text"
            placeholder={userId ? '댓글 쓰기...' : '로그인 해주세요!!!'}
            id="comment-input"
            className="comment-input"
            name="comment"
            required
            autoComplete="off"
            value={inputValue}
            disabled={userId ? false : true}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <div className="comment-btn-group">
            {debounceValue.trim() !== '' &&
              comment !== inputValue &&
              userId && (
                <>
                  {!type && !comment && (
                    <button
                      type="button"
                      className="comment-form-btn cancel-btn"
                      onClick={() => {
                        formRef.current?.reset()
                        setInputValue('')
                      }}
                    >
                      취소
                    </button>
                  )}
                  <button
                    type="submit"
                    className="comment-form-btn"
                    disabled={isPending}
                  >
                    {comment && type === 'MODIFY'
                      ? isPending
                        ? '수정 중...'
                        : '수정'
                      : isPending
                        ? '등록 중...'
                        : '등록'}
                  </button>
                </>
              )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default CommentForm
