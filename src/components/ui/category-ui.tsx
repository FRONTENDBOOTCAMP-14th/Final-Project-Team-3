'use client'
import useSWR from 'swr'

import Icons from '@/components/icons'
import type { StudyRoom } from '@/libs/supabase'
import { getStudyRoomDetail } from '@/libs/supabase/api/study-room'

import '@/styles/ui/category-ui.css'

interface Props {
  studyData: StudyRoom
}

const fetcher = (studyId: string) => getStudyRoomDetail(studyId)

function CategoryUI({ studyData }: Props) {
  const { data } = useSWR(
    ['study_room_data', studyData.id],
    () => fetcher(studyData.id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 10000,
    }
  )

  return (
    <div role="group" className="category-wrapper">
      <p>
        <Icons name="category" aria-hidden="true" />
        <span>{data?.category}</span>
      </p>

      <p>
        <Icons name="map-pin" aria-hidden="true" />
        <span>{data?.region_depth}</span>
      </p>

      <p>
        <Icons name="user" aria-hidden="true" />
        <span>멤버 {data?.member_count}</span>
      </p>

      <p>
        <Icons name="heart" aria-hidden="true" />
        <span>좋아요 {data?.likes_count}</span>
      </p>
    </div>
  )
}

export default CategoryUI
