import '@/styles/study-detail/members-modal.css'
import Image from 'next/image'

function ApplicantContent() {
  return (
    <div>
      <h2 className="member-list-heading">신청 멤버</h2>
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
              <div className="request-button-group">
                <button className="rejected-btn">거절</button>
                <button className="approved-btn">승인</button>
              </div>
            </div>
            <p className="info-bio">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
              consequuntur dignissimos tempora eius quia dolores voluptate porro
              debitis tenetur culpa ipsa facilis fuga, ut commodi rerum error
              magni fugiat natus.
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
              <div className="request-button-group">
                <button className="rejected-btn">거절</button>
                <button className="approved-btn">승인</button>
              </div>
            </div>
            <p className="info-bio">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
              consequuntur dignissimos tempora eius quia dolores voluptate porro
              debitis tenetur culpa ipsa facilis fuga, ut commodi rerum error
              magni fugiat natus.
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
              <div className="request-button-group">
                <button className="rejected-btn">거절</button>
                <button className="approved-btn">승인</button>
              </div>
            </div>
            <p className="info-bio">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
              consequuntur dignissimos tempora eius quia dolores voluptate porro
              debitis tenetur culpa ipsa facilis fuga, ut commodi rerum error
              magni fugiat natus.
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
              <div className="request-button-group">
                <button className="rejected-btn">거절</button>
                <button className="approved-btn">승인</button>
              </div>
            </div>
            <p className="info-bio">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
              consequuntur dignissimos tempora eius quia dolores voluptate porro
              debitis tenetur culpa ipsa facilis fuga, ut commodi rerum error
              magni fugiat natus.
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
              <div className="request-button-group">
                <button className="rejected-btn">거절</button>
                <button className="approved-btn">승인</button>
              </div>
            </div>
            <p className="info-bio">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
              consequuntur dignissimos tempora eius quia dolores voluptate porro
              debitis tenetur culpa ipsa facilis fuga, ut commodi rerum error
              magni fugiat natus.
            </p>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default ApplicantContent
