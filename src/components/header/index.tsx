'use client'

import Link from 'next/link'
import { useState } from 'react'

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
        <HeaderContent
          setSearchVisible={setSearchVisible}
          setNavVisible={setNavVisible}
          setCategoryVisible={setCategoryVisible}
          hidden={searchVisible ? true : false}
        />
        {searchVisible && <HeaderSearch setSearchVisible={setSearchVisible} />}
      </header>
      {navVisible && (
        <NavBar setNavVisible={setNavVisible} navVisible={navVisible} />
      )}
      {categoryVisible && (
        <RegionCategories
          setCategoryVisible={setCategoryVisible}
          categoryVisible={categoryVisible}
        />
      )}
    </>
  )
}

export default Header
