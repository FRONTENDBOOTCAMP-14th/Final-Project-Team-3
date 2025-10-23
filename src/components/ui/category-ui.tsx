'use client'
import useSWR from 'swr'

import '@/styles/ui/category-ui.css'

import Icons from '@/components/icons'
import { getStudyRoomDetail } from '@/libs/supabase/api/study-room'

interface Props {
  studyId: string
}

const fetcher = (studyId: string) => getStudyRoomDetail(studyId)

function CategoryUI({ studyId }: Props) {
  const { data: studyRoomData } = useSWR(
    [`study_room_data_${studyId}`],
    () => fetcher(studyId),
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
        <span>{studyRoomData?.data?.category}</span>
      </p>

      <p>
        <Icons name="map-pin" aria-hidden="true" />
        <span>{studyRoomData?.data?.region_depth}</span>
      </p>

      <p>
        <Icons name="user" aria-hidden="true" />
        <span>멤버 {studyRoomData?.data?.member_count}</span>
      </p>

      <p>
        <Icons name="heart" aria-hidden="true" />
        <span>좋아요 {studyRoomData?.data?.likes_count}</span>
      </p>
    </div>
  )
}

export default CategoryUI
