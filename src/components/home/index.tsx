import ToastMessage from '@/components/toast-message/toast-message'
import {
  getLatestStudyRoom,
  getQueryStudyRoom,
} from '@/libs/supabase/api/study-room'

import LatestStudy from './latest-study'
import RegionStudy from './region-study'

interface Props {
  region?: string
  depth?: string
  search?: string
  sort_by?: string
}

async function HomeComponents({ region, depth, search, sort_by }: Props) {
  const {
    data: latestData,
    ok: latestOk,
    message: latestMessage,
  } = await getLatestStudyRoom()

  const {
    ok: filterOk,
    data: filterData,
    message: filterMessage,
    count: totalCount,
  } = await getQueryStudyRoom(region, depth, search, sort_by)

  return (
    <>
      <ToastMessage
        ok={latestOk && filterOk}
        message={!latestOk ? latestMessage : filterMessage}
      />
      <LatestStudy studyData={latestData} />
      <RegionStudy studyData={filterData} totalCount={totalCount ?? 0} />
    </>
  )
}

export default HomeComponents
