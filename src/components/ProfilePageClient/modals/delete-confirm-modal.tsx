'use client'

import '@/styles/delete-confirm-modal/delete-confirm-modal.css'
import React from 'react'
import { toast } from 'sonner'

import { useAuth } from '@/hooks/useAuth'
import { deleteStudyRoom } from '@/libs/supabase/api/study-room'

interface DeleteConfirmModalProps {
  isOpen?: boolean
  setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>
  studyId: string
  ownerId: string
}

export default function DeleteConfirmModal({
  setDeleteModal,
  studyId,
  ownerId,
}: DeleteConfirmModalProps) {
  const { user } = useAuth()

  const onConfirm = async () => {
    if (user?.id !== ownerId) {
      toast.error('모임장만 삭제 가능 합니다...', {
        action: {
          label: '닫기',
          onClick: () => {},
        },
      })
      return
    }

    const result = await deleteStudyRoom(studyId)

    if (result.ok) {
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
  }

  return (
    <div
      className="delete-modal-backdrop"
      onClick={() => {
        setDeleteModal(false)
      }}
    >
      <div className="delete-modal">
        <p className="delete-modal-text">
          정말로 이 스터디를 삭제하시겠습니까?
        </p>
        <div className="delete-modal-buttons">
          <button type="button" className="confirm-btn" onClick={onConfirm}>
            확인
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setDeleteModal(false)
            }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  )
}
