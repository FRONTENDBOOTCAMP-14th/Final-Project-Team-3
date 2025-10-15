'use client'

import { useAuth } from '@/hooks/useAuth'
import type { StudyRoom } from '@/libs/supabase'

import StudyCard from './study-card'

interface Props {
  studyData: StudyRoom[]
}

function StudyCardLists({ studyData }: Props) {
  const { user } = useAuth()

  return (
    <ul className="region-study-lists">
      {studyData.map((item) => {
        return <StudyCard key={item.id} item={item} userId={user?.id} />
      })}
    </ul>
  )
}

export default StudyCardLists
