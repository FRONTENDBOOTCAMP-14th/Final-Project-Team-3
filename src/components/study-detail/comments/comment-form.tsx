'use client'
import '@/styles/study-detail/comment.css'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { useComments } from '@/hooks/useComments'

interface Props {
  userId?: string | null
  commentId?: string
  comment?: string
  type?: 'MODIFY'
  setModifyComment?: Dispatch<SetStateAction<boolean>>
}

function CommentForm({
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

  const { upsertCommentsHandler, isAdding } = useComments()

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
      toast.warning('최소 한 글자 이상 적어주세요...', {
        action: {
          label: '닫기',
          onClick: () => {},
        },
      })
      return
    }

    await upsertCommentsHandler(comment, commentId, type)

    if (type === 'MODIFY' && setModifyComment) setModifyComment(false)
    setInputValue('')
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
                    disabled={isAdding}
                  >
                    {comment && type === 'MODIFY'
                      ? isAdding
                        ? '수정 중...'
                        : '수정'
                      : isAdding
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
