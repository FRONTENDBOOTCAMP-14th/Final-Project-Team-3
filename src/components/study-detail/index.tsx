'use client'
import Image from 'next/image'
import { useState } from 'react'

import Icons from '@/components/icons'
import CategoryUI from '@/components/ui/category-ui'
import { useAuth } from '@/hooks/useAuth'
import type { Profile, StudyRoom, StudyRoomRequests } from '@/libs/supabase'
import type { CommentsWithProfile } from '@/libs/supabase/api/comments'

import '@/styles/study-detail/study-detail.css'

import CommentForm from './comment-form'
import CommentLists from './comment-lists'
import DetailModal from './detail-modal'
import LikesAndBookmarks from './likesAndBookmarks'
import RequestBtn from './request-btn'

interface Props {
  studyRoomData: StudyRoom
  ownerProfile: Profile
  studyRoomRequestsData: StudyRoomRequests[]
  requestsListsData: Profile[]
  participantsMembers: Profile[]
  commentData: CommentsWithProfile[]
}

function StudyDetail({
  studyRoomData,
  ownerProfile,
  studyRoomRequestsData,
  requestsListsData,
  participantsMembers,
  commentData,
}: Props) {
  const { user } = useAuth()

  const [openModal, setOpenModal] = useState<boolean>(false)
  const [modalType, setModalType] = useState<'member' | 'applicant' | null>(
    null
  )

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
          sizes="100vw"
          quality={90}
        />
      </div>

      <div className="detail-description">
        <div className="detail-heading">
          <div className="detail-header">
            <h3>{studyRoomData.title}</h3>
            <div className="detail-button-group">
              <LikesAndBookmarks user={user} studyRoomData={studyRoomData} />
              {studyRoomData.owner_id !== user?.id ? (
                <>
                  <RequestBtn
                    studyRoomRequestsData={studyRoomRequestsData}
                    user={user}
                    studyId={studyRoomData.id}
                  />
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
          </div>
          <CategoryUI studyData={studyRoomData} />
        </div>

        <div className="detail-contents">
          <h3>소개</h3>
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
      </div>
      <div>
        <CommentForm studyId={studyRoomData.id} userId={user?.id} />
        <CommentLists commentData={commentData} />
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
          participantsMembers={participantsMembers}
        />
      )}
    </div>
  )
}

export default StudyDetail
