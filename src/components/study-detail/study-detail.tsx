'use client'
import Image from 'next/image'
import { useState } from 'react'

import Icons from '@/components/icons'
import CategoryUI from '@/components/ui/category-ui'
import { useAuth } from '@/hooks/useAuth'
import type { Profile, StudyRoom } from '@/libs/supabase'

import '@/styles/study-detail/study-detail.css'

import DetailModal from './detail-modal'

interface Props {
  studyRoomData: StudyRoom
  ownerProfile: Profile
}

function StudyDetail({ studyRoomData, ownerProfile }: Props) {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [modalType, setModalType] = useState<'member' | 'applicant' | null>(
    null
  )
  const { user } = useAuth()

  const isOwner = user?.id === studyRoomData.owner_id

  return (
    <div className="detail-container">
      <div className="detail-banner">
        {studyRoomData.banner_image ? (
          <Image
            src={studyRoomData.banner_image}
            alt={`${studyRoomData.title} 이미지`}
            fill
            className="studybanner-img"
            aria-hidden="true"
            priority
          />
        ) : (
          <Image
            src={'/images/no-image.png'}
            alt="no-image"
            fill
            className="studybanner-img"
            aria-hidden="true"
            priority
          />
        )}
      </div>

      <div className="detail-description">
        <div className="detail-heading">
          <div className="detail-header">
            <h3>{studyRoomData.title}</h3>
            {studyRoomData.owner_id !== user?.id ? (
              <button type="button">참가 신청</button>
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
        />
      )}
    </div>
  )
}

export default StudyDetail
