import { redirect } from 'next/navigation'

import ProfilePageClient from '@/components/ProfilePageClient'
import type { StudyRoom } from '@/libs/supabase'
import { getUserProfile } from '@/libs/supabase/api/user'
import { createClient } from '@/libs/supabase/server'

interface PageProps {
  params: Promise<{ userId: string }>
}

export default async function MyProfilePage({ params }: PageProps) {
  const { userId } = await params
  const supabase = await createClient()

  const {
    data: { user: loggedInUser },
  } = await supabase.auth.getUser()

  if (!loggedInUser) {
    redirect('/')
  }

  if (userId === 'sign-up') {
    redirect('/')
  }

  const profile = await getUserProfile(userId)
  if (!profile) {
    throw new Error('유저 프로필 정보를 불러올 수 없습니다.')
  }

  const user = {
    name: profile.nickname ?? '이름 없음',
    email: profile.email ?? '이메일 없음',
    avatarUrl: profile.profile_url ?? '/images/default-avatar.png',
  }

  const studies: StudyRoom[] = [
    {
      id: crypto.randomUUID(),
      title: 'React 스터디',
      banner_image: '/images/no-image.png',
      category: '프론트엔드',
      region: '서울',
      region_depth: '구로구',
      member_count: 5,
      likes_count: 12,
      owner_id: userId,
      created_at: new Date().toISOString(),
      description: '프론트 엔드 공부',
    },
    {
      id: crypto.randomUUID(),
      title: 'React 스터디',
      banner_image: '/images/no-image.png',
      category: '프론트엔드',
      region: '서울',
      region_depth: '강남구',
      member_count: 15,
      likes_count: 62,
      owner_id: userId,
      created_at: new Date().toISOString(),
      description: 'SQL 공부',
    },
  ]

  const favorites = [
    {
      id: crypto.randomUUID(),
      title: 'React 스터디',
      banner_image: '/images/no-image.png',
      category: '프론트엔드',
      region: '경기도',
      region_depth: '광명시',
      member_count: 50,
      likes_count: 121,
      owner_id: userId,
      created_at: new Date().toISOString(),
      description: '풀스택 공부',
    },
    {
      id: crypto.randomUUID(),
      title: 'React 스터디',
      banner_image: '/images/no-image.png',
      category: '프론트엔드',
      region: '세종특별자치시',
      region_depth: '세종특별자치시',
      member_count: 10,
      likes_count: 20,
      owner_id: userId,
      created_at: new Date().toISOString(),
      description: '백엔드 공부',
    },
  ]

  return (
    <ProfilePageClient user={user} studies={studies} favorites={favorites} />
  )
}
