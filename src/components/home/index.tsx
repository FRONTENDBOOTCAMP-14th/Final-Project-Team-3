import {
  getLatestStudyRoom,
  getQueryStudyRoom,
} from '@/libs/supabase/api/study-room'

import ToastMessage from '../toast-message/toast-message'

import LatestStudy from './latest-study'
import RegionStudy from './region-study'

interface Props {
  region?: string
  depth?: string
  search?: string
}

async function HomeComponents({ region, depth, search }: Props) {
  const {
    data: latestData,
    ok: latestOk,
    message: latestMessage,
  } = await getLatestStudyRoom()

  const {
    ok: filterOk,
    data: filterData,
    message: filterMessage,
  } = await getQueryStudyRoom(region, depth, search)

  return (
    <>
      <ToastMessage
        ok={latestOk && filterOk}
        message={!latestOk ? latestMessage : filterMessage}
      />
      <LatestStudy studyData={latestData} />
      <RegionStudy studyData={filterData} />
    </>
  )
}

export default HomeComponents
