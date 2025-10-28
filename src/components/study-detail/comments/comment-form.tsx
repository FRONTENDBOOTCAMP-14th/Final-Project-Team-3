'use client'
import '@/styles/study-detail/comment.css'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

interface Props {
  userId?: string | null
  commentId?: string
  comment?: string
  setModifyComment?: Dispatch<SetStateAction<boolean>>
  parentId?: string | null
  onCommentsHandler: (
    comment: string,
    commentId?: string,
    options?: { type?: 'MODIFY' | 'CHILD_MODIFY'; parentId?: string | null }
  ) => Promise<void>
  isAdding: boolean
}

function CommentForm({
  userId,
  commentId,
  comment,
  setModifyComment,
  parentId,
  onCommentsHandler,
  isAdding,
}: Props) {
  const formRef = useRef<HTMLFormElement | null>(null)
  const [inputValue, setInputValue] = useState<string>(
    comment && userId ? comment : ''
  )
  const [debounceValue, setDebounceValue] = useState<string>('')

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

    await onCommentsHandler(comment, commentId, {
      type: parentId ? 'CHILD_MODIFY' : 'MODIFY',
      parentId,
    })

    if (setModifyComment) setModifyComment(false)
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
                  {!comment && (
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
                    {comment
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
