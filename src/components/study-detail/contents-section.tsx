interface Props {
  description: string
}

function ContentsSection({ description }: Props) {
  return (
    <div className="detail-contents">
      <h3>소개</h3>
      <p>{description}</p>
    </div>
  )
}

export default ContentsSection
