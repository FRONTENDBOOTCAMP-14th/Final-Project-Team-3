import StudyDetail from '@/components/study-detail'
import { CommentsProvider } from '@/context/commentsContext'
import {
  getOwnerProfile,
  getStudyRoomDetail,
  getStudyRoomParticipants,
  getStudyRoomRequests,
  studyRoomRequestsLists,
} from '@/libs/supabase/api/study-room'

interface Props {
  params: Promise<{ studyId: string }>
}

async function StudyDetailPage({ params }: Props) {
  const { studyId } = await params

  const [
    studyRoomData,
    ownerProfileData,
    requestsListsData,
    participantsMembers,
  ] = await Promise.all([
    getStudyRoomDetail(studyId),
    getOwnerProfile(studyId),
    studyRoomRequestsLists(studyId),
    getStudyRoomParticipants(studyId),
  ])

  const studyRoomRequestsData = await getStudyRoomRequests(studyId)

  return (
    <section>
      <CommentsProvider studyId={studyId}>
        <StudyDetail
          studyRoomData={studyRoomData}
          ownerProfile={ownerProfileData}
          studyRoomRequestsData={studyRoomRequestsData}
          requestsListsData={requestsListsData}
          participantsMembers={participantsMembers}
        />
      </CommentsProvider>
    </section>
  )
}

export default StudyDetailPage
