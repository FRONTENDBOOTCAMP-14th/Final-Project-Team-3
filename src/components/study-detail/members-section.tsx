'use client'
import Image from 'next/image'

import Icons from '@/components/icons'
import { useMember } from '@/hooks/useMember'
import { useModal } from '@/hooks/useModal'
import type { Profile } from '@/libs/supabase'

interface Props {
  ownerProfile: Profile
}

function MembersSection({ ownerProfile }: Props) {
  const { participantsMembersData } = useMember()
  const { setModalType, setOpenModal } = useModal()
  return (
    <div className="study-members">
      <h3 className="study-members-heading">
        <span>멤버</span>
        <button
          type="button"
          onClick={() => {
            setOpenModal(true)
            setModalType('MEMBER')
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
        {participantsMembersData?.data?.map((member) => (
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
