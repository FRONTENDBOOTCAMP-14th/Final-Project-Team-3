'use client'

import StudyCardLists from '@/components/home/study-card-lists'
import type { StudyRoom } from '@/libs/supabase'

interface Props {
  studies: StudyRoom[]
}

export default function UserStudiesSection({ studies }: Props) {
  return (
    <section className="user-study-section">
      <h3 className="section-title">내 스터디</h3>
      <StudyCardLists studyData={studies} />
    </section>
  )
}
