import useSWR from 'swr'

import type { StudyRoom } from '../../libs/supabase'
import { getStudyRoomParticipants } from '../../libs/supabase/api/study-room'
import Icons from '../icons'

import '@/styles/ui/category-ui.css'

interface Props {
  studyData: StudyRoom
}

const fetcher = (studyId) => getStudyRoomParticipants(studyId)

function CategoryUI({ studyData }: Props) {
  const { data } = useSWR(['participants', studyData.id], () =>
    fetcher(studyData.id)
  )

  return (
    <div role="group" className="category-wrapper">
      <p>
        <Icons name="category" aria-hidden="true" />
        <span>{studyData.category}</span>
      </p>

      <p>
        <Icons name="map-pin" aria-hidden="true" />
        <span>{studyData.region_depth}</span>
      </p>

      <p>
        <Icons name="user" aria-hidden="true" />
        <span>멤버 수 {data?.length}</span>
      </p>

      <p>
        <Icons name="heart" aria-hidden="true" />
        <span>좋아요 수</span>
      </p>
    </div>
  )
}

export default CategoryUI
