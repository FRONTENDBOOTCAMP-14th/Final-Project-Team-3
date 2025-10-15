import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { mutate } from 'swr'

import type { Profile, StudyRoom } from '@/libs/supabase'
import {
  studyRoomDeportation,
  StudyRoomRequestsFn,
} from '@/libs/supabase/api/study-room'

interface Props {
  isOwner: boolean
  type: 'MEMBER' | 'APPLICANT'
  participantsMembers?: Profile[] | null
  requestsListsData?: Profile[] | null
  studyId?: string
}

function MemberLists({
  isOwner,
  participantsMembers,
  type,
  studyId,
  requestsListsData,
}: Props) {
  const router = useRouter()
  const [userId, setUserId] = useState<string[]>([])
  const [userLists, setUserLists] = useState<Profile[] | null>(
    type === 'MEMBER' ? (participantsMembers ?? []) : (requestsListsData ?? [])
  )
  const [status, setStatus] = useState<'REJECTED' | 'APPROVED' | ''>('')
  const [isPending, startTransition] = useTransition()
  const swrKey = ['study_room_data', studyId]

  const deportationMember = (
    userId: string,
    status: 'DEPORTATION' = 'DEPORTATION'
  ) => {
    setUserId((prev) => [...prev, userId])
    mutate(
      swrKey,
      (cacheData: StudyRoom) => {
        if (!cacheData) return

        return {
          ...cacheData,
          member_count: Math.max(0, cacheData.member_count - 1),
        }
      },
      {
        revalidate: false,
      }
    )

    startTransition(async () => {
      try {
        if (!studyId) return
        await studyRoomDeportation(studyId, userId, status)

        setUserLists((prev) =>
          prev ? prev.filter((user) => user.id !== userId) : null
        )

        alert('추방 되었습니다.')
        mutate(swrKey)
        router.refresh()
      } catch (error) {
        mutate(swrKey)
        alert(error.message)
      } finally {
        setUserId([])
      }
    })
  }

  const requestHandler = (userId: string, status: 'REJECTED' | 'APPROVED') => {
    setStatus(status)
    setUserId((prev) => [...prev, userId])
    mutate(
      swrKey,
      (cacheData: StudyRoom) => {
        if (!cacheData) return

        return {
          ...cacheData,
          member_count: Math.max(0, cacheData.member_count + 1),
        }
      },
      {
        revalidate: false,
      }
    )

    startTransition(async () => {
      try {
        if (!studyId) return
        const data = await StudyRoomRequestsFn(studyId, userId, status)

        if (data) {
          setUserLists((prev) =>
            prev ? prev.filter((user) => user.id !== userId) : null
          )
        }
        alert(data?.request_message)
        mutate(swrKey)
        router.refresh()
      } catch (error) {
        mutate(swrKey)
        alert(error.message)
      } finally {
        setStatus('')
        setUserId([])
      }
    })
  }

  return (
    <>
      <h2 className="member-list-heading">
        {type === 'MEMBER' ? '멤버' : '신청 멤버'} ({userLists?.length})
      </h2>
      <ul className="member-lists">
        {userLists?.length !== 0
          ? userLists?.map((member) => (
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
                    <div className="request-button-group">
                      {isOwner && type === 'MEMBER' && (
                        <button
                          className="rejected-btn"
                          disabled={isPending && userId.includes(member.id)}
                          onClick={() => deportationMember(member.id)}
                        >
                          {isPending && userId.includes(member.id)
                            ? '추방 중...'
                            : '추방'}
                        </button>
                      )}

                      {isOwner && type === 'APPLICANT' && (
                        <>
                          <button
                            className="rejected-btn"
                            onClick={() =>
                              requestHandler(member.id, 'REJECTED')
                            }
                            disabled={
                              isPending &&
                              status === 'REJECTED' &&
                              userId.includes(member.id)
                            }
                          >
                            {isPending &&
                            status === 'REJECTED' &&
                            userId.includes(member.id)
                              ? '거절 중...'
                              : '거절'}
                          </button>
                          <button
                            className="approved-btn"
                            onClick={() =>
                              requestHandler(member.id, 'APPROVED')
                            }
                            disabled={
                              isPending &&
                              status === 'APPROVED' &&
                              userId.includes(member.id)
                            }
                          >
                            {isPending &&
                            status === 'APPROVED' &&
                            userId.includes(member.id)
                              ? '승인 중...'
                              : '승인'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="info-bio">
                    {member.bio ?? '자기소개 글이 없습니다..'}
                  </p>
                </div>
              </li>
            ))
          : RenderType({ type })}
      </ul>
    </>
  )
}

export default MemberLists

function RenderType({ type }: Pick<Props, 'type'>) {
  switch (type) {
    case 'MEMBER':
      return <p>참가중인 멤버가 없습니다...</p>

    case 'APPLICANT':
      return <p>참가중인 멤버가 없습니다...</p>

    default:
      return null
  }
}
