import '@/styles/study-detail/members-modal.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import Icons from '@/components/icons'
import type { Profile } from '@/libs/supabase'
import { studyRoomDeportation } from '@/libs/supabase/api/study-room'

interface Props {
  isOwner: boolean
  ownerProfile: Profile
  participantsMembers: Profile[] | null
}

function MembersContent({ isOwner, ownerProfile, participantsMembers }: Props) {
  const router = useRouter()
  const [userLists, setUserLists] = useState<Profile[] | null>(
    participantsMembers
  )
  const [userId, setUserId] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()

  const deportationMember = (
    userId: string,
    status: 'DEPORTATION' = 'DEPORTATION'
  ) => {
    setUserId((prev) => [...prev, userId])
    startTransition(async () => {
      try {
        await studyRoomDeportation(userId, status)

        setUserLists((prev) =>
          prev ? prev.filter((user) => user.id !== userId) : null
        )

        alert('추방 되었습니다.')
        router.refresh()
      } catch (error) {
        alert(error.message)
      } finally {
        setUserId([])
      }
    })
  }

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
        <h2 className="member-list-heading">멤버 ({userLists?.length})</h2>
        <ul className="member-lists">
          {userLists?.map((member) => (
            <li className="member-list-wrapper" key={member.id}>
              <Image
                src={member.profile_url ?? '/images/no-image.png'}
                alt="no-image"
                width={80}
                height={80}
              />
              <div className="member-info">
                <div className="info-wrapper">
                  <span className="info-name">{member.nickname}</span>
                  {isOwner && (
                    <div className="request-button-group">
                      <button
                        className="rejected-btn"
                        disabled={isPending && userId.includes(member.id)}
                        onClick={() => deportationMember(member.id)}
                      >
                        {isPending && userId.includes(member.id)
                          ? '추방 중...'
                          : '추방'}
                      </button>
                    </div>
                  )}
                </div>
                <p className="info-bio">
                  {member.bio ?? '자기소개 글이 없습니다..'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default MembersContent
