import Image from 'next/image'
import Link from 'next/link'

function StudyRoomCard() {
  const mockData = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `스터디 제목 ${i + 1}`,
  }))

  return (
    <ul className="latest-lists">
      {mockData.map((item) => (
        <li className="latest-lists-item" key={item.id}>
          <Link href={'/'}>
            <div className="image-wrapper">
              <Image
                src={'/images/no-image.png'}
                alt="no-image"
                fill
                className="studybanner-img"
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
