import Image from 'next/image'
import type { Dispatch, SetStateAction } from 'react'

import Icons from '@/components/icons'
import type { Profile } from '@/libs/supabase'

interface Props {
  participantsMembers: Profile[]
  ownerProfile: Profile
  setModalType: Dispatch<SetStateAction<'applicant' | 'member' | null>>
  setOpenModal: Dispatch<SetStateAction<boolean>>
}

function MembersSection({
  participantsMembers,
  ownerProfile,
  setModalType,
  setOpenModal,
}: Props) {
  return (
    <div className="study-members">
      <h3 className="study-members-heading">
        <span>멤버</span>
        <button
          type="button"
          onClick={() => {
            setOpenModal(true)
            setModalType('member')
          }}
        >
          전체 보기 ↓
        </button>
      </h3>
      <div className="owner-member">
        <div className="owner-member-wrapper">
          <Image
            src={ownerProfile.profile_url ?? '/images/default-avatar.png'}
            alt="no-image"
            width={80}
            height={80}
            priority
          />
          <Icons
            className="owner-icon"
            name="star-blue-fill"
            width={24}
            height={24}
          />
        </div>
      </div>
      <ul className="member-image-wrapper">
        {participantsMembers?.map((member) => (
          <li className="member-image" key={member.id}>
            <Image
              src={member.profile_url ?? '/images/default-avatar.png'}
              alt="no-image"
              width={80}
              height={80}
              priority
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MembersSection
