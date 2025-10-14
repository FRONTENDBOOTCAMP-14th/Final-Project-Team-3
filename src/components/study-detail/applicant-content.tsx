import '@/styles/study-detail/members-modal.css'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import type { Profile } from '@/libs/supabase'
import { StudyRoomRequestsFn } from '@/libs/supabase/api/study-room'

interface Props {
  requestsListsData: Profile[] | null
}

function ApplicantContent({ requestsListsData }: Props) {
  const pathName = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [userLists, setUserLists] = useState<Profile[] | null>(
    requestsListsData
  )
  const [status, setStatus] = useState<'REJECTED' | 'APPROVED' | ''>('')
  const [userId, setUserId] = useState<string[]>([])

  const pathArray = pathName.split('/')
  const studyId = pathArray[pathArray.length - 1]

  const requestHandler = (userId: string, status: 'REJECTED' | 'APPROVED') => {
    setStatus(status)
    setUserId((prev) => [...prev, userId])
    startTransition(async () => {
      try {
        const data = await StudyRoomRequestsFn(studyId, userId, status)

        if (data) {
          setUserLists((prev) =>
            prev ? prev.filter((user) => user.id !== userId) : null
          )
        }
        alert(data?.request_message)
        router.refresh()
      } catch (error) {
        alert(error.message)
      } finally {
        setStatus('')
        setUserId([])
      }
    })
  }

  return (
    <div>
      <h2 className="member-list-heading">신청 멤버 ({userLists?.length})</h2>
      <ul className="member-lists">
        {userLists?.length !== 0 ? (
          userLists?.map((user) => (
            <li className="member-list-wrapper" key={user.id}>
              <Image
                src={user.profile_url ?? '/images/no-image.png'}
                alt="no-image"
                width={80}
                height={80}
              />
              <div className="member-info">
                <div className="info-wrapper">
                  <span className="info-name">{user.nickname}</span>
                  <div className="request-button-group">
                    <button
                      className="rejected-btn"
                      onClick={() => requestHandler(user.id, 'REJECTED')}
                      disabled={
                        isPending &&
                        status === 'REJECTED' &&
                        userId.includes(user.id)
                      }
                    >
                      {isPending &&
                      status === 'REJECTED' &&
                      userId.includes(user.id)
                        ? '거절 중...'
                        : '거절'}
                    </button>
                    <button
                      className="approved-btn"
                      onClick={() => requestHandler(user.id, 'APPROVED')}
                      disabled={
                        isPending &&
                        status === 'APPROVED' &&
                        userId.includes(user.id)
                      }
                    >
                      {isPending &&
                      status === 'APPROVED' &&
                      userId.includes(user.id)
                        ? '승인 중...'
                        : '승인'}
                    </button>
                  </div>
                </div>
                <p className="info-bio">
                  {user.bio ?? '자기소개가 없습니다...'}
                </p>
              </div>
            </li>
          ))
        ) : (
          <p>신청 멤버가 없습니다...</p>
        )}
      </ul>
    </div>
  )
}

export default ApplicantContent
