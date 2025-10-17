import '@/styles/study-detail/members-modal.css'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import Icons from '@/components/icons'
import type { Profile } from '@/libs/supabase'

import MemberLists from './member-lists'

interface Props {
  isOwner: boolean
  ownerProfile: Profile
  participantsMembers: Profile[] | null
}

function MembersContent({ isOwner, ownerProfile, participantsMembers }: Props) {
  const pathName = usePathname()

  const pathArray = pathName.split('/')
  const studyId = pathArray[pathArray.length - 1]
  return (
    <>
      <h2 className="member-list-heading">모임장</h2>
      <div className="member-list-owner">
        <div className="owner-image">
          <Image
            src={ownerProfile.profile_url ?? '/images/no-image.png'}
            alt="no-image"
            width={80}
            height={80}
          />
          <Icons
            className="owner-icon"
            name="star-blue-fill"
            width={24}
            height={24}
          />
        </div>
        <div className="member-info">
          <span className="info-name">{ownerProfile.nickname}</span>
          <p className="info-bio">
            {ownerProfile.bio ?? '자기소개 글이 없습니다..'}
          </p>
        </div>
      </div>
      <div>
        <MemberLists
          isOwner={isOwner}
          participantsMembers={participantsMembers}
          type={'MEMBER'}
          studyId={studyId}
        />
      </div>
    </>
  )
}

export default MembersContent
