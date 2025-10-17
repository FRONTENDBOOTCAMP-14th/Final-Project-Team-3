'use client'
import '@/styles/home/region-study.css'
import { useSearchParams } from 'next/navigation'

import Icons from '@/components/icons'
import type { StudyRoom } from '@/libs/supabase'

import StudyCardLists from './study-card-lists'

interface Props {
  studyData: StudyRoom[]
}

function RegionStudy({ studyData }: Props) {
  const searchParams = useSearchParams()
  const region = searchParams.get('region')
  const depth = searchParams.get('depth')
  const search = searchParams.get('search')

  let studyHeading = '전체 스터디'

  if (region && depth && search) {
    studyHeading = `${region} ${depth} ${search} 스터디`
  } else if (region && depth && !search) {
    studyHeading = `${region} ${depth} 스터디`
  } else if (!region && !depth && search) {
    studyHeading = `${search} 스터디`
  }

  return (
    <div className="region-study-container">
      <div className="region-study-header">
        <h2>
          <Icons name="map-pin" width={24} height={24} aria-hidden="true" />
          <span>{studyHeading}</span>
        </h2>
      </div>
      <div className="region-study-wrapper">
        {studyData.length === 0 ? (
          <p>{studyHeading} 검색 결과가 없습니다.</p>
        ) : (
          <StudyCardLists studyData={studyData} />
        )}
      </div>
    </div>
  )
}

export default RegionStudy
