import StudyDetail from '@/components/study-detail/study-detail'
import {
  getOwnerProfile,
  getStudyRoomDetail,
  getStudyRoomRequests,
} from '@/libs/supabase/api/study-room'

interface Props {
  params: Promise<{ studyId: string }>
}

async function StudyDetailPage({ params }: Props) {
  const { studyId } = await params

  // promise.all 사용 예정
  const data = await getStudyRoomDetail(studyId)
  const ownerProfileData = await getOwnerProfile(studyId)
  const studyRoomRequestsData = await getStudyRoomRequests(studyId)

  return (
    <section>
      <StudyDetail
        studyRoomData={data}
        ownerProfile={ownerProfileData}
        studyRoomRequestsData={studyRoomRequestsData}
      />
    </section>
  )
}

export default StudyDetailPage
