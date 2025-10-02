'use client'

import '@/styles/page-profile/profile-page.css'
import Image from 'next/image'
import { useState } from 'react'

interface UserProfile {
  name: string
  email: string
  avatarUrl: string
}

interface Study {
  id: number
  title: string
  role?: string
  imageUrl?: string
  category?: string
  location?: string
  members?: number
  likes?: number
}

interface PageProps {
  params: {
    userId: string
  }
}

export default function MyProfilePage({ params }: PageProps) {
  const { userId } = params

  // 더미 데이터 (userId 기반으로 나중에 API 연동 가능)
  const [user] = useState<UserProfile>({
    name: `사용자 ${userId}`,
    email: `user${userId}@example.com`,
    avatarUrl: '/avatar-default.png',
  })

  const [studies] = useState<Study[]>([
    {
      id: 1,
      title: 'React 스터디',
      role: '참가자',
      imageUrl: '/images/no-image.png',
      category: '프론트엔드',
      location: '서울',
      members: 5,
      likes: 12,
    },
    {
      id: 2,
      title: 'TypeScript 스터디',
      role: '리더',
      imageUrl: '/images/no-image.png',
      category: '프론트엔드',
      location: '온라인',
      members: 8,
      likes: 20,
    },
  ])

  const [favorites] = useState<Study[]>([
    {
      id: 3,
      title: 'Next.js 스터디',
      imageUrl: '/images/no-image.png',
      category: '프론트엔드',
      location: '서울',
      members: 10,
      likes: 5,
    },
    {
      id: 4,
      title: 'GraphQL 스터디',
      imageUrl: '/images/no-image.png',
      category: '백엔드',
      location: '온라인',
      members: 7,
      likes: 7,
    },
  ])

  return (
    <main className="main-wrapper">
      <section className="user-profile">
        {/* 내 정보 */}
        <div className="user-info-section">
          <Image
            src={user.avatarUrl}
            alt="사용자 아바타"
            width={80}
            height={80}
            className="user-avatar"
          />
          <div className="user-details">
            <h2 className="user-name">{user.name}</h2>
            <p className="user-email">{user.email}</p>
          </div>
        </div>

        {/* 참가 스터디 */}
        <div className="user-study-section">
          <h3 className="section-title">참가 스터디 모임</h3>
          <ul className="study-list">
            {studies.map((study) => (
              <li key={study.id} className="study-card">
                <div className="image-wrapper">
                  <Image
                    src={study.imageUrl || '/images/no-image.png'}
                    alt={study.title}
                    width={320}
                    height={128}
                    className="studybanner-img"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
                <div className="description-wrapper">
                  <h3 className="study-title">
                    <span>{study.title}</span>
                    {study.role && (
                      <span className="study-role">{study.role}</span>
                    )}
                  </h3>
                  <div className="etc-description">
                    <p>카테고리: {study.category}</p>
                    <p>지역: {study.location}</p>
                    <p>인원 수: {study.members}</p>
                    <p>좋아요: {study.likes}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 관심 스터디 */}
        <div className="user-favorites-section">
          <h3 className="section-title">관심 스터디</h3>
          <ul className="favorites-list">
            {favorites.map((study) => (
              <li key={study.id} className="study-card">
                <div className="image-wrapper">
                  <Image
                    src={study.imageUrl || '/images/no-image.png'}
                    alt={study.title}
                    width={320}
                    height={128}
                    className="studybanner-img"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
                <div className="description-wrapper">
                  <h3 className="study-title">{study.title}</h3>
                  <div className="etc-description">
                    <p>카테고리: {study.category}</p>
                    <p>지역: {study.location}</p>
                    <p>인원 수: {study.members}</p>
                    <p>좋아요: {study.likes}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
