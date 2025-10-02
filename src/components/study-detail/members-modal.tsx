import '@/styles/study-detail/members-modal.css'
import Image from 'next/image'

import Icons from '@/components/icons'

function MembersListModal() {
  return (
    <div className="member-list-modal-container">
      <div className="member-list-modal-wrapper">
        <div className="modal-scroll">
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
