import StudyDetail from '@/components/study-detail'
import EditButton from '@/components/study-detail/edit-button'
import { CommentsProvider } from '@/context/commentsContext'
import { MemberProvider } from '@/context/memberContext'
import { ModalContextProvider } from '@/context/modalContext'
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
      <EditButton studyId={studyId} />
      <MemberProvider studyId={studyId} studyData={studyRoomData}>
        <CommentsProvider studyId={studyId} commentsData={commentsData}>
          <ModalContextProvider>
            <StudyDetail
              studyRoomData={studyRoomData}
              ownerProfile={ownerProfileData}
              studyRoomRequestsData={studyRoomRequestsData}
              user={user}
            />
          </ModalContextProvider>
        </CommentsProvider>
      </MemberProvider>
    </section>
  )
}

export default StudyDetailPage
