'use client'

import { useRef, useState } from 'react'

import supabase from '@/libs/supabase'

import useFocusTrap from '../../hooks/useFocusTrap'

function LoginModal() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const modalRef = useRef<HTMLDivElement | null>(null)
  useFocusTrap(modalRef)

  // useEffect(() => {
  //   if (isOpen && modalRef.current) {
  //   }
  // }, [isOpen])

  const toggleModal = () => setIsOpen((prev) => !prev)

  const signInKakao = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'kakao' })
  }

  const signInGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  const signInGithub = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'github' })
  }

  const signInApple = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'apple' })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) alert(error.message)
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
            ref={modalRef} // focus trap 연결
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={toggleModal}>
              ✕
            </button>

            <h2 className="login-title">로그인</h2>

            <form className="login-form" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
              />
              <button type="submit" className="login-btn">
                로그인
              </button>
            </form>

            {/* <div className="login-links">
              <a href="/">비밀번호 찾기</a> | <a href="">회원가입</a> |{' '}
              <a href="">아이디 찾기</a>
            </div> */}

            <div className="social-login">
              <p>간편 로그인</p>
              <div className="social-buttons">
                <button onClick={signInKakao} className="social-btn kakao">
                  카카오
                </button>
                <button onClick={signInGoogle} className="social-btn google">
                  구글
                </button>
                <button onClick={signInGithub} className="social-btn github">
                  깃허브
                </button>
                <button onClick={signInApple} className="social-btn apple">
                  애플
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
