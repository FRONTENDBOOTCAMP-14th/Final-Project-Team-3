'use client'

import StudyCardLists from '@/components/home/study-card-lists'
import PaginationList from '@/components/ui/PaginationList'
import type { StudyRoom } from '@/libs/supabase'

import UserInfoSection from './user-info-section'

interface Props {
  user: {
    name: string
    email: string
    avatarUrl: string
  }
  studies: StudyRoom[]
  favorites: StudyRoom[]
}

export default function ProfilePageClient({ user, studies, favorites }: Props) {
  return (
    <section className="profile-page">
      <UserInfoSection user={user} setAvatarFile={() => {}} />

      <h3 className="section-subtitle">내 스터디</h3>
      <PaginationList
        items={studies}
        itemsPerPage={10}
        renderItem={(study) => <StudyCardLists studyData={[study]} />}
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
