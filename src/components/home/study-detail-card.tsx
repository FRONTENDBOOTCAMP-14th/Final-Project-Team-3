import Image from 'next/image'
import Link from 'next/link'

import Icons from '../icons'

function StudyDetailCard() {
  const mockData = Array.from({ length: 11 }, (_, i) => ({
    id: i + 1,
  }))
  return (
    <ul className="region-study-lists">
      {mockData.map((item) => (
        <li className="region-study-lists-item" key={item.id}>
          <Link href={'/'}>
            <div className="image-wrapper">
              <Image
                src={'/images/no-image.png'}
                alt="no-image"
                fill
                className="studybanner-img"
                aria-hidden="true"
              />
            </div>
            <h3>
              <span>스터디 제목</span>
              <span>
                <Icons name="star" aria-hidden="true" width={24} height={24} />
              </span>
            </h3>
            <p>내용</p>
            <div role="group" className="etc-description">
              <p>
                <Icons name="category" aria-hidden="true" />
                <span>카테고리</span>
              </p>
              <p>
                <Icons name="map-pin" aria-hidden="true" />
                <span>지역</span>
              </p>
              <p>
                <Icons name="user" aria-hidden="true" />
                <span>인원 수</span>
              </p>
              <p>
                <Icons name="heart" aria-hidden="true" />
                <span>좋아요 수</span>
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default StudyDetailCard
