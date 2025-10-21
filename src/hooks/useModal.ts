import { use } from 'react'

import { ModalContext, type ModalContextValue } from '@/context/modalContext'

export function useModal(): ModalContextValue {
  const contextValue = use(ModalContext)

  if (!contextValue) {
    throw new Error('useModal는 ModalProvider 내부에서 사용해야 합니다.')
  }

  return contextValue
}
