import '@/styles/home/region-study.css'
import Icons from '../icons'

import StudyDetailCard from './study-detail-card'

function RegionStudy() {
  return (
    <div className="region-study-container">
      <div className="region-study-header">
        <h2>
          <Icons name="map-pin" width={24} height={24} aria-hidden="true" />
          <span>서울특별시 강남구 스터디</span>
        </h2>
      </div>
      <div className="region-study-wrapper">
        <StudyDetailCard />
      </div>
    </div>
  )
}

export default RegionStudy
