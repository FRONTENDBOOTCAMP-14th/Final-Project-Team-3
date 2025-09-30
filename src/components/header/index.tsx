'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import '@/styles/header/header.css'
import useScrollLock from '../../hooks/useScrollLock'
import NavBar from '../navbar'

import HeaderContent from './header-content'
import HeaderSearch from './header-search'
import RegionCategories from './region-categories'

function Header() {
  const [searchVisible, setSearchVisible] = useState<boolean>(false)
  const [navVisible, setNavVisible] = useState<boolean>(false)
  const [categoryVisible, setCategoryVisible] = useState<boolean>(false)
  const [selectCategory, setSelectCategory] = useState<string>('강남구')
  const [isDesktop, setIsDesktop] = useState<boolean>(false)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 64rem)')
    const resizeHandler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches)
      setSearchVisible(false)
    }

    setIsDesktop(media.matches)

    media.addEventListener('change', resizeHandler)

    return () => {
      media.removeEventListener('change', resizeHandler)
    }
  }, [])

  useScrollLock(navVisible || categoryVisible, [
    '.main-header',
    '.region-container',
  ])

  return (
    <>
      <header className="main-header">
        <div className="header-logo" hidden={searchVisible ? true : undefined}>
          <h2>
            <Link href={'/'}>모이다</Link>
          </h2>
        </div>
        {isDesktop ? (
          <HeaderSearch
            setSearchVisible={setSearchVisible}
            searchVisible={searchVisible}
          />
        ) : (
          searchVisible && (
            <HeaderSearch
              setSearchVisible={setSearchVisible}
              searchVisible={searchVisible}
            />
          )
        )}
        <HeaderContent
          setSearchVisible={setSearchVisible}
          setNavVisible={setNavVisible}
          setCategoryVisible={setCategoryVisible}
          selectCategory={selectCategory}
          hidden={searchVisible ? true : false}
        />
      </header>

      <NavBar setNavVisible={setNavVisible} navVisible={navVisible} />

      <RegionCategories
        setCategoryVisible={setCategoryVisible}
        setSelectCategory={setSelectCategory}
        categoryVisible={categoryVisible}
      />
    </>
  )
}

export default Header
