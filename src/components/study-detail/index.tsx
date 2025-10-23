import type { User } from '@supabase/supabase-js'

import '@/styles/study-detail/study-detail.css'

import type { Profile, StudyRoom, StudyRoomRequests } from '@/libs/supabase'

import BannerSection from './banner-section'
import CommentsSection from './comments'
import ContentsSection from './contents-section'
import HeadingSection from './heading-section'
import MembersSection from './members-section'
import DetailModal from './modal'

interface Props {
  studyRoomData: StudyRoom
  ownerProfile: Profile
  studyRoomRequestsData: StudyRoomRequests[]
  user: User | null
}

function StudyDetail({
  studyRoomData,
  ownerProfile,
  studyRoomRequestsData,
  user,
}: Props) {
  const isOwner = user?.id === studyRoomData?.owner_id

  return (
    <div className="detail-container">
      <BannerSection studyRoomData={studyRoomData} isOwner={isOwner} />

      <section className="detail-description">
        <HeadingSection
          studyRoomRequestsData={studyRoomRequestsData}
          studyRoomData={studyRoomData}
          user={user}
        />

        <ContentsSection description={studyRoomData.description} />

        <MembersSection ownerProfile={ownerProfile} />
      </section>
      <CommentsSection user={user} />

      <DetailModal
        isOwner={isOwner}
        user={user}
        ownerProfile={ownerProfile}
        studyId={studyRoomData.id}
      />
    </div>
  )
}

export default StudyDetail
