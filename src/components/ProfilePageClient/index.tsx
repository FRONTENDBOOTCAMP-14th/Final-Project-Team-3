'use client'

import { useState } from 'react'

import StudyCardLists from '@/components/home/study-card-lists'
import PaginationList from '@/components/ui/PaginationList'
import type { Profile, StudyRoom } from '@/libs/supabase'
import createClient from '@/libs/supabase/client'
import '@/styles/page-profile/profile-page.css'
import '@/styles/page-profile/user-info/user-info-section.css'

import ProfileImgUploader from './user-info-section'

interface Props {
  user: Profile
  studies: StudyRoom[] | undefined
  favorites: StudyRoom[]
}

export default function ProfilePageClient({ user, studies, favorites }: Props) {
  const supabase = createClient
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user.profile_url ?? ''
  )
  const [_avatarFile, _setAvatarFile] = useState<File | null>(null)

  const handleAvatarUpload = async (file: File | null) => {
    if (!file) return
    if (!user) return

    const filePath = `profile/${user.id}/${file.name}`

    console.log('file', file)
    console.log('filePath', filePath)

    const { error: uploadError } = await supabase.storage
      .from('profile')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      alert('이미지 업로드 실패!')
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('profile').getPublicUrl(filePath)

    console.log('publicUrl', publicUrl)
    const { error: updateError } = await supabase
      .from('profile')
      .update({ profile_url: publicUrl })
      .eq('id', user.id)

    if (updateError) {
      alert('프로필 정보 업데이트 실패!')
      return
    }

    setAvatarUrl(publicUrl)
  }

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

      <div style={{ marginBlockEnd: 'var(--space-xl)' }}></div>

      <h3 className="section-subtitle">내 스터디</h3>
      <PaginationList
        items={studies}
        itemsPerPage={10}
        renderItem={(pageItems) => (
          <StudyCardLists studyData={pageItems} type="MYSTUDY" />
        )}
      />

      <h3 className="section-subtitle">즐겨찾기</h3>
      <PaginationList
        items={favorites}
        itemsPerPage={10}
        renderItem={(pageItems) => <StudyCardLists studyData={pageItems} />}
      />
    </section>
  )
}
