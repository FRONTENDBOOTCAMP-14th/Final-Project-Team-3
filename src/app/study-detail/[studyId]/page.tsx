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

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ studyId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { studyId } = await params
  const response = await getStudyRoomDetail(studyId)
  if (!response.ok) {
    throw new Error(response.message)
  }

  return {
    title: `${response.data?.title}`,
    description: `${response.data?.title} | ${response.data?.description}`,
  }
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
