import { use } from 'react'

import {
  ProfileContext,
  type ProfileContextValue,
} from '@/context/profileContext'

export function useProfile(): ProfileContextValue {
  const contextValue = use(ProfileContext)

  if (!contextValue) {
    throw new Error('useProfile는 ProfileProvider 내부에서 사용해야 합니다.')
  }

  return contextValue
}
