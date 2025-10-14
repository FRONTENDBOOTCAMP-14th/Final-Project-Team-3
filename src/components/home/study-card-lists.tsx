'use client'
import { useEffect, useState } from 'react'

import { useAuth } from '@/hooks/useAuth'
import type { Bookmark, StudyRoom } from '@/libs/supabase'
import { getMyBookMarkStudyRoom } from '@/libs/supabase/api/user'

import StudyCard from './study-card'

interface Props {
  studyData: StudyRoom[]
}

function StudyCardLists({ studyData }: Props) {
  const { user } = useAuth()
  const [bookmarkData, setBookmarkData] = useState<Bookmark[] | null>(null)

  useEffect(() => {
    const bookmarkFetch = async () => {
      if (!user) return
      const data = await getMyBookMarkStudyRoom(user.id)
      setBookmarkData(data)
    }

    bookmarkFetch()
  }, [user])

  return (
    <ul className="region-study-lists">
      {studyData.map((item) => {
        const initialIsBookmarked = !!bookmarkData?.some(
          (bookmark) => bookmark.room_id === item.id
        )
        return (
          <StudyCard
            key={item.id}
            item={item}
            initialIsBookmarked={initialIsBookmarked}
            userId={user?.id}
          />
        )
      })}
    </ul>
  )
}

export default StudyCardLists
