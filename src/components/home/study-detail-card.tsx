'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useTransition } from 'react'

import Icons from '@/components/icons'
import CategoryUI from '@/components/ui/category-ui'
import { useAuth } from '@/hooks/useAuth'
import type { StudyRoom } from '@/libs/supabase'
import { setBookMarkStudyRoom } from '@/libs/supabase/api/user'

interface Props {
  studyData: StudyRoom[]
}

function StudyDetailCard({ studyData }: Props) {
  const { user } = useAuth()
  const [isPending, startTransition] = useTransition()
  const [isBookmark, setIsBookmark] = useState(false)

  const bookmarkHandler = (studyId: string) => {
    if (!user) return alert('로그인이 필요합니다.')

    const bookmarkState = !isBookmark

    setIsBookmark(bookmarkState)

    startTransition(async () => {
      try {
        await setBookMarkStudyRoom(studyId, user.id)
        alert('즐겨찾기에 추가 되었습니다.!')
      } catch (error) {
        setIsBookmark((prev) => !prev)
        alert(`즐겨찾기 추가 실패 : ${error.message}`)
      }
    })
  }

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
                <button
                  type="button"
                  disabled={isPending}
                  className="study-bookmark-btn"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    bookmarkHandler(item.id)
                  }}
                >
                  <Icons
                    name={isBookmark ? 'star-yellow-fill' : 'star'}
                    aria-hidden="true"
                    width={24}
                    height={24}
                  />
                </button>
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
