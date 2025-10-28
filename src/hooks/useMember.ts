import { use } from 'react'

import { MemberContext, type MemberContextValue } from '@/context/memberContext'

export function useMember(): MemberContextValue {
  const contextValue = use(MemberContext)

  if (!contextValue) {
    throw new Error('useMember는 MemberProvider 내부에서 사용해야 합니다.')
  }

  return contextValue
}
