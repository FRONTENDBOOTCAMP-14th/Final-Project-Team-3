'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import useKeyEvent from '@/hooks/useKeyEvent'

interface Props {
  setSearchVisible: (value: React.SetStateAction<boolean>) => void
  searchVisible?: boolean
}

function HeaderSearch({ setSearchVisible, searchVisible }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const searchQuery = searchParams.get('search') ?? ''

  const [searchValue, setSearchValue] = useState(searchQuery)

  useEffect(() => {
    setSearchValue(searchQuery)
  }, [searchQuery, searchVisible])

  useKeyEvent(
    'Escape',
    () => {
      setSearchVisible(false)
    },
    searchVisible
  )

  const handleSearch = () => {
    const value = searchValue.trim()

    const params = new URLSearchParams(searchParams.toString())

    if (value === '') {
      params.delete('search')
    } else {
      params.set('search', value)
    }

    router.push(`/?${params.toString()}`)
  }

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleReset = () => {
    setSearchValue('')

    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')

    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="header-search">
      <input
        type="search"
        placeholder="스터디 모임, 지역을 검색해 보세요"
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={onKeyPress}
        value={searchValue}
      />

      <button
        type="button"
        className="search-reset-btn"
        onClick={handleReset}
        disabled
      />
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
