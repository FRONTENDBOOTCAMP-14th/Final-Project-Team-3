import Link from 'next/link'
import React, { useRef } from 'react'

import '@/styles/navbar/navbar.css'
import useFocusTrap from '../../hooks/useFocusTrap'
import useKeyEvent from '../../hooks/useKeyEvent'
import Icons from '../icons'

interface Props {
  setNavVisible: (value: React.SetStateAction<boolean>) => void

  navVisible: boolean
}

function NavBar({ setNavVisible, navVisible }: Props) {
  const navRef = useRef<HTMLElement | null>(null)

  useFocusTrap(navRef)

  useKeyEvent(
    'Escape',
    () => {
      setNavVisible(false)
    },
    navVisible
  )

  return (
    <>
      <nav
        className={`main-navbar ${navVisible ? 'is-open' : ''}`}
        ref={navRef}
        aria-label="메인 네비게이션"
        aria-hidden={!navVisible}
      >
        <div className="navbar-user" role="button" tabIndex={0}>
          <div className="navbar-user-group">
            <div className="user-icon">
              <Icons name="user" aria-hidden />
            </div>
            <span>로그인 또는 회원가입</span>
          </div>
          <Icons name="arrow-right" aria-hidden />
        </div>

        <div className="navbar-contents">
          <ul className="navbar-lists">
            <li className="lists-item">
              <Icons name="home" width={24} height={24} aria-hidden />
              <Link href={'/'}>홈</Link>
            </li>
            <li className="lists-item">
              <Icons name="user-check" width={24} height={24} aria-hidden />
              <Link href={'/'}>내정보</Link>
            </li>
          </ul>
        </div>
      </nav>
      <div
        className={`navbar-overlay ${navVisible ? 'active' : ''}`}
        onClick={() => setNavVisible(false)}
      ></div>
    </>
  )
}

export default NavBar
