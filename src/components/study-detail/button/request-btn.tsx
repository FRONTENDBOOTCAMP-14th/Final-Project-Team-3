import type { User } from '@supabase/supabase-js'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import { useMember } from '@/hooks/useMember'
import type { StudyRoom, StudyRoomRequests } from '@/libs/supabase'
import { studyRoomRequestCancel } from '@/libs/supabase/api/study-room'

interface Props {
  user: User | null
  studyId: StudyRoom['id']
  studyRoomRequestsData: StudyRoomRequests[] | null
}

function RequestBtn({ studyRoomRequestsData, studyId, user }: Props) {
  const filterRequestsData = studyRoomRequestsData?.find(
    (item) => item.user_id === user?.id
  )

  const { requestsHandler } = useMember()

  const [requestData, setRequestData] = useState<
    StudyRoomRequests | null | undefined
  >(filterRequestsData)
  const [isPending, startTransition] = useTransition()

  const handleRequestClick = async () => {
    if (!user) {
      toast.error('로그인이 필요 합니다...', {
        action: {
          label: '닫기',
          onClick: () => {},
        },
      })

      return
    }

    if (!studyId || !user?.id) return

    startTransition(async () => {
      const result = await requestsHandler(user?.id, 'PENDING')

      setRequestData(result?.data)
    })
  }

  const handleRequestCancelClick = () => {
    startTransition(async () => {
      if (!studyId || !user?.id) return

      const result = await studyRoomRequestCancel(studyId, user?.id)

      if (result.ok) {
        setRequestData(null)
        toast.success(result.message, {
          action: {
            label: '닫기',
            onClick: () => {},
          },
        })
      } else {
        toast.error(result.message, {
          action: {
            label: '닫기',
            onClick: () => {},
          },
        })
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
