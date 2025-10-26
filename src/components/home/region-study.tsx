'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import type { ChangeEvent } from 'react'

import Icons from '@/components/icons'
import type { StudyRoom } from '@/libs/supabase'

import StudyCardLists from './study-card-lists'

import '@/styles/home/region-study.css'

interface Props {
  studyData: StudyRoom[] | undefined
}

function RegionStudy({ studyData }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const region = searchParams.get('region')
  const depth = searchParams.get('depth')
  const search = searchParams.get('search')
  const currentSortValue = searchParams.get('sort_by') ?? ''

  let studyHeading = '전체 스터디'

  if (region && depth && search) {
    studyHeading = `${region} ${depth} ${search} 스터디`
  } else if (region && depth && !search) {
    studyHeading = `${region} ${depth} 스터디`
  } else if (!region && !depth && search) {
    studyHeading = `${search} 스터디`
  }

  const selectedHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value

    const params = new URLSearchParams(searchParams.toString())

    if (sortValue === '') {
      params.delete('sort_by')
    } else {
      params.set('sort_by', sortValue)
    }

    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="region-study-container">
      <div className="region-study-header">
        <h2>
          <Icons name="map-pin" width={24} height={24} aria-hidden="true" />
          <span>{studyHeading}</span>
        </h2>
        <label htmlFor="study-select" className="sr-only">
          정렬 기준 선택
        </label>
        <select
          name="sort"
          id="study-sort"
          className="study-sort"
          value={currentSortValue}
          onChange={selectedHandler}
        >
          <option value="">정렬 기준</option>
          <option value="latest">최신순</option>
          <option value="members">멤버순</option>
          <option value="likes">좋아요순</option>
        </select>
      </div>
      <div className="region-study-wrapper">
        {studyData?.length === 0 ? (
          <p>{studyHeading} 검색 결과가 없습니다.</p>
        ) : (
          <StudyCardLists studyData={studyData} />
        )}
      </div>
    </div>
  )
}

export default RegionStudy
