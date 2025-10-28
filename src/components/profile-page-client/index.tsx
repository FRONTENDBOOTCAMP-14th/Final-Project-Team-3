'use client'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'

import StudyCardLists from '@/components/home/study-card-lists'
import Icon from '@/components/icons'
import PaginationList from '@/components/ui/pagination-list'
import { useProfile } from '@/hooks/useProfile'
import type { Profile, StudyRoom } from '@/libs/supabase'
import { updateUserProfile } from '@/libs/supabase/api/user'

import '@/styles/page-profile/profile-img/profile-upload.css'
import '@/styles/page-profile/profile-page.css'
import '@/styles/page-profile/user-info/user-info-section.css'

import ProfileImgUploader from './user-info-section'

interface Props {
  user: Profile
  studies: StudyRoom[]
  favorites: StudyRoom[]
}

export default function ProfilePageClient({ user, studies, favorites }: Props) {
  const { handleAvatarUpload, avatarUrl, _avatarFile } = useProfile()
  const [isDesktop, setIsDesktop] = useState<boolean>(false)
  const [editing, setEditing] = useState(false)
  const [bio, setIntro] = useState(user?.bio ?? '')
  const [isPending, startTransition] = useTransition()

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

  const updateBioHandler = () => {
    startTransition(async () => {
      const response = await updateUserProfile(user.id, bio)

      if (response?.ok) {
        toast.success(response.message, {
          action: {
            label: '닫기',
            onClick: () => {},
          },
        })

        setEditing(false)
      } else {
        toast.error(response?.message, {
          action: {
            label: '닫기',
            onClick: () => {},
          },
        })
      }
    })
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
          <div className="user-info-right-wrapper">
            <p className="user-name">{user?.nickname ?? '닉네임 없음'}</p>
            <button
              type="button"
              className={`intro-edit-btn ${editing ? 'active' : ''}`}
              aria-label="자기소개 수정"
              onClick={() => setEditing((prev) => !prev)}
            >
              <Icon name="edit" width={28} height={28} />
            </button>
          </div>
          <p className="user-email">{user?.email}</p>

          <div className="user-intro">
            {editing ? (
              // 수정 모드일 때
              <form
                className="user-intro-form-wrapper"
                action={updateBioHandler}
              >
                <textarea
                  value={bio}
                  onChange={(e) => setIntro(e.target.value)}
                  className="intro-input"
                  placeholder="한 줄 자기소개를 입력하세요"
                  rows={5}
                  autoFocus
                  autoComplete="off"
                  name="bio"
                />
                <button
                  type="submit"
                  className="user-intro-modify-btn"
                  disabled={isPending}
                >
                  {isPending ? '수정 중...' : '수정'}
                </button>
              </form>
            ) : (
              // 일반 모드일 때
              <>
                <p className="intro-text">
                  {bio || '한 줄 자기소개를 작성해보세요'}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginBlockEnd: 'var(--space-xl)' }} />

      <h3 className="section-subtitle">내 스터디</h3>
      <PaginationList
        items={studies}
        itemsPerPage={8}
        renderItem={(pageItems) => (
          <StudyCardLists studyData={pageItems} type="MYSTUDY" />
        )}
        isDeskTop={isDesktop}
      />

      <h3 className="section-subtitle">즐겨찾기</h3>
      <PaginationList
        items={favorites}
        itemsPerPage={8}
        renderItem={(pageItems) => <StudyCardLists studyData={pageItems} />}
        isDeskTop={isDesktop}
      />
    </section>
  )
}
