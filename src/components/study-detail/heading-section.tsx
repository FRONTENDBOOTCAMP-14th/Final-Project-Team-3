'use client'
import type { User } from '@supabase/supabase-js'

import CategoryUI from '@/components/ui/category-ui'
import { useModal } from '@/hooks/useModal'
import type { StudyRoom, StudyRoomRequests } from '@/libs/supabase'

import IconsButtonGroup from './button/icon-button-group'
import RequestBtn from './button/request-btn'

interface Props {
  studyRoomRequestsData: StudyRoomRequests[]
  studyRoomData: StudyRoom
  user: User | null
}

function HeadingSection({ studyRoomRequestsData, studyRoomData, user }: Props) {
  const { setOpenModal, setModalType } = useModal()
  return (
    <div className="detail-heading">
      <div className="detail-header">
        <h3>{studyRoomData.title}</h3>
        <div className="detail-button-group">
          <IconsButtonGroup user={user} studyRoomData={studyRoomData} />
          {studyRoomData.owner_id !== user?.id ? (
            <>
              <RequestBtn
                studyRoomRequestsData={studyRoomRequestsData}
                user={user}
                studyId={studyRoomData.id}
              />
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setOpenModal(true)
                setModalType('APPLICANT')
              }}
            >
              신청 목록
            </button>
          )}
        </div>
      </div>
      <CategoryUI studyId={studyRoomData.id} />
    </div>
  )
}

export default HeadingSection
