import '@/styles/study-detail/comment.css'
import Image from 'next/image'

const text =
  'AI 코딩 도구를 활용하면 코드 생성 및 자동화, 개발 워크플로우와의통합 등이 가능하며 기존 개발 환경 대비 생산성을 높일 수 있습니다.그러나 개발자를 꿈꾸며 학습을하는 예비 개발자에게 AI 코딩 도구는양날의 검이 될 수 있습니다. AI 코딩 도구에만 의존하는 주니어개발자는 경쟁력을 갖출 수 없기 때문입니다. 오히려 더 깊이 있게언어를 학습하고 좋은 질문을 할 수 있도록 문해력(Literacy)을 기르는것이 필요합니다. 다만 AI 도구를 완전히 배제하는 것이 아닌 학습을위한 파트너로서 활용할 것을 추천합니다. AI 코딩 도구를 활용하면코드 생성 및 자동화, 개발 워크플로우와의 통합 등이 가능하며 기존개발 환경 대비'

function CommentLists() {
  return (
    <div className="comment-lists-wrapper">
      <ul className="comment-lists">
        <li className="comment-list-item">
          <div className="comment-lists-user">
            <Image
              src={'/images/default-avatar.png'}
              alt="유저 이미지"
              width={60}
              height={60}
            />
          </div>
          <div className="comment-info">
            <span>유저 이름</span>
            <p className="">
              AI 코딩 도구를 활용하면 코드 생성 및 자동화, 개발 워크플로우와의
              통합 등이 가능하며 기존 개발 환경 대비 생산성을 높일 수 있습니다.
              그러나 개발자를 꿈꾸며 학습을하는 예비 개발자에게 AI 코딩 도구는
              양날의 검이 될 수 있습니다. AI 코딩 도구에만 의존하는 주니어
              개발자는 경쟁력을 갖출 수 없기 때문입니다. 오히려 더 깊이 있게
              언어를 학습하고 좋은 질문을 할 수 있도록 문해력(Literacy)을 기르는
              것이 필요합니다. 다만 AI 도구를 완전히 배제하는 것이 아닌 학습을
              위한 파트너로서 활용할 것을 추천합니다. AI 코딩 도구를 활용하면
              코드 생성 및 자동화, 개발 워크플로우와의 통합 등이 가능하며 기존
              개발 환경 대비 생산성을 높일 수 있습니다. 그러나 개발자를 꿈꾸며
              학습을하는 예비 개발자에게 AI 코딩 도구는 양날의 검이 될 수
              있습니다. AI 코딩 도구에만 의존하는 주니어 개발자는 경쟁력을 갖출
              수 없기 때문입니다. 오히려 더 깊이 있게 언어를 학습하고 좋은
              질문을 할 수 있도록 문해력(Literacy)을 기르는 것이 필요합니다.
              다만 AI 도구를 완전히 배제하는 것이 아닌 학습을 위한 파트너로서
              활용할 것을 추천합니다.
            </p>
            <button className="comment-more">더보기</button>
          </div>
        </li>

        <li className="comment-list-item">
          <div className="comment-lists-user">
            <Image
              src={'/images/default-avatar.png'}
              alt="유저 이미지"
              width={60}
              height={60}
            />
          </div>
          <div className="comment-info">
            <span>유저 이름</span>
            <p className="">
              AI 코딩 도구를 활용하면 코드 생성 및 자동화, 개발 워크플로우와의
              통합 등이 가능하며 기존 개발 환경 대비 생산성을 높일 수 있습니다.
              그러나 개발자를 꿈꾸며 학습을하는 예비 개발자에게 AI 코딩 도구는
              양날의 검이 될 수 있습니다. AI 코딩 도구에만 의존하는 주니어
              개발자는 경쟁력을 갖출 수 없기 때문입니다. 오히려 더 깊이 있게
              언어를 학습하고 좋은 질문을 할 수 있도록 문해력(Literacy)을 기르는
              것이 필요합니다. 다만 AI 도구를 완전히 배제하는 것이 아닌 학습을
              위한 파트너로서 활용할 것을 추천합니다. AI 코딩 도구를 활용하면
              코드 생성 및 자동화, 개발 워크플로우와의 통합 등이 가능하며 기존
              개발 환경 대비 생산성을 높일 수 있습니다. 그러나 개발자를 꿈꾸며
              학습을하는 예비 개발자에게 AI 코딩 도구는 양날의 검이 될 수
              있습니다. AI 코딩 도구에만 의존하는 주니어 개발자는 경쟁력을 갖출
              수 없기 때문입니다. 오히려 더 깊이 있게 언어를 학습하고 좋은
              질문을 할 수 있도록 문해력(Literacy)을 기르는 것이 필요합니다.
              다만 AI 도구를 완전히 배제하는 것이 아닌 학습을 위한 파트너로서
              활용할 것을 추천합니다.
            </p>
            <button className="comment-more">더보기</button>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default CommentLists
