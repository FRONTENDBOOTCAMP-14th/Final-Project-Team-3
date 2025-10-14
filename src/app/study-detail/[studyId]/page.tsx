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

  // promise.all 사용 예정
  const studyRoomData = await getStudyRoomDetail(studyId)
  const ownerProfileData = await getOwnerProfile(studyId)
  const studyRoomRequestsData = await getStudyRoomRequests(studyId)
  const requestsListsData = await studyRoomRequestsLists(studyId)
  const participantsMembers = await getStudyRoomParticipants(studyId)

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
