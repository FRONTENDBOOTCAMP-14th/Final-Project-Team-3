'use client'

import StudyDetailCard from '@/components/home/study-detail-card'
import type { StudyRoom } from '@/libs/supabase'

interface Props {
  favorites: StudyRoom[]
}

export default function UserFavoritesSection({ favorites }: Props) {
  return (
    <section className="user-favorites-section">
      <h3 className="section-title">즐겨찾기</h3>
      <StudyDetailCard studyData={favorites} />
    </section>
  )
}
