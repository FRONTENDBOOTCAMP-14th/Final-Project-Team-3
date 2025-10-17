'use client'

import StudyCardLists from '@/components/home/study-card-lists'
import type { StudyRoom } from '@/libs/supabase'

interface Props {
  favorites: StudyRoom[]
}

export default function UserFavoritesSection({ favorites }: Props) {
  return (
    <section className="user-favorites-section">
      <h3 className="section-title">즐겨찾기</h3>
      <StudyCardLists studyData={favorites} />
    </section>
  )
}
