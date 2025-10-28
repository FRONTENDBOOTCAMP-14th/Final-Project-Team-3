import { use } from 'react'

import {
  ChildCommentsContext,
  type ChildCommentsContextValue,
} from '@/context/childCommentsContext'

export function useCommentsChild(): ChildCommentsContextValue {
  const contextValue = use(ChildCommentsContext)

  if (!contextValue) {
    throw new Error(
      'useCommentsChild는 CommentsChildProvider 내부에서 사용해야 합니다.'
    )
  }

  return contextValue
}
