import Image from 'next/image'
import Link from 'next/link'

import type { StudyRoom } from '@/libs/supabase'

interface Props {
  studyData: StudyRoom[]
}

function StudyRoomCard({ studyData }: Props) {
  return (
    <ul className="latest-lists">
      {studyData.map((item) => (
        <li className="latest-lists-item" key={item.id}>
          <Link href={`/study-detail/${item.id}`}>
            <div className="image-wrapper">
              <Image
                src={item.banner_image ?? '/images/no-image.png'}
                alt={`${item.title} 배너 이미지`}
                fill
                className="studybanner-img"
                aria-hidden="true"
                sizes="(max-width: 768px) 165px, (max-width: 1023px) 200px, 250px"
                priority
                unoptimized={
                  item.banner_image?.toLowerCase().endsWith('.gif')
                    ? true
                    : undefined
                }
              />
            </div>
            <h3 title={item.title}>{item.title}</h3>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default StudyRoomCard
