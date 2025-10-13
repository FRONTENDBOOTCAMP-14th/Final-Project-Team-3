'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useRef } from 'react'

import Icons from '@/components/icons'
import { useAuth } from '@/hooks/useAuth'
import useFocusTrap from '@/hooks/useFocusTrap'
import useKeyEvent from '@/hooks/useKeyEvent'

import '@/styles/navbar/navbar.css'

interface Props {
  setNavVisible: (value: React.SetStateAction<boolean>) => void
  setOpenModal: (value: React.SetStateAction<boolean>) => void

  navVisible: boolean
}

function NavBar({ setNavVisible, setOpenModal, navVisible }: Props) {
  const navRef = useRef<HTMLElement | null>(null)
  const router = useRouter()

  const { user, setUser } = useAuth()

  useFocusTrap(navRef, navVisible)

  useKeyEvent(
    'Escape',
    () => {
      setNavVisible(false)
    },
    navVisible
  )

  const keyDownEventHandler = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpenModal(true)
      setNavVisible(false)
    }
  }

  const signOut = () => {
    fetch('/auth/logout', {
      method: 'POST',
    })
      .then(async (res) => {
        if (res.ok) {
          setUser(null)
          router.refresh()

          alert('로그아웃에 성공 하였습니다.')
        }
      })
      .catch((e: Error) => alert(`로그아웃에 실패 하였습니다. ${e.message}`))
  }

  return (
    <>
      <nav
        className={`main-navbar ${navVisible ? 'is-open' : ''}`}
        ref={navRef}
        aria-label="메인 네비게이션"
        inert={!navVisible ? true : undefined}
      >
        <div
          className="navbar-user"
          role="button"
          tabIndex={navVisible ? 0 : -1}
          aria-disabled={!navVisible}
          onClick={() => {
            setOpenModal(true)
            setNavVisible(false)
          }}
          onKeyDown={keyDownEventHandler}
        >
          <div className="navbar-user-group">
            <div className="user-icon">
              <Icons name="user" aria-hidden />
            </div>
            {!user ? (
              <span className="modal-open-btn">로그인 또는 회원가입</span>
            ) : (
              <button className="modal-open-btn" onClick={signOut}>
                로그 아웃
              </button>
            )}
          </div>
          <Icons name="arrow-right" aria-hidden />
        </div>

        <div className="navbar-contents">
          <ul className="navbar-lists">
            <li className="lists-item">
              <Icons name="home" width={24} height={24} aria-hidden />
              <Link
                href={'/'}
                tabIndex={navVisible ? 0 : -1}
                onClick={() => setNavVisible(false)}
              >
                홈
              </Link>
            </li>
            {user && (
              <li className="lists-item">
                <Icons name="user-check" width={24} height={24} aria-hidden />
                <Link
                  href={`/my-profile/${user?.id}`}
                  tabIndex={navVisible ? 0 : -1}
                  onClick={() => setNavVisible(false)}
                >
                  내정보
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
      <div
        className={`navbar-overlay ${navVisible ? 'active' : ''}`}
        onClick={() => setNavVisible(false)}
        aria-hidden="true"
      ></div>
    </>
  )
}

export default NavBar
