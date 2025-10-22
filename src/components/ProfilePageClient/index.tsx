'use client'

import { useState } from 'react'

import StudyCardLists from '@/components/home/study-card-lists'
import BannerUploader from '@/components/study-create/fields/BannerUploader'
import PaginationList from '@/components/ui/PaginationList'
import type { Profile, StudyRoom } from '@/libs/supabase'

import '@/styles/page-profile/profile-page.css'
import ProfileImgUploader from './user-info-section'

interface Props {
  user: Profile
  studies: StudyRoom[] | undefined
  favorites: StudyRoom[]
}

export default function ProfilePageClient({
  user,
  studies: initialStudies,
  favorites,
}: Props) {
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  return (
    <section className="user-profile">
      <div className="profile-banner-wrapper">
        <BannerUploader value={bannerFile} onChange={setBannerFile} />
      </div>

      <ProfileImgUploader user={user} setAvatarFile={() => {}} />

      <h3 className="section-subtitle">내 스터디</h3>
      <PaginationList
        items={initialStudies}
        itemsPerPage={10}
        renderItem={(study) => (
          <StudyCardLists studyData={[study]} type="MYSTUDY" />
        )}
      />

      <h3 className="section-subtitle">즐겨찾기</h3>
      <PaginationList
        items={favorites}
        itemsPerPage={10}
        renderItem={(fav) => <StudyCardLists studyData={[fav]} />}
      />
    </section>
  )
}
