import '@/styles/study-detail/members-modal.css'
import Image from 'next/image'
import { useRef } from 'react'

import Icons from '@/components/icons'

import useFocusTrap from '../../hooks/useFocusTrap'
import useKeyEvent from '../../hooks/useKeyEvent'
import useScrollLock from '../../hooks/useScrollLock'

interface Props {
  setOpenModal: (value: React.SetStateAction<boolean>) => void
  openModal: boolean
}

function MembersListModal({ setOpenModal, openModal }: Props) {
  const memberModalRef = useRef<HTMLDivElement | null>(null)

  useScrollLock(openModal, 'member-list-modal-container')
  useFocusTrap(memberModalRef, openModal)
  useKeyEvent(
    'Escape',
    () => {
      setOpenModal(false)
    },
    openModal
  )

  return (
    <div
      className="member-list-modal-container"
      ref={memberModalRef}
      onClick={() => setOpenModal((prev) => !prev)}
    >
      <div
        className="member-list-modal-wrapper"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-scroll" tabIndex={0}>
          <h2 className="member-list-heading">모임장</h2>
          <div className="member-list-owner">
            <div className="owner-image">
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
            <div className="member-info">
              <p className="info-name">이름</p>
              <p className="info-bio">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
                consequuntur dignissimos tempora eius quia dolores voluptate
                porro debitis tenetur culpa ipsa facilis fuga, ut commodi rerum
                error magni fugiat natus.
              </p>
            </div>
          </div>
          <div>
            <h2 className="member-list-heading">멤버</h2>
            <ul className="member-lists">
              <li className="member-list-wrapper">
                <Image
                  src={'/images/no-image.png'}
                  alt="no-image"
                  width={80}
                  height={80}
                />
                <div className="member-info">
                  <p className="info-name">이름</p>
                  <p className="info-bio">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Ipsam consequuntur dignissimos tempora eius quia dolores
                    voluptate porro debitis tenetur culpa ipsa facilis fuga, ut
                    commodi rerum error magni fugiat natus.
                  </p>
                </div>
              </li>

              <li className="member-list-wrapper">
                <Image
                  src={'/images/no-image.png'}
                  alt="no-image"
                  width={80}
                  height={80}
                />
                <div className="member-info">
                  <p className="info-name">이름</p>
                  <p className="info-bio">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Ipsam consequuntur dignissimos tempora eius quia dolores
                    voluptate porro debitis tenetur culpa ipsa facilis fuga, ut
                    commodi rerum error magni fugiat natus.
                  </p>
                </div>
              </li>
              <li className="member-list-wrapper">
                <Image
                  src={'/images/no-image.png'}
                  alt="no-image"
                  width={80}
                  height={80}
                />
                <div className="member-info">
                  <p className="info-name">이름</p>
                  <p className="info-bio">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Ipsam consequuntur dignissimos tempora eius quia dolores
                    voluptate porro debitis tenetur culpa ipsa facilis fuga, ut
                    commodi rerum error magni fugiat natus.
                  </p>
                </div>
              </li>
              <li className="member-list-wrapper">
                <Image
                  src={'/images/no-image.png'}
                  alt="no-image"
                  width={80}
                  height={80}
                />
                <div className="member-info">
                  <p className="info-name">이름</p>
                  <p className="info-bio">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Ipsam consequuntur dignissimos tempora eius quia dolores
                    voluptate porro debitis tenetur culpa ipsa facilis fuga, ut
                    commodi rerum error magni fugiat natus.
                  </p>
                </div>
              </li>
              <li className="member-list-wrapper">
                <Image
                  src={'/images/no-image.png'}
                  alt="no-image"
                  width={80}
                  height={80}
                />
                <div className="member-info">
                  <p className="info-name">이름</p>
                  <p className="info-bio">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Ipsam consequuntur dignissimos tempora eius quia dolores
                    voluptate porro debitis tenetur culpa ipsa facilis fuga, ut
                    commodi rerum error magni fugiat natus.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MembersListModal
