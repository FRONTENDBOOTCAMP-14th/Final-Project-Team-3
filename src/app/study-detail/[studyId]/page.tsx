import StudyDetail from '@/components/study-detail/study-detail'
import {
  getOwnerProfile,
  getStudyRoomDetail,
} from '@/libs/supabase/api/study-room'

interface Props {
  params: Promise<{ studyId: string }>
}

async function StudyDetailPage({ params }: Props) {
  const { studyId } = await params

  const data = await getStudyRoomDetail(studyId)
  const ownerProfileData = await getOwnerProfile(studyId)

  return (
    <section>
      <StudyDetail studyRoomData={data} ownerProfile={ownerProfileData} />
    </section>
  )
}

export default StudyDetailPage
