'use client'

import Link from 'next/link'
import { useActionState, useRef } from 'react'
import { useFormStatus } from 'react-dom'

import '@/styles/login-modal/login-modal.css'
import useFocusTrap from '../../hooks/useFocusTrap'
import useKeyEvent from '../../hooks/useKeyEvent' // ✅ 추가
import useScrollLock from '../../hooks/useScrollLock' // ✅ 추가
import supabase from '../../libs/supabase'
import Icons from '../icons'

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

interface Props {
  openModal: boolean
  setOpenModal: (value: React.SetStateAction<boolean>) => void
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="login-btn" disabled={pending}>
      {pending ? '로그인 중...' : '로그인'}
    </button>
  )
}

function LoginModal({ openModal, setOpenModal }: Props) {
  const modalRef = useRef<HTMLDivElement | null>(null)

  useFocusTrap(modalRef)

  // 🔹 변경 1: 스크롤 막기 추가
  useScrollLock(openModal, 'body') // ✅ 여기 추가됨

  // 🔹 변경 2: ESC 키 훅으로 교체
  useKeyEvent(
    // ✅ 여기 추가됨
    'Escape',
    () => setOpenModal(false),
    openModal // 모달 열렸을 때만 활성화
  )

  const toggleModal = () => setOpenModal((prev) => !prev)

  const [state, action] = useActionState(loginAction, null)

  const signInKakao = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'kakao' })
  }

  const signInGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  return (
    <div>
      {openModal && (
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

            {state?.error && <p className="error-message">{state.error}</p>}

            <div className="login-links">
              <Link href="/">비밀번호 찾기</Link> |{' '}
              <Link href="/">회원가입</Link> | <Link href="/">아이디 찾기</Link>
            </div>

            <div className="social-login">
              <p>간편 로그인</p>
              <div className="social-buttons">
                <button onClick={signInKakao} className="social-btn kakao">
                  <Icons name="kakao-icon" width={24} height={24} />
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
