import Image from 'next/image'

import type { StudyRoom } from '@/libs/supabase'

import EditButton from './edit-button'

interface Props {
  studyRoomData: StudyRoom
  isOwner: boolean
}

function BannerSection({ studyRoomData, isOwner }: Props) {
  const isGif = studyRoomData.banner_image?.toLowerCase().endsWith('.gif')

  return (
    <section className="detail-banner">
      {isOwner && <EditButton studyId={studyRoomData.id} />}
      <Image
        src={studyRoomData.banner_image ?? '/images/no-image.png'}
        alt={''}
        fill
        className="studybanner-img"
        priority
        sizes="100vw"
        quality={75}
        unoptimized={isGif ?? undefined}
      />
    </section>
  )
}

export default BannerSection
