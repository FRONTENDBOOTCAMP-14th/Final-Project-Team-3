'use client'

import { useState } from 'react'

import StudyCardLists from '@/components/home/study-card-lists'
import BannerUploader from '@/components/study-create/fields/BannerUploader'
import PaginationList from '@/components/ui/PaginationList'
import type { StudyRoom } from '@/libs/supabase'
import supabase from '@/libs/supabase/client'

import UserInfoSection from './user-info-section'

import '@/styles/page-profile/profile-page.css'

interface Props {
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
  studies: initialStudies,
  favorites,
}: Props) {
  const [studies, setStudies] = useState(initialStudies)
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  const handleDeleteStudy = async (id: string) => {
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?')
    if (!confirmDelete) return

    const { error } = await supabase.from('study_room').delete().eq('id', id)

    if (error) {
      alert('삭제 중 오류가 발생했습니다.')
      return
    }

    setStudies((prev) => prev.filter((study) => study.id !== id))
    alert('스터디가 삭제되었습니다.')
  }

  return (
    <section className="user-profile">
      <div className="profile-banner-wrapper">
        <BannerUploader value={bannerFile} onChange={setBannerFile} />
      </div>

      <UserInfoSection user={user} setAvatarFile={() => {}} />

      <h3 className="section-subtitle">내 스터디</h3>
      <PaginationList
        items={studies}
        itemsPerPage={10}
        renderItem={(study) => (
          <StudyCardLists studyData={[study]} onDelete={handleDeleteStudy} />
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
