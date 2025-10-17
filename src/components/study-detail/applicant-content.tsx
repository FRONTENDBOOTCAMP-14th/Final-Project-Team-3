import '@/styles/study-detail/members-modal.css'
import { usePathname } from 'next/navigation'

import type { Profile } from '@/libs/supabase'

import MemberLists from './member-lists'

interface Props {
  requestsListsData: Profile[] | null
  isOwner: boolean
}

function ApplicantContent({ requestsListsData, isOwner }: Props) {
  const pathName = usePathname()

  const pathArray = pathName.split('/')
  const studyId = pathArray[pathArray.length - 1]

  return (
    <div>
      <MemberLists
        isOwner={isOwner}
        studyId={studyId}
        requestsListsData={requestsListsData}
        type="APPLICANT"
      />
    </div>
  )
}

export default ApplicantContent
