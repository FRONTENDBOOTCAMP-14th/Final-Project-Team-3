import '@/styles/study-detail/members-modal.css'

import MemberLists from './member-lists'

interface Props {
  isOwner: boolean
}

function ApplicantContent({ isOwner }: Props) {
  return (
    <div>
      <MemberLists isOwner={isOwner} type="APPLICANT" />
    </div>
  )
}

export default ApplicantContent
