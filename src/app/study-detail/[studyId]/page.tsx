import StudyDetail from '@/components/study-detail/study-detail'
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
    studyRoomRequestsData,
    requestsListsData,
    participantsMembers,
  ] = await Promise.all([
    getStudyRoomDetail(studyId),
    getOwnerProfile(studyId),
    getStudyRoomRequests(studyId),
    studyRoomRequestsLists(studyId),
    getStudyRoomParticipants(studyId),
  ])

  return (
    <section>
      <StudyDetail
        studyRoomData={studyRoomData}
        ownerProfile={ownerProfileData}
        studyRoomRequestsData={studyRoomRequestsData}
        requestsListsData={requestsListsData}
        participantsMembers={participantsMembers}
      />
    </section>
  )
}

export default StudyDetailPage
