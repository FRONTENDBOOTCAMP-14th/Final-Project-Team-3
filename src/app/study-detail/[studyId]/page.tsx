import StudyDetail from '@/components/study-detail'
import {
  getOwnerProfile,
  getStudyRoomDetail,
  getStudyRoomParticipants,
  getStudyRoomRequests,
  studyRoomRequestsLists,
} from '@/libs/supabase/api/study-room'

import { getComments } from '../../../libs/supabase/api/comments'

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
  const commentData = await getComments(studyId)
  return (
    <section>
      <StudyDetail
        studyRoomData={studyRoomData}
        ownerProfile={ownerProfileData}
        studyRoomRequestsData={studyRoomRequestsData}
        requestsListsData={requestsListsData}
        participantsMembers={participantsMembers}
        commentData={commentData}
      />
    </section>
  )
}

export default StudyDetailPage
