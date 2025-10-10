'use client'
import Image from 'next/image'
import { useState } from 'react'

import Icons from '@/components/icons'
import CategoryUI from '@/components/ui/category-ui'

import '@/styles/study-detail/study-detail.css'
import type { StudyRoom } from '../../libs/supabase'

import MembersListModal from './members-modal'

interface Props {
  studyRoomData: StudyRoom
}

function StudyDetail({ studyRoomData }: Props) {
  const [openModal, setOpenModal] = useState<boolean>(false)

  return (
    <div className="detail-container">
      <div className="detail-banner">
        {studyRoomData.banner_image ? (
          <Image
            src={studyRoomData.banner_image}
            alt={`${studyRoomData.title} 이미지`}
            fill
            className="studybanner-img"
            aria-hidden="true"
            priority
          />
        ) : (
          <Image
            src={'/images/no-image.png'}
            alt="no-image"
            fill
            className="studybanner-img"
            aria-hidden="true"
            priority
          />
        )}
      </div>

      <div className="detail-header">
        <div className="detail-description">
          <h3>{studyRoomData.title}</h3>
          <CategoryUI studyData={studyRoomData} />
        </div>

        <div className="detail-contents">
          <p>{studyRoomData.description}</p>
        </div>

        <div className="study-members">
          <h3 className="study-members-heading">
            <span>멤버</span>
            <button type="button" onClick={() => setOpenModal(true)}>
              전체 보기 ↓
            </button>
          </h3>
          <div className="owner-member">
            <div className="owner-member-wrapper">
              <Image
                src={'/images/no-image.png'}
                alt="no-image"
                width={80}
                height={80}
              />
              <Icons
                className="owner-icon"
                name="star-blue-fill"
                width={24}
                height={24}
              />
            </div>
          </div>
          <ul className="member-image-wrapper">
            <li className="member-image">
              <Image
                src={'/images/no-image.png'}
                alt="no-image"
                width={80}
                height={80}
              />
            </li>

            <li className="member-image">
              <Image
                src={'/images/no-image.png'}
                alt="no-image"
                width={80}
                height={80}
              />
            </li>
            <li className="member-image">
              <Image
                src={'/images/no-image.png'}
                alt="no-image"
                width={80}
                height={80}
              />
            </li>
            <li className="member-image">
              <Image
                src={'/images/no-image.png'}
                alt="no-image"
                width={80}
                height={80}
              />
            </li>
          </ul>
        </div>
      </div>
      {openModal && (
        <MembersListModal setOpenModal={setOpenModal} openModal={openModal} />
      )}
    </div>
  )
}

export default StudyDetail
