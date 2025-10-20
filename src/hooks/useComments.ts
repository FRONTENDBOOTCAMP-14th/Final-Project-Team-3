import { use } from 'react'

import {
  CommentsContex,
  type CommentsContextValue,
} from '@/context/commentsContext'

export function useComments(): CommentsContextValue {
  const contextValue = use(CommentsContex)

  if (!contextValue) {
    throw new Error('useComments는 CommentsProvider 내부에서 사용해야 합니다.')
  }

  return contextValue
}
