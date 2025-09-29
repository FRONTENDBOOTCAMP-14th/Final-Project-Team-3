import React from 'react'

interface Props {
  setSearchVisible: (value: React.SetStateAction<boolean>) => void
}

function HeaderSearch({ setSearchVisible }: Props) {
  return (
    <div className="header-search">
      <input type="text" placeholder="스터디 모임, 지역을 검색해 보세요" />
      <button type="button" className="search-reset-btn" disabled />
      <button
        type="button"
        className="search-close-btn"
        onClick={() => setSearchVisible(false)}
      >
        닫기
      </button>
    </div>
  )
}

export default HeaderSearch
