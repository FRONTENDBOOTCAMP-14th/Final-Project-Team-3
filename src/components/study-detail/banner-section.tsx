import Image from 'next/image'

import type { StudyRoom } from '@/libs/supabase'

interface Props {
  studyRoomData: StudyRoom
}

function BannerSection({ studyRoomData }: Props) {
  const isGif = studyRoomData.banner_image?.toLowerCase().endsWith('.gif')

  return (
    <section className="detail-banner">
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
