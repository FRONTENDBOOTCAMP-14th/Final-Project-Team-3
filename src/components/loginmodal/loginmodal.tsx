'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'

import useFocusTrap from '@/hooks/useFocusTrap'
import useKeyEvent from '@/hooks/useKeyEvent'
import useScrollLock from '@/hooks/useScrollLock'
import { socialLogin } from '@/libs/supabase/api/auth'
import supabase from '@/libs/supabase/client'
import '@/styles/login-modal/login-modal.css'

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

  if (error && error.code === 'invalid_credentials') {
    toast.error('이메일 및 비밀번호를 확인해 주세요.', {
      action: {
        label: '닫기',
        onClick: () => {},
      },
    })
    return { error: '이메일 및 비밀번호를 확인해 주세요.' }
  } else if (error) {
    toast.error('로그인 실패. 잠시후 다시 시도해 주세요.', {
      action: {
        label: '닫기',
        onClick: () => {},
      },
    })
    return { error: '로그인 실패. 잠시후 다시 시도해 주세요.' }
  } else {
    toast.success('이메일 로그인 성공!', {
      action: {
        label: '닫기',
        onClick: () => {},
      },
    })
    return { error: undefined }
  }
}

interface Props {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="login-btn" disabled={pending}>
      {pending ? '로그인 중...' : '로그인'}
    </button>
  )
}

export default function LoginModal({ openModal, setOpenModal }: Props) {
  const modalRef = useRef<HTMLDivElement | null>(null)
  const [socialError, setSocialError] = useState<string | null>(null)
  const [state, action] = useActionState(loginAction, null)
  const pathname = usePathname()

  useFocusTrap(modalRef, openModal)
  useScrollLock(openModal, 'body')
  useKeyEvent('Escape', () => setOpenModal(false), openModal)

  const toggleModal = () => setOpenModal((prev) => !prev)

  const socialLoginHandler = async (provider: 'kakao' | 'google') => {
    setSocialError(null)

    const res = await socialLogin(provider, pathname)

    if (res.ok) {
      setOpenModal((prev) => !prev)
      toast.success(res.message, {
        action: {
          label: '닫기',
          onClick: () => {},
        },
      })
    } else {
      toast.error(res.message, {
        action: {
          label: '닫기',
          onClick: () => {},
        },
      })
      setSocialError(res.message as string)
    }
  }

  useEffect(() => {
    if (state && state.error === undefined) {
      setOpenModal(false)
    }
  }, [state, setOpenModal])

  return (
    <div>
      {openModal && (
        <div className="login-modal-overlay" onClick={toggleModal}>
          <div
            className="login-modal"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
          >
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

            {(state?.error ?? socialError) && (
              <p className="error-message">{state?.error ?? socialError}</p>
            )}

            <div className="login-links">
              <Link href="/">비밀번호 찾기</Link> |
              <Link href="/sign-up" onClick={() => setOpenModal(false)}>
                회원가입
              </Link>{' '}
              |<Link href="/">아이디 찾기</Link>
            </div>

            <div className="social-login">
              <p>간편 로그인</p>
              <div className="social-buttons">
                <button
                  onClick={() => socialLoginHandler('kakao')}
                  className="social-btn kakao"
                >
                  <Icons name="kakao-icon" width={24} height={24} />
                  카카오
                </button>
                <button
                  onClick={() => socialLoginHandler('google')}
                  className="social-btn google"
                >
                  <Icons name="google" width={24} height={24} />
                  구글
                </button>
              </div>
            </div>

            <button className="modal-close-btn" onClick={toggleModal}>
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
