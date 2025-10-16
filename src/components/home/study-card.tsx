'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import Icons from '@/components/icons'
import CategoryUI from '@/components/ui/category-ui'
import { useBookMark } from '@/hooks/useBookmark'
import type { StudyRoom } from '@/libs/supabase'

import { useLikes } from '../../hooks/useLikes'

interface Props {
  item: StudyRoom
  userId: string | null | undefined
}

function StudyCard({ item, userId }: Props) {
  const { bookmarkHandler, isRoomBookmarked } = useBookMark()
  const { likesHandler, isRoomLiked } = useLikes()
  const [isDisabled, setIsDisabled] = useState(false)

  const isBookmark = isRoomBookmarked(item.id)
  const isLikes = isRoomLiked(item.id)

  const bookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!userId) {
      alert('로그인이 필요합니다.')
      return
    }
    setIsDisabled(true)

    await bookmarkHandler(item.id, userId)

    setIsDisabled(false)
  }

  const likesToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!userId) {
      alert('로그인이 필요합니다.')
      return
    }
    setIsDisabled(true)

    await likesHandler(item.id, userId)

    setIsDisabled(false)
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
              disabled={isDisabled}
              className="study-bookmark-btn"
              onClick={likesToggle}
            >
              <Icons
                name={isLikes ? 'heart-fill' : 'heart'}
                aria-hidden="true"
                width={32}
                height={32}
              />
            </button>
            <button
              type="button"
              disabled={isDisabled}
              className="study-bookmark-btn"
              onClick={bookmarkToggle}
            >
              <Icons
                name={isBookmark ? 'star-yellow-fill' : 'star'}
                aria-hidden="true"
                width={32}
                height={32}
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
