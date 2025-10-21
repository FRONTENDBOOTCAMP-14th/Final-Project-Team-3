'use client'
import '@/styles/study-detail/members-modal.css'
import type { User } from '@supabase/supabase-js'
import { useRef } from 'react'

import useFocusTrap from '@/hooks/useFocusTrap'
import useKeyEvent from '@/hooks/useKeyEvent'
import { useModal } from '@/hooks/useModal'
import useScrollLock from '@/hooks/useScrollLock'
import type { Profile } from '@/libs/supabase'

import ApplicantContent from './applicant-content'
import MembersContent from './members-content'

interface ModalProps {
  isOwner: boolean
  user: User | null
  ownerProfile: Profile
}

function DetailModal({ isOwner, ownerProfile }: ModalProps) {
  const requestModalRef = useRef<HTMLDivElement | null>(null)
  const { modalType, openModal, setModalType, setOpenModal } = useModal()

  useScrollLock(openModal, 'member-list-modal-container')
  useFocusTrap(requestModalRef, openModal)
  useKeyEvent(
    'Escape',
    () => {
      setOpenModal(false)
      setModalType(null)
    },
    openModal
  )

  return (
    openModal && (
      <div
        className="member-list-modal-container"
        ref={requestModalRef}
        onClick={() => {
          setOpenModal((prev) => !prev)
          setModalType(null)
        }}
      >
        <div
          className="member-list-modal-wrapper"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-scroll" tabIndex={0}>
            {ModalContentType({ modalType }, isOwner, ownerProfile)}
          </div>
        </div>
      </div>
    )
  )
}

export default DetailModal

function ModalContentType(
  { modalType }: { modalType: 'MEMBER' | 'APPLICANT' | null },
  isOwner: boolean = false,
  ownerProfile: Profile
) {
  switch (modalType) {
    case 'MEMBER':
      return <MembersContent isOwner={isOwner} ownerProfile={ownerProfile} />

    case 'APPLICANT':
      return <ApplicantContent isOwner={isOwner} />

    default:
      return null
  }
}
