import StudyDetail from '../../../components/study-detail/study-detail'

interface Props {
  params: Promise<{ studyId: string }>
}

async function StudyDetailPage({ params }: Props) {
  const { studyId } = await params

  return (
    <section>
      <StudyDetail studyId={studyId} />
    </section>
  )
}

export default StudyDetailPage
