'use client'
import Image from 'next/image'
import { useState, useTransition } from 'react'

import Icons from '@/components/icons'
import CategoryUI from '@/components/ui/category-ui'
import { useAuth } from '@/hooks/useAuth'
import type { Profile, StudyRoom, StudyRoomRequests } from '@/libs/supabase'
import {
  studyRoomRequestCancel,
  StudyRoomRequestsFn,
} from '@/libs/supabase/api/study-room'

import '@/styles/study-detail/study-detail.css'

import DetailModal from './detail-modal'

interface Props {
  studyRoomData: StudyRoom
  ownerProfile: Profile
  studyRoomRequestsData: StudyRoomRequests[] | null
  requestsListsData: Profile[] | null
}

function StudyDetail({
  studyRoomData,
  ownerProfile,
  studyRoomRequestsData,
  requestsListsData,
}: Props) {
  const { user } = useAuth()

  const filterRequestsData = studyRoomRequestsData?.find(
    (item) => item.user_id === user?.id
  )
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [modalType, setModalType] = useState<'member' | 'applicant' | null>(
    null
  )
  const [requestData, setRequestData] = useState<
    StudyRoomRequests | null | undefined
  >(filterRequestsData)
  const [isPending, startTransition] = useTransition()

  const handleRequestClick = () => {
    startTransition(async () => {
      try {
        if (!studyRoomData.id || !user?.id) return

        const data = await StudyRoomRequestsFn(
          studyRoomData.id,
          user?.id,
          'PENDING'
        )

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
        if (!studyRoomData.id || !user?.id) return

        await studyRoomRequestCancel(studyRoomData.id, user?.id)
        setRequestData(null)
      } catch (e) {
        alert(`취소 에러 ${e.message}`)
      }
    })
  }

  const isOwner = user?.id === studyRoomData.owner_id

  return (
    <div className="detail-container">
      <div className="detail-banner">
        <Image
          src={studyRoomData.banner_image ?? '/images/no-image.png'}
          alt={`${studyRoomData.title} 이미지`}
          fill
          className="studybanner-img"
          aria-hidden="true"
          priority
        />
      </div>

      <div className="detail-description">
        <div className="detail-heading">
          <div className="detail-header">
            <h3>{studyRoomData.title}</h3>
            {studyRoomData.owner_id !== user?.id ? (
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
                  requestData?.status === 'REJECTED' ? (
                  <button
                    type="button"
                    disabled={requestData?.status === 'REJECTED'}
                  >
                    신청 불가
                  </button>
                ) : requestData?.user_id === user?.id &&
                  requestData?.status === 'APPROVED' ? (
                  <button
                    type="button"
                    disabled={requestData?.status === 'APPROVED'}
                  >
                    참여 중
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRequestClick}
                    disabled={isPending}
                  >
                    신청 하기
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setOpenModal(true)
                  setModalType('applicant')
                }}
              >
                신청 목록
              </button>
            )}
          </div>
          <CategoryUI studyData={studyRoomData} />
        </div>

        <div className="detail-contents">
          <p>{studyRoomData.description}</p>
        </div>

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
          </div>
          <ul className="member-image-wrapper">
            <li className="member-image">
              <Image
                src={'/images/no-image.png'}
                alt="no-image"
                width={80}
                height={80}
              />
            </li>

            <li className="member-image">
              <Image
                src={'/images/no-image.png'}
                alt="no-image"
                width={80}
                height={80}
              />
            </li>
            <li className="member-image">
              <Image
                src={'/images/no-image.png'}
                alt="no-image"
                width={80}
                height={80}
              />
            </li>
            <li className="member-image">
              <Image
                src={'/images/no-image.png'}
                alt="no-image"
                width={80}
                height={80}
              />
            </li>
          </ul>
        </div>
      </div>
      {openModal && (
        <DetailModal
          setOpenModa={setOpenModal}
          openModal={openModal}
          setModalType={setModalType}
          modalType={modalType}
          isOwner={isOwner}
          user={user}
          ownerProfile={ownerProfile}
          requestsListsData={requestsListsData}
        />
      )}
    </div>
  )
}

export default StudyDetail
