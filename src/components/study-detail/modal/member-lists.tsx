import Image from 'next/image'
import { useState } from 'react'

import { useMember } from '@/hooks/useMember'

interface Props {
  isOwner: boolean
  type: 'MEMBER' | 'APPLICANT'
}

function MemberLists({ isOwner, type }: Props) {
  const { requestsHandler, requestMembersData, participantsMembersData } =
    useMember()
  const [userId, setUserId] = useState<string[]>([])

  const [isPending, setIsPending] = useState(false)
  const [status, setStatus] = useState<
    'REJECTED' | 'APPROVED' | 'DEPORTATION' | ''
  >('')

  const handler = async (
    memberId: string,
    status: 'REJECTED' | 'APPROVED' | 'DEPORTATION'
  ) => {
    setStatus(status)
    setIsPending(true)
    setUserId((prev) => [...prev, memberId])

    await requestsHandler(memberId, status)

    setStatus('')
    setIsPending(false)
    setUserId([])
  }

  return (
    <>
      <h2 className="member-list-heading">
        {type === 'MEMBER'
          ? `멤버 (${participantsMembersData?.length ?? 0})`
          : `신청 멤버 (${requestMembersData?.length ?? 0})`}
      </h2>
      <ul className="member-lists" tabIndex={0}>
        {type === 'MEMBER' && participantsMembersData?.length !== 0
          ? participantsMembersData?.map((member) => (
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
                          onClick={() => handler(member.id, 'DEPORTATION')}
                        >
                          {isPending && userId.includes(member.id)
                            ? '추방 중...'
                            : '추방'}
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="info-bio">
                    {member.bio ?? '자기소개 글이 없습니다..'}
                  </p>
                </div>
              </li>
            ))
          : type === 'APPLICANT' && requestMembersData?.length !== 0
            ? requestMembersData?.map((member) => (
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
                        {isOwner && type === 'APPLICANT' && (
                          <>
                            <button
                              className="rejected-btn"
                              onClick={() => handler(member.id, 'REJECTED')}
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
                              onClick={() => handler(member.id, 'APPROVED')}
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
      return <p>참가 중인 멤버가 없습니다...</p>

    case 'APPLICANT':
      return <p>신청 중인 멤버가 없습니다...</p>

    default:
      return null
  }
}
