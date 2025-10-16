import { use } from 'react'

import { LikesContext, type LikesContextValue } from '@/context/likesContext'

export function useLikes(): LikesContextValue {
  const contextValue = use(LikesContext)

  if (!contextValue) {
    throw new Error('useLikes는 LikesProvider 내부에서 사용해야 합니다.')
  }

  return contextValue
}
