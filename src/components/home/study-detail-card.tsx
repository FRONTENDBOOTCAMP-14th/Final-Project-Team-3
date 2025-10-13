import Image from 'next/image'
import Link from 'next/link'

import type { StudyRoom } from '../../libs/supabase'
import Icons from '../icons'
import CategoryUI from '../ui/category-ui'

interface Props {
  studyData: StudyRoom[]
}

function StudyDetailCard({ studyData }: Props) {
  // const mockData = Array.from({ length: 11 }, (_, i) => ({
  //   id: i + 100,
  // }))
  return (
    <ul className="region-study-lists">
      {studyData.map((item) => (
        <li className="region-study-lists-item" key={item.id}>
          <Link href={`/study-detail/${item.id}`}>
            <div className="image-wrapper">
              <Image
                src={item.banner_image ?? '/images/no-image.png'}
                alt={`${item.title} 배너 이미지`}
                fill
                className="studybanner-img"
                aria-hidden="true"
              />
            </div>
            <div className="description-wrapper">
              <h3>
                <span>{item.title}</span>
                <span>
                  <Icons
                    name="star"
                    aria-hidden="true"
                    width={24}
                    height={24}
                  />
                </span>
              </h3>
              <p>{item.description}</p>
              <CategoryUI studyData={item} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default StudyDetailCard
