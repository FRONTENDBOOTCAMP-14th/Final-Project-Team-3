import React from 'react'

import useKeyEvent from '../../hooks/useKeyEvent'

interface Props {
  setSearchVisible: (value: React.SetStateAction<boolean>) => void
  searchVisible?: boolean
}

function HeaderSearch({ setSearchVisible, searchVisible }: Props) {
  useKeyEvent(
    'Escape',
    () => {
      setSearchVisible(false)
    },
    searchVisible
  )

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
