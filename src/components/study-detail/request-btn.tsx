import type { User } from '@supabase/supabase-js'
import { useState, useTransition } from 'react'

import type { StudyRoom, StudyRoomRequests } from '../../libs/supabase'
import {
  studyRoomRequestCancel,
  StudyRoomRequestsFn,
} from '../../libs/supabase/api/study-room'

interface Props {
  user: User | null
  studyId: StudyRoom['id']
  studyRoomRequestsData: StudyRoomRequests[] | null
}

function RequestBtn({ studyRoomRequestsData, studyId, user }: Props) {
  const filterRequestsData = studyRoomRequestsData?.find(
    (item) => item.user_id === user?.id
  )

  const [requestData, setRequestData] = useState<
    StudyRoomRequests | null | undefined
  >(filterRequestsData)
  const [isPending, startTransition] = useTransition()

  const handleRequestClick = () => {
    startTransition(async () => {
      try {
        if (!studyId || !user?.id) return

        const data = await StudyRoomRequestsFn(studyId, user?.id, 'PENDING')

        setRequestData(data)
        alert('신청이 완료 되었습니다.')
      } catch (e) {
        alert(`신청 에러 ${e.message}`)
      }
    })
  }

  const handleRequestCancelClick = () => {
    startTransition(async () => {
      try {
        if (!studyId || !user?.id) return

        await studyRoomRequestCancel(studyId, user?.id)
        setRequestData(null)
      } catch (e) {
        alert(`취소 에러 ${e.message}`)
      }
    })
  }

  return (
    <>
      {isPending ? (
        <button type="button" disabled>
          {requestData?.user_id === user?.id &&
          requestData?.status === 'PENDING'
            ? '취소 중...'
            : '신청 중...'}
        </button>
      ) : requestData?.user_id === user?.id &&
        requestData?.status === 'PENDING' ? (
        <button
          type="button"
          className="cancel-btn"
          onClick={handleRequestCancelClick}
          disabled={isPending}
        >
          신청 취소
        </button>
      ) : requestData?.user_id === user?.id &&
        (requestData?.status === 'REJECTED' ||
          requestData?.status === 'DEPORTATION') ? (
        <button
          type="button"
          disabled={
            requestData?.status === 'REJECTED' ||
            requestData?.status === 'DEPORTATION'
          }
        >
          신청 불가
        </button>
      ) : requestData?.user_id === user?.id &&
        requestData?.status === 'APPROVED' ? (
        <button type="button" disabled={requestData?.status === 'APPROVED'}>
          참여 중
        </button>
      ) : (
        <button type="button" onClick={handleRequestClick} disabled={isPending}>
          신청 하기
        </button>
      )}
    </>
  )
}

export default RequestBtn
