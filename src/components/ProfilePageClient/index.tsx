'use client'
import { useEffect, useState } from 'react'

import StudyCardLists from '@/components/home/study-card-lists'
import PaginationList from '@/components/ui/PaginationList'
import { useProfile } from '@/hooks/useProfile'
import type { Profile, StudyRoom } from '@/libs/supabase'

import '@/styles/page-profile/profile-img/profile-upload.css'
import '@/styles/page-profile/profile-page.css'
import '@/styles/page-profile/user-info/user-info-section.css'

import MoreButton from '../ui/more-button'

import ProfileImgUploader from './user-info-section'

interface Props {
  user: Profile
  studies: StudyRoom[]
  favorites: StudyRoom[]
}

export default function ProfilePageClient({ user, studies, favorites }: Props) {
  const { handleAvatarUpload, avatarUrl, _avatarFile } = useProfile()
  const [isDesktop, setIsDesktop] = useState<boolean>(false)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 64rem)')
    const resizeHandler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches)
    }

    setIsDesktop(media.matches)

    media.addEventListener('change', resizeHandler)

    return () => {
      media.removeEventListener('change', resizeHandler)
    }
  }, [])

  return (
    <section className="profile-page">
      <h3 className="section-subtitle">내 정보</h3>

      <div className="user-info-section">
        <div className="user-info-left">
          <ProfileImgUploader
            value={_avatarFile}
            onChange={handleAvatarUpload}
            externalPreview={avatarUrl ?? undefined}
          />
        </div>

        <div className="user-info-right">
          <p className="user-name">{user?.nickname ?? '닉네임 없음'}</p>
          <p className="user-email">{user?.email}</p>
        </div>
      </div>

      <div style={{ marginBlockEnd: 'var(--space-xl)' }} />

      <h3 className="section-subtitle">내 스터디</h3>
      {isDesktop ? (
        <PaginationList
          items={studies}
          itemsPerPage={8}
          renderItem={(pageItems) => (
            <StudyCardLists studyData={pageItems} type="MYSTUDY" />
          )}
        />
      ) : (
        <>
          <StudyCardLists studyData={studies} type="MYSTUDY" />
          <MoreButton isLoading={true} />
        </>
      )}

      <h3 className="section-subtitle">즐겨찾기</h3>
      {isDesktop ? (
        <PaginationList
          items={favorites}
          itemsPerPage={8}
          renderItem={(pageItems) => <StudyCardLists studyData={pageItems} />}
        />
      ) : (
        <>
          <StudyCardLists studyData={favorites} />
          <MoreButton isLoading={true} />
        </>
      )}
    </section>
  )
}
