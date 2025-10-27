import type { Metadata } from 'next'

import StudyDetail from '@/components/study-detail'
import { CommentsProvider } from '@/context/commentsContext'
import { MemberProvider } from '@/context/memberContext'
import { ModalContextProvider } from '@/context/modalContext'
import type { Profile, StudyRoom, StudyRoomRequests } from '@/libs/supabase'
import { getComments } from '@/libs/supabase/api/comments'
import {
  getOwnerProfile,
  getStudyRoomDetail,
  getStudyRoomRequests,
} from '@/libs/supabase/api/study-room'
import { createClient } from '@/libs/supabase/server'

export const revalidate = 0
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ studyId: string }>
}

export const metadata: Metadata = {
  title: '% |모이다(MOIDA) - 스터디 모집 플랫폼',
  description:
    '모이다(MOIDA) 스터디 모집 플랫폼과 함께 가까운 지역, 관심 분야 등 나와 가장 잘 맞는 스터디 멤버를 꾸려 함께 성장해 보세요.',
  icons: { icon: '/images/moida-icon.svg' },
}

async function StudyDetailPage({ params }: Props) {
  const { studyId } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [studyRoomData, ownerProfileData, commentsData] = await Promise.all([
    getStudyRoomDetail(studyId),
    getOwnerProfile(studyId),
    getComments(studyId),
  ])

  const studyRoomRequestsData = await getStudyRoomRequests(studyId)

  return (
    <section>
      <MemberProvider studyId={studyId} studyData={studyRoomData}>
        <CommentsProvider studyId={studyId} commentsData={commentsData}>
          <ModalContextProvider>
            <StudyDetail
              studyRoomData={studyRoomData?.data as StudyRoom}
              ownerProfile={ownerProfileData?.data as Profile}
              studyRoomRequestsData={
                studyRoomRequestsData?.data as StudyRoomRequests[]
              }
              user={user}
            />
          </ModalContextProvider>
        </CommentsProvider>
      </MemberProvider>
    </section>
  )
}

export default StudyDetailPage
