import {
  filterStudyRoom,
  readStudyRoom,
} from '../../libs/supabase/api/study-room'

import LatestStudy from './latest-study'
import RegionStudy from './region-study'

interface Props {
  region?: string
  depth?: string
  search?: string
}

async function HomeComponents({ region, depth, search }: Props) {
  const allData = await readStudyRoom()

  const filterData =
    !region && !depth && !search
      ? await readStudyRoom()
      : await filterStudyRoom(region, depth, search)

  return (
    <>
      <LatestStudy studyData={allData} />
      <RegionStudy studyData={filterData} />
    </>
  )
}

export default HomeComponents
