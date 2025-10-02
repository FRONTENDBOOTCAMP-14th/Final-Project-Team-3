import Image from 'next/image'
import Link from 'next/link'

import Icons from '../icons'
import CategoryUI from '../ui/category-ui'

function StudyDetailCard() {
  const mockData = Array.from({ length: 11 }, (_, i) => ({
    id: i + 100,
  }))
  return (
    <ul className="region-study-lists">
      {mockData.map((item) => (
        <li className="region-study-lists-item" key={item.id}>
          <Link href={`/study-detail/${item.id}`}>
            <div className="image-wrapper">
              <Image
                src={'/images/no-image.png'}
                alt="no-image"
                fill
                className="studybanner-img"
                aria-hidden="true"
              />
            </div>
            <div className="description-wrapper">
              <h3>
                <span>스터디 제목</span>
                <span>
                  <Icons
                    name="star"
                    aria-hidden="true"
                    width={24}
                    height={24}
                  />
                </span>
              </h3>
              <p>내용</p>
              <CategoryUI />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default StudyDetailCard
