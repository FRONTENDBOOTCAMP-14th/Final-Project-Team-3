'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

import Icons from '@/components/icons'
import CategoryUI from '@/components/ui/category-ui'
import { useBookMark } from '@/hooks/useBookmark'
import { useLikes } from '@/hooks/useLikes'
import type { StudyRoom } from '@/libs/supabase'

import DeleteConfirmModal from '../ProfilePageClient/modals/delete-confirm-modal'

interface Props {
  item: StudyRoom
  userId: string | null | undefined
  isPriority?: boolean
  type?: 'MYSTUDY'
}

function StudyCard({ item, userId, isPriority, type }: Props) {
  const pathName = usePathname()
  const isProfilePage = pathName.split('/')[1] === 'my-profile'
  const { bookmarkHandler, isRoomBookmarked } = useBookMark()
  const { likesHandler, isRoomLiked } = useLikes()
  const [isDisabled, setIsDisabled] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  const isBookmark = isRoomBookmarked(item.id)
  const isLikes = isRoomLiked(item.id)

  const bookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!userId) {
      toast.error('로그인이 필요 합니다.', {
        action: {
          label: '닫기',
          onClick: () => {},
        },
      })
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
      toast.error('로그인이 필요 합니다.', {
        action: {
          label: '닫기',
          onClick: () => {},
        },
      })
      return
    }
    setIsDisabled(true)

    await likesHandler(item.id, userId)

    setIsDisabled(false)
  }

  const isGif = ['.gif', '_gif'].some((gif) =>
    item.banner_image?.toLowerCase().endsWith(gif)
  )

  return (
    <>
      <li className="region-study-lists-item" key={item.id}>
        {isProfilePage && type && (
          <button
            className="study-card-delete-modal"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDeleteModal(true)
            }}
          >
            버튼
          </button>
        )}
        <Link href={`/study-detail/${item.id}`}>
          <div className="image-wrapper">
            <Image
              src={item.banner_image ?? '/images/no-image.png'}
              alt={`${item.title} 배너 이미지`}
              fill
              className="studybanner-img"
              aria-hidden="true"
              sizes="(max-width: 768px) 100vw, (max-width: 1023px) 450px, 430px"
              priority={isPriority}
              unoptimized={isGif ?? undefined}
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
            <CategoryUI studyId={item.id} />
          </div>
        </Link>
      </li>
      {deleteModal && (
        <DeleteConfirmModal
          setDeleteModal={setDeleteModal}
          studyId={item.id}
          ownerId={item.owner_id}
        />
      )}
    </>
  )
}

export default StudyCard
