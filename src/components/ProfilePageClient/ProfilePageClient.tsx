'use client'

import { useState } from 'react'

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
  const [avatar, setAvatar] = useState<string>(user.avatarUrl)
  const [isLocal, setIsLocal] = useState(false)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const fileUrl = URL.createObjectURL(e.target.files[0])
      setAvatar(fileUrl)
      setIsLocal(true)
    }
  }

  return (
    <div className="main-wrapper">
      <div className="user-info-section">
        <img
          src={avatar}
          alt={`${user.name}의 아바타`}
          className="user-avatar"
          width={100}
          height={100}
        />
        <div className="user-details">
          <h2 className="user-name">{user.name}</h2>
          <p className="user-email">{user.email}</p>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
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
                  width={300}
                  height={150}
                />
              </div>
              <div className="description-wrapper">
                <div className="study-title">{study.title}</div>
                {study.role && <div className="study-role">{study.role}</div>}
                <div className="etc-description">
                  {study.category && <p>카테고리: {study.category}</p>}
                  {study.location && <p>위치: {study.location}</p>}
                  {study.members !== undefined && (
                    <p>멤버: {study.members}명</p>
                  )}
                  {study.likes !== undefined && <p>좋아요: {study.likes}</p>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="user-favorites-section">
        <h3 className="section-title">즐겨찾기</h3>
        <ul className="favorites-list">
          {favorites.map((fav) => (
            <li key={fav.id} className="study-card">
              <div className="image-wrapper">
                <img
                  src={fav.imageUrl}
                  alt={fav.title}
                  className="studybanner-img"
                  width={300}
                  height={150}
                />
              </div>
              <div className="description-wrapper">
                <div className="study-title">{fav.title}</div>
                <div className="etc-description">
                  {fav.category && <p>카테고리: {fav.category}</p>}
                  {fav.location && <p>위치: {fav.location}</p>}
                  {fav.members !== undefined && <p>멤버: {fav.members}명</p>}
                  {fav.likes !== undefined && <p>좋아요: {fav.likes}</p>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
