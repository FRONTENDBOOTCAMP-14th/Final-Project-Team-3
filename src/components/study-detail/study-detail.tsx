'use client'
import Image from 'next/image'
import { useState } from 'react'

import Icons from '@/components/icons'
import CategoryUI from '@/components/ui/category-ui'

import '@/styles/study-detail/study-detail.css'
import MembersListModal from './members-modal'

interface Props {
  studyId: string
}

function StudyDetail({ studyId }: Props) {
  const [openModal, setOpenModal] = useState<boolean>(false)

  return (
    <div className="detail-container">
      <div className="detail-banner">
        <Image
          src={'/images/no-image.png'}
          alt="no-image"
          fill
          className="studybanner-img"
          aria-hidden="true"
          priority
        />
      </div>

      <div className="detail-header">
        {/* <div className="detail-header-img">
          <Image
            src={'/images/no-image.png'}
            alt="no-image"
            width={120}
            height={120}
            className="studybanner-img"
            aria-hidden="true"
          />
        </div> */}
        <div className="detail-description">
          <h3>스터디 타이틀</h3>
          <CategoryUI />
        </div>

        <div className="detail-contents">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet
            perspiciatis dolorum excepturi vero maiores ex, ea eum itaque natus
            sit quod exercitationem minima expedita voluptates. Molestiae iusto
            officia explicabo eligendi. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Eveniet perspiciatis dolorum excepturi vero
            maiores ex, ea eum itaque natus sit quod exercitationem minima
            expedita voluptates. Molestiae iusto officia explicabo eligendi.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet
            perspiciatis dolorum excepturi vero maiores ex, ea eum itaque natus
            sit quod exercitationem minima expedita voluptates. Molestiae iusto
            officia explicabo eligendi. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Eveniet perspiciatis dolorum excepturi vero
            maiores ex, ea eum itaque natus sit quod exercitationem minima
            expedita voluptates. Molestiae iusto officia explicabo eligendi.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet
            perspiciatis dolorum excepturi vero maiores ex, ea eum itaque natus
            sit quod exercitationem minima expedita voluptates. Molestiae iusto
            officia explicabo eligendi.
          </p>
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
                width={100}
                height={100}
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
      {openModal && <MembersListModal />}
    </div>
  )
}

export default StudyDetail
