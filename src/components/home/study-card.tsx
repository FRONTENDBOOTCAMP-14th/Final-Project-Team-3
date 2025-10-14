'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useTransition } from 'react'

import Icons from '@/components/icons'
import CategoryUI from '@/components/ui/category-ui'
import type { StudyRoom } from '@/libs/supabase'
import {
  removeBookMarkStudyRoom,
  setBookMarkStudyRoom,
} from '@/libs/supabase/api/user'

interface Props {
  item: StudyRoom
  initialIsBookmarked: boolean
  userId: string | null | undefined
}

function StudyCard({ item, initialIsBookmarked, userId }: Props) {
  const [isPending, startTransition] = useTransition()
  const [isBookmark, setIsBookmark] = useState(initialIsBookmarked)

  useEffect(() => {
    setIsBookmark(initialIsBookmarked)
  }, [initialIsBookmarked])

  const bookmarkHandler = (studyId: string) => {
    if (!userId) return alert('로그인이 필요합니다.')

    setIsBookmark((prev) => !prev)

    startTransition(async () => {
      try {
        if (!isBookmark) {
          await setBookMarkStudyRoom(studyId, userId)
          alert('즐겨찾기에 추가 되었습니다.!')
        } else {
          await removeBookMarkStudyRoom(studyId, userId)
          alert('즐겨찾기에서 삭제 되었습니다.!')
        }
      } catch (error) {
        setIsBookmark((prev) => !prev)
        alert(`즐겨찾기 추가 실패 : ${error.message}`)
      }
    })
  }

  return (
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
  )
}

export default StudyCard
