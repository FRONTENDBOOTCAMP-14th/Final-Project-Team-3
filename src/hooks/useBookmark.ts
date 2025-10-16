import { use } from 'react'

import {
  BookMarkContext,
  type BookMarkContextValue,
} from '@/context/bookmarkContext'

export function useBookMark(): BookMarkContextValue {
  const contextValue = use(BookMarkContext)

  if (!contextValue) {
    throw new Error('useBookMark는 BookMarkProvider 내부에서 사용해야 합니다.')
  }

  return contextValue
}
