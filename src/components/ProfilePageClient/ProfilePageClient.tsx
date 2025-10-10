// src/components/ProfilePageClient/ProfilePageClient.tsx
'use client'

import '@/styles/page-profile/profile-page.css'
import Image from 'next/image'

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

interface ProfilePageClientProps {
  user: UserProfile
  studies: Study[]
  favorites: Study[]
}

export default function ProfilePageClient({
  user,
  studies,
  favorites,
}: ProfilePageClientProps) {
  return (
    <div className="profile-page">
      <div className="profile-header">
        <Image
          src={user.avatarUrl}
          alt={`${user.name}의 아바타`}
          width={100}
          height={100}
        />
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      </div>

      <section>
        <h3>내 스터디</h3>
        <ul>
          {studies.map((study) => (
            <li key={study.id}>{study.title}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>즐겨찾기</h3>
        <ul>
          {favorites.map((fav) => (
            <li key={fav.id}>{fav.title}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
