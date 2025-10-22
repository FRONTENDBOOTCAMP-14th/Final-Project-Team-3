'use client'

import '@/styles/delete-confirm-modal/delete-confirm-modal.css'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="delete-modal-backdrop">
      <div className="delete-modal">
        <p className="delete-modal-text">
          정말로 이 스터디를 삭제하시겠습니까?
        </p>
        <div className="delete-modal-buttons">
          <button type="button" className="confirm-btn" onClick={onConfirm}>
            확인
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            취소
          </button>
        </div>
      </div>
    </div>
  )
}
