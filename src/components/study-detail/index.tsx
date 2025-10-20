'use client'
import { useState } from 'react'

import { useAuth } from '@/hooks/useAuth'
import type { Profile, StudyRoom, StudyRoomRequests } from '@/libs/supabase'

import '@/styles/study-detail/study-detail.css'

import BannerSection from './banner-section'
import CommentsSection from './comments'
import ContentsSection from './contents-section'
import HeadingSection from './heading-section'
import MembersSection from './members-section'
import DetailModal from './modal'

interface Props {
  studyRoomData: StudyRoom
  ownerProfile: Profile
  studyRoomRequestsData: StudyRoomRequests[]
  requestsListsData: Profile[]
  participantsMembers: Profile[]
}

function StudyDetail({
  studyRoomData,
  ownerProfile,
  studyRoomRequestsData,
  requestsListsData,
  participantsMembers,
}: Props) {
  const { user } = useAuth()

  const [openModal, setOpenModal] = useState<boolean>(false)
  const [modalType, setModalType] = useState<'member' | 'applicant' | null>(
    null
  )

  const isOwner = user?.id === studyRoomData.owner_id

  return (
    <div className="detail-container">
      <BannerSection studyRoomData={studyRoomData} />

      <section className="detail-description">
        <HeadingSection
          studyRoomRequestsData={studyRoomRequestsData}
          studyRoomData={studyRoomData}
          user={user}
          setModalType={setModalType}
          setOpenModal={setOpenModal}
        />

        <ContentsSection description={studyRoomData.description} />

        <MembersSection
          participantsMembers={participantsMembers}
          ownerProfile={ownerProfile}
          setModalType={setModalType}
          setOpenModal={setOpenModal}
        />
      </section>
      <CommentsSection studyRoomData={studyRoomData} user={user} />
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
