import React from 'react'

import Icons from '../icons'

interface Props {
  setSearchVisible: (value: React.SetStateAction<boolean>) => void
  setNavVisible: (value: React.SetStateAction<boolean>) => void
  setCategoryVisible: (value: React.SetStateAction<boolean>) => void
  selectCategory: string
  hidden: boolean
}

function HeaderContent({
  setSearchVisible,
  setNavVisible,
  setCategoryVisible,
  selectCategory,
  hidden,
}: Props) {
  return (
    <div className="header-content-group" hidden={hidden}>
      <button
        className="header-btn-category"
        aria-label="카테고리 버튼"
        onClick={() => setCategoryVisible((prev) => !prev)}
      >
        <span>{selectCategory}</span>
        <Icons name="arrow-down" aria-hidden />
      </button>
      <button
        className="header-btn-icon header-search-btn-icon"
        aria-label="검색 버튼"
        onClick={() => {
          setSearchVisible(true)
        }}
      >
        <Icons name="search" width={24} height={24} aria-hidden />
      </button>
      <button
        className="header-btn-icon"
        aria-label="목록 버튼"
        onClick={() => {
          setNavVisible(true)
        }}
      >
        <Icons name="list" width={24} height={24} aria-hidden />
      </button>
    </div>
  )
}

export default HeaderContent
