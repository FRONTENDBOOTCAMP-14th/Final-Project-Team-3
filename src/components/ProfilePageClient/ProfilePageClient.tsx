'use client'

import '@/styles/page-profile/profile-page.css'
import { useEffect, useState } from 'react'

import PaginationList from '@/components/ui/PaginationList'

import BannerUploader from '../study-create/fields/BannerUploader'

interface Study {
  id: number
  title: string
  role?: string
  imageUrl: string
  category: string
  location: string
  members: number
  likes: number
}

interface ProfilePageClientProps {
  user: {
    name: string
    email: string
    avatarUrl: string
  }
  studies: Study[]
  favorites: Study[]
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
      <div className="user-info-section">
        <div className="avatar-uploader">
          <BannerUploader value={avatarFile} onChange={setAvatarFile} />
          <img src={avatarUrl} alt="User avatar" className="avatar-preview" />
        </div>

        <div className="user-details">
          <h2 className="user-name">{user.name}</h2>
          <p className="user-email">{user.email}</p>
        </div>
      </div>

      <section className="user-study-section">
        <h3 className="section-title">내 스터디</h3>
        <ul className="study-list">
          {studies.map((study) => (
            <li key={study.id} className="study-card">
              <div className="image-wrapper">
                <img
                  src={study.imageUrl}
                  alt={study.title}
                  className="studybanner-img"
                />
              </div>
              <div className="description-wrapper">
                <div className="study-title">{study.title}</div>
                {study.role && <div className="study-role">{study.role}</div>}
                <div className="etc-description">
                  <p>카테고리: {study.category}</p>
                  <p>위치: {study.location}</p>
                  <p>멤버: {study.members}명</p>
                  <p>좋아요: {study.likes}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="user-favorites-section">
        <h3 className="section-title">즐겨찾기</h3>
        <PaginationList
          items={favorites}
          itemsPerPage={10}
          renderItem={(fav) => (
            <div className="study-card favorite-item">
              <div className="image-wrapper">
                <img
                  src={fav.imageUrl}
                  alt={fav.title}
                  className="studybanner-img"
                />
              </div>
              <div className="description-wrapper">
                <div className="study-title">{fav.title}</div>
                <div className="etc-description">
                  <p>카테고리: {fav.category}</p>
                  <p>위치: {fav.location}</p>
                  <p>멤버: {fav.members}명</p>
                  <p>좋아요: {fav.likes}</p>
                </div>
              </div>
            </div>
          )}
        />
      </section>
    </div>
  )
}
