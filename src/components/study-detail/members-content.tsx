import '@/styles/study-detail/members-modal.css'

import Image from 'next/image'

import Icons from '@/components/icons'
import type { Profile } from '@/libs/supabase'

interface Props {
  isOwner: boolean
  ownerProfile: Profile
}

function MembersContent({ isOwner, ownerProfile }: Props) {
  return (
    <>
      <h2 className="member-list-heading">모임장</h2>
      <div className="member-list-owner">
        <div className="owner-image">
          <Image
            src={ownerProfile.profile_url ?? '/images/no-image.png'}
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
          <span className="info-name">{ownerProfile.nickname}</span>
          <p className="info-bio">
            {ownerProfile.bio ?? '자기소개 글이 없습니다..'}
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
              <div className="info-wrapper">
                <span className="info-name">이름</span>
                {isOwner && (
                  <div className="request-button-group">
                    <button className="rejected-btn">추방</button>
                  </div>
                )}
              </div>
              <p className="info-bio">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
                consequuntur dignissimos tempora eius quia dolores voluptate
                porro debitis tenetur culpa ipsa facilis fuga, ut commodi rerum
                error magni fugiat natus.
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
              <div className="info-wrapper">
                <span className="info-name">이름</span>
                {isOwner && (
                  <div className="request-button-group">
                    <button className="rejected-btn">추방</button>
                  </div>
                )}
              </div>
              <p className="info-bio">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
                consequuntur dignissimos tempora eius quia dolores voluptate
                porro debitis tenetur culpa ipsa facilis fuga, ut commodi rerum
                error magni fugiat natus.
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
              <div className="info-wrapper">
                <span className="info-name">이름</span>
                {isOwner && (
                  <div className="request-button-group">
                    <button className="rejected-btn">추방</button>
                  </div>
                )}
              </div>
              <p className="info-bio">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
                consequuntur dignissimos tempora eius quia dolores voluptate
                porro debitis tenetur culpa ipsa facilis fuga, ut commodi rerum
                error magni fugiat natus.
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
              <div className="info-wrapper">
                <span className="info-name">이름</span>
                {isOwner && (
                  <div className="request-button-group">
                    <button className="rejected-btn">추방</button>
                  </div>
                )}
              </div>
              <p className="info-bio">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
                consequuntur dignissimos tempora eius quia dolores voluptate
                porro debitis tenetur culpa ipsa facilis fuga, ut commodi rerum
                error magni fugiat natus.
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
              <div className="info-wrapper">
                <span className="info-name">이름</span>
                {isOwner && (
                  <div className="request-button-group">
                    <button className="rejected-btn">추방</button>
                  </div>
                )}
              </div>
              <p className="info-bio">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
                consequuntur dignissimos tempora eius quia dolores voluptate
                porro debitis tenetur culpa ipsa facilis fuga, ut commodi rerum
                error magni fugiat natus.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </>
  )
}

export default MembersContent
