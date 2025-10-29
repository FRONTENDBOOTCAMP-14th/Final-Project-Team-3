import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import ProfilePageClient from '@/components/profile-page-client'
import type { Profile } from '@/libs/supabase'
import { getUserBookmarks } from '@/libs/supabase/api/bookmark'
import { getMyStudyRoom } from '@/libs/supabase/api/study-room'
import {
  getMyParticipantsStudyRoom,
  getUserProfile,
} from '@/libs/supabase/api/user'
import { createClient } from '@/libs/supabase/server'

interface Props {
  params: Promise<{ userId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params
  const response = await getUserProfile(userId)
  if (!response?.ok) {
    throw new Error(response?.message)
  }

  return {
    title: `${response.data?.nickname} 프로필`,
    description: `${response.data?.nickname} | ${response.data?.bio ?? '자기소개가 없습니다...'}`,
  }
}

export default async function MyProfilePage({ params }: Props) {
  const { userId } = await params
  const supabase = await createClient()

  const {
    data: { user: loggedInUser },
  } = await supabase.auth.getUser()

  if (!loggedInUser) redirect('/')
  if (userId === 'sign-up') redirect('/')

  const [profile, allStudies] = await Promise.all([
    getUserProfile(userId),
    getMyStudyRoom(userId),
  ])

  if (!profile) throw new Error('유저 프로필 정보를 불러올 수 없습니다.')

  const favorites = await getUserBookmarks(userId)

  const participantsData = await getMyParticipantsStudyRoom(userId)

  return (
    <ProfilePageClient
      user={profile?.data as Profile}
      studies={allStudies.data ?? []}
      favorites={favorites?.data ?? []}
      participants={participantsData.data ?? []}
    />
  )
}
