'use client'

import StudyCardLists from '@/components/home/study-card-lists'
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
    <section>
      <UserInfoSection
        user={{ name: user.name, email: user.email }}
        avatarUrl={user.avatarUrl}
        setAvatarFile={() => {}}
      />

      <h3 className="section-subtitle">내 스터디</h3>
      <StudyCardLists studyData={studies} />

      <h3 className="section-subtitle">즐겨찾기</h3>
      <StudyCardLists studyData={favorites} />
    </section>
  )
}
