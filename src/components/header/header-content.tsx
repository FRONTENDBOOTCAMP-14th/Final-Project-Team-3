'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { Dispatch, SetStateAction } from 'react'
import React from 'react'

import Icons from '@/components/icons'
import { useProfile } from '@/hooks/useProfile'
import type { Profile } from '@/libs/supabase'

interface Props {
  setSearchVisible: (value: React.SetStateAction<boolean>) => void
  setNavVisible: (value: React.SetStateAction<boolean>) => void
  setCategoryVisible: (value: React.SetStateAction<boolean>) => void
  setUserProfile: Dispatch<SetStateAction<Profile | null>>
  selectCategory: string
  hidden: boolean
  profile: Profile | null | undefined
}

function HeaderContent({
  setSearchVisible,
  setNavVisible,
  setCategoryVisible,
  selectCategory,
  hidden,
  profile,
}: Props) {
  const router = useRouter()
  const { avatarUrl } = useProfile()

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
      {profile && (
        <button
          className="header-btn-icon header-search-btn-icon header-user-icon"
          aria-label="프로필 페이지로 이동"
          onClick={() => {
            router.push(`/my-profile/${profile.id}`)
          }}
        >
          {profile.profile_url ? (
            <Image
              src={avatarUrl ?? '/images/default-avatar.png'}
              alt={profile.nickname ?? '프로필 이미지'}
              width={24}
              height={24}
              aria-hidden
              style={{ borderRadius: '50%' }}
            />
          ) : (
            <Icons name="user" width={24} height={24} aria-hidden />
          )}
        </button>
      )}
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
