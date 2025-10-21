'use client'
import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { createContext, useMemo, useState } from 'react'

export interface ModalContextValue {
  modalType: 'MEMBER' | 'APPLICANT' | 'CHAT' | null
  openModal: boolean
  setOpenModal: Dispatch<SetStateAction<boolean>>
  setModalType: Dispatch<SetStateAction<'MEMBER' | 'APPLICANT' | 'CHAT' | null>>
}

export const ModalContext = createContext<ModalContextValue | null>(null)
ModalContext.displayName = 'ModalProvider'

export function ModalContextProvider({ children }: PropsWithChildren) {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [modalType, setModalType] = useState<
    'MEMBER' | 'APPLICANT' | 'CHAT' | null
  >(null)

  const contextState: ModalContextValue = useMemo(
    () => ({
      setOpenModal,
      openModal,
      modalType,
      setModalType,
    }),
    [modalType, openModal]
  )
  return <ModalContext value={contextState}>{children}</ModalContext>
}
