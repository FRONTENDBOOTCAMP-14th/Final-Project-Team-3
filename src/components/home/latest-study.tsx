import '@/styles/home/latest-study.css'

import type { StudyRoom } from '@/libs/supabase'

import StudyRoomCard from './study-simple-card'

interface Props {
  studyData: StudyRoom[] | undefined
}

function LatestStudy({ studyData }: Props) {
  return (
    <div className="latest-container">
      <div className="latest-header">
        <h2>최신 스터디</h2>
      </div>
      <div className="latest-wrapper">
        <StudyRoomCard studyData={studyData} />
      </div>
    </div>
  )
}

export default LatestStudy
