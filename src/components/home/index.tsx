import {
  filterStudyRoom,
  getAllStudyRoom,
  getLatestStudyRoom,
} from '@/libs/supabase/api/study-room'

import LatestStudy from './latest-study'
import RegionStudy from './region-study'

interface Props {
  region?: string
  depth?: string
  search?: string
}

async function HomeComponents({ region, depth, search }: Props) {
  const latestData = await getLatestStudyRoom()

  const filterData =
    !region && !depth && !search
      ? await getAllStudyRoom()
      : await filterStudyRoom(region, depth, search)

  return (
    <>
      <LatestStudy studyData={latestData} />
      <RegionStudy studyData={filterData} />
    </>
  )
}

export default HomeComponents
