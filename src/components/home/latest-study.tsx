import '@/styles/home/latest-study.css'

import StudyRoomCard from './study-simple-card'

function LatestStudy() {
  return (
    <div className="latest-container">
      <div className="latest-header">
        <h2>최신 스터디</h2>
      </div>
      <div className="latest-wrapper">
        <StudyRoomCard />
      </div>
    </div>
  )
}

export default LatestStudy
