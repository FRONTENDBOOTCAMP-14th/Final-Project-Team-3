'use client'

import Link from 'next/link'
import { useActionState, useFormStatus, useRef, useState } from 'react'

import useFocusTrap from '../../hooks/useFocusTrap'
import supabase from '../libs/supabase'

async function loginAction(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }
  return { error: undefined }
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="login-btn" disabled={pending}>
      {pending ? '로그인 중...' : '로그인'}
    </button>
  )
}

function LoginModal() {
  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)

  useFocusTrap(modalRef)

  const toggleModal = () => setIsOpen((prev) => !prev)

  const [state, action, pending] = useActionState(loginAction, null)

  const signInKakao = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'kakao' })
  }

  const signInGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  return (
    <div>
      <button className="open-modal-btn" onClick={toggleModal}>
        로그인 열기
      </button>

      {isOpen && (
        <div className="login-modal-overlay" onClick={toggleModal}>
          <div
            className="login-modal"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={toggleModal}>
              ✕
            </button>

            <h2 className="login-title">로그인</h2>

            <form className="login-form" action={action}>
              <input
                type="email"
                name="email"
                placeholder="이메일"
                className="login-input"
              />
              <input
                type="password"
                name="password"
                placeholder="비밀번호"
                className="login-input"
              />

              <SubmitButton />
            </form>

            {/* 에러 메시지 표시 */}
            {state?.error && <p className="error-message">{state.error}</p>}

            <div className="login-links">
              <Link href="/">비밀번호 찾기</Link> |{' '}
              <Link href="/">회원가입</Link> | <Link href="/">아이디 찾기</Link>
            </div>

            <div className="social-login">
              <p>간편 로그인</p>
              <div className="social-buttons">
                <button onClick={signInKakao} className="social-btn kakao">
                  카카오
                </button>
                <button onClick={signInGoogle} className="social-btn google">
                  구글
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoginModal
