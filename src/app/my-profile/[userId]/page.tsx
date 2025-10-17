import { redirect } from 'next/navigation'

import ProfilePageClient from '@/components/ProfilePageClient'
import type { StudyRoom } from '@/libs/supabase'
import { getAllStudyRoom } from '@/libs/supabase/api/study-room'
import { getUserProfile } from '@/libs/supabase/api/user'
import { createClient } from '@/libs/supabase/server'

import { getUserBookmarks } from '@/libs/supabase/api/bookmark'

interface PageProps {
  params: { userId: string }
}

export default async function MyProfilePage({ params }: PageProps) {
  const { userId } = params
  const supabase = await createClient()

  const {
    data: { user: loggedInUser },
  } = await supabase.auth.getUser()

  if (!loggedInUser) redirect('/')
  if (userId === 'sign-up') redirect('/')

  const profile = await getUserProfile(userId)
  if (!profile) throw new Error('유저 프로필 정보를 불러올 수 없습니다.')

  const user = {
    name: profile.nickname ?? '이름 없음',
    email: profile.email ?? '이메일 없음',
    avatarUrl: profile.profile_url ?? '/images/default-avatar.png',
  }

  const allStudies: StudyRoom[] = await getAllStudyRoom()
  const studies = allStudies.filter((study) => study.owner_id === userId)

  const favorites = await getUserBookmarks(userId)

  return (
    <ProfilePageClient user={user} studies={studies} favorites={favorites} />
  )
}
