'use client'

import '@/styles/page-profile/profile-page.css'
import { useEffect, useState } from 'react'

import type { StudyRoom } from '@/libs/supabase'

import UserFavoritesSection from './user-favorites-section'
import UserInfoSection from './user-info-section'
import UserStudiesSection from './user-studies-section'

interface ProfilePageClientProps {
  user: {
    name: string
    email: string
    avatarUrl: string
  }
  studies: StudyRoom[]
  favorites: StudyRoom[]
}

export default function ProfilePageClient({
  user,
  studies,
  favorites,
}: ProfilePageClientProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl)

  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile)
      setAvatarUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setAvatarUrl(user.avatarUrl)
    }
  }, [avatarFile, user.avatarUrl])

  return (
    <div className="main-wrapper">
      <UserInfoSection
        user={user}
        avatarUrl={avatarUrl}
        setAvatarFile={setAvatarFile}
      />
      <UserStudiesSection studies={studies} />
      <UserFavoritesSection favorites={favorites} />
    </div>
  )
}
