import { redirect } from 'next/navigation'


import ProfilePageClient from '@/components/ProfilePageClient'
import { getUserProfile } from '@/libs/supabase/api/user'

import { createClient } from '@/libs/supabase/server'

interface PageProps {
  params: { userId: string }
}

export default async function MyProfilePage({ params }: PageProps) {
  const { userId } = params
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

  const studies = [
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
  ]

  const favorites = [
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
  ]

  return (
    <ProfilePageClient user={user} studies={studies} favorites={favorites} />
  )
}
