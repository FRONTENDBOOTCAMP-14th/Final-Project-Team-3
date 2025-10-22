import { redirect } from 'next/navigation'

import ProfilePageClient from '@/components/ProfilePageClient'
import type { StudyRoom } from '@/libs/supabase'
import { getUserBookmarks } from '@/libs/supabase/api/bookmark'
import { getQueryStudyRoom } from '@/libs/supabase/api/study-room'
import { getUserProfile } from '@/libs/supabase/api/user'
import { createClient } from '@/libs/supabase/server'
import type { ResultType } from '@/types/apiResultsType'

interface PageProps {
  params: Promise<{ userId: string }>
}

export default async function MyProfilePage({ params }: PageProps) {
  const { userId } = await params
  const supabase = await createClient()

  const {
    data: { user: loggedInUser },
  } = await supabase.auth.getUser()

  if (!loggedInUser) redirect('/')
  if (userId === 'sign-up') redirect('/')

  const profile = await getUserProfile(userId)
  if (!profile) throw new Error('유저 프로필 정보를 불러올 수 없습니다.')

  const allStudies: ResultType<StudyRoom[]> = await getQueryStudyRoom()
  const studies = allStudies.data?.filter((study) => study.owner_id === userId)

  const favorites = (await getUserBookmarks(userId)) ?? []

  return (
    <ProfilePageClient user={profile} studies={studies} favorites={favorites} />
  )
}
