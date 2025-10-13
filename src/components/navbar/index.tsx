'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Dispatch, SetStateAction } from 'react'
import React, { useRef, useState } from 'react'

import Icons from '@/components/icons'
import { useAuth } from '@/hooks/useAuth'
import useFocusTrap from '@/hooks/useFocusTrap'
import useKeyEvent from '@/hooks/useKeyEvent'
import type { Profile } from '@/libs/supabase'

import '@/styles/navbar/navbar.css'

interface Props {
  setNavVisible: (value: React.SetStateAction<boolean>) => void
  setOpenModal: (value: React.SetStateAction<boolean>) => void
  setUserProfile: Dispatch<SetStateAction<Profile | null>>
  navVisible: boolean
}

function NavBar({
  setNavVisible,
  setOpenModal,
  navVisible,
  setUserProfile,
}: Props) {
  const navRef = useRef<HTMLElement | null>(null)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

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
    if (isLoading) return

    setIsLoading(true)
    fetch('/auth/logout', {
      method: 'POST',
    })
      .then(async (res) => {
        if (res.ok) {
          setUser(null)
          setUserProfile(null)
          router.refresh()

          alert('로그아웃에 성공 하였습니다.')
        }
      })
      .catch((e: Error) => alert(`로그아웃에 실패 하였습니다. ${e.message}`))
      .finally(() => {
        setIsLoading(false)
      })
  }
  return (
    <>
      <nav
        className={`main-navbar ${navVisible ? 'is-open' : ''}`}
        ref={navRef}
        aria-label="메인 네비게이션"
        inert={!navVisible ? true : undefined}
      >
        <div className="navbar-user">
          <div className="navbar-user-group">
            <div className="user-icon">
              <Icons name="user" aria-hidden />
            </div>
            {!user ? (
              <button
                className="modal-open-btn"
                onKeyDown={keyDownEventHandler}
                onClick={() => {
                  setOpenModal(true)
                  setNavVisible(false)
                }}
                aria-disabled={!navVisible}
              >
                로그인 또는 회원가입
              </button>
            ) : (
              <button
                className="modal-open-btn"
                onClick={signOut}
                aria-disabled={!navVisible || isLoading}
                disabled={isLoading}
              >
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
              <>
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

                <li className="lists-item">
                  <Icons name="book" width={24} height={24} aria-hidden />
                  <Link
                    href={'/study-create'}
                    tabIndex={navVisible ? 0 : -1}
                    onClick={() => setNavVisible(false)}
                  >
                    스터디 생성
                  </Link>
                </li>
              </>
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
