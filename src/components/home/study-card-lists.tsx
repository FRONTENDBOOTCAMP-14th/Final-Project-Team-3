'use client'

import { useAuth } from '@/hooks/useAuth'
import type { StudyRoom } from '@/libs/supabase'

import StudyCard from './study-card'

interface Props {
  studyData: StudyRoom[]
}

const MAX_PRIORITY_COUNT = 10

function StudyCardLists({ studyData }: Props) {
  const { user } = useAuth()
  return (
    <ul className="region-study-lists">
      {studyData.map((item, index) => {
        return (
          <StudyCard
            key={item.id}
            item={item}
            userId={user?.id}
            isPriority={index < MAX_PRIORITY_COUNT}
          />
        )
      })}
    </ul>
  )
}

export default StudyCardLists
