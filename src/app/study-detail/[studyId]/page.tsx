import StudyDetail from '../../../components/study-detail/study-detail'
import { getStudyRoomDetail } from '../../../libs/supabase/api/study-room'

interface Props {
  params: Promise<{ studyId: string }>
}

async function StudyDetailPage({ params }: Props) {
  const { studyId } = await params

  const data = await getStudyRoomDetail(studyId)

  return (
    <section>
      <StudyDetail studyRoomData={data} />
    </section>
  )
}

export default StudyDetailPage
