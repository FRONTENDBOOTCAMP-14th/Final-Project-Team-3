import '@/styles/study-detail/members-modal.css'
import React, { useRef } from 'react'

import useFocusTrap from '../../hooks/useFocusTrap'
import useKeyEvent from '../../hooks/useKeyEvent'
import useScrollLock from '../../hooks/useScrollLock'

import ApplicantContent from './applicant-content'
import MembersContent from './members-content'

interface ModalProps {
  setOpenModa: (value: React.SetStateAction<boolean>) => void
  openModal: boolean
  modalType: 'member' | 'applicant' | null
  isOwner: boolean
  setModalType: (
    value: React.SetStateAction<'member' | 'applicant' | null>
  ) => void
}

function DetailModal({
  setOpenModa,
  openModal,
  modalType,
  isOwner,
  setModalType,
}: ModalProps) {
  const requestModalRef = useRef<HTMLDivElement | null>(null)

  useScrollLock(openModal, 'member-list-modal-container')
  useFocusTrap(requestModalRef, openModal)
  useKeyEvent(
    'Escape',
    () => {
      setOpenModa(false)
      setModalType(null)
    },
    openModal
  )

  return (
    <div
      className="member-list-modal-container"
      ref={requestModalRef}
      onClick={() => {
        setOpenModa((prev) => !prev)
        setModalType(null)
      }}
    >
      <div
        className="member-list-modal-wrapper"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-scroll" tabIndex={0}>
          {ModalContentType({ modalType }, isOwner)}
        </div>
      </div>
    </div>
  )
}

export default DetailModal

function ModalContentType(
  { modalType }: Pick<ModalProps, 'modalType'>,
  isOwner: boolean = false
) {
  switch (modalType) {
    case 'member':
      return <MembersContent isOwner={isOwner} />

    case 'applicant':
      return <ApplicantContent />

    default:
      return null
  }
}
