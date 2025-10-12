import { use } from 'react'

import { AuthContext, type AuthContextValue } from '@/context/autnContext'

export function useAuth(): AuthContextValue {
  const contextValue = use(AuthContext)

  if (!contextValue) {
    throw new Error('useAuth는 AuthProvider 내부에서 사용해야 합니다.')
  }

  return contextValue
}
