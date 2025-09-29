StudyHub – 스터디 모집 플랫폼

1. 프로젝트 개요
   1.1 주제

스터디 모집 플랫폼 (지역 기반 추천 & 소셜 확장)

1.2 프로젝트 배경

스터디/소모임을 만들고 싶어도 정보 부족과 참여 방식의 불편함 존재

기존 모집은 오픈채팅 등 체계적이지 못한 채널 의존 → 관리·지속성 부족

지역 기반 정보(장소, 주변 맛집/카페) 제공이 부족

1.3 서비스 목표

효율적인 스터디 모집과 지역 커뮤니티 활성화

단순 모집/참가를 넘어 지속적 교류·라이프스타일 확장

직관적 UX로 접근성 강화

스터디 모집 + 지역 정보 제공으로 소셜 활동 연결

1.4 주요 기능

스터디

생성 (제목, 소개, 인원, 지역, 카테고리)

검색·필터 (지역, 주제, 인원, 상태 등)

참가 신청/승인

실시간 채팅방

지역 정보

카카오 지도 API
연동 → 장소 등록/지도 표시

주변 맛집·카페 추천 + 별점/리뷰

레시피·활동 공유 (스터디 후 활동 확장)

사용자 경험

회원가입/소셜 로그인 (구글, 카카오 → Supabase)

프로필 관리

북마크/찜하기 (후순위)

알림 기능 (모집/승인/거절 등)

1.5 기대 효과

흩어진 모집 채널을 한 곳에서 효율적 관리 가능

지역 기반 추천 → 스터디 후 자연스럽게 소셜 활동 확장

사용자 간 신뢰 높은 커뮤니티 형성

2. 협업 방식

커뮤니케이션: Discord, Notion

데일리 미팅: 매일 오전 9시 10분

회의 기록: Notion에 정리

개인 일정/비상 연락: 카카오톡 오픈채팅방

3. 기술 스택

언어: TypeScript

프레임워크: Next.js v15 (App Router)

상태 관리

서버 상태(데이터 패칭): SWR

클라이언트 상태: React Context

- useReducer

배포: Vercel

BaaS: Supabase

4. 컨벤션
   4.1 Git

Commit 타입: init, feat, remove, fix, docs, style, refactor, test, ci, chore

브랜치 네이밍: feature/기능/성 (예: feature/login/jo)

정책:

main: 배포

develop: 개발 통합

PR 머지 후 브랜치 삭제

4.2 HTML

들여쓰기: 공백 2칸

인라인 요소 안 블록 요소 금지

클래스명: kebab-case

4.3 CSS

클래스명: kebab-case

속성 끝 세미콜론 필수

컬러: hex 코드

단위: rem

변수: theme.css 활용 (다크/라이트, 반응형)

전략: 모바일 퍼스트

4.4 JavaScript/TypeScript

컴포넌트 함수: PascalCase

일반 함수/변수: camelCase

상수: UPPER_SNAKE_CASE

4.5 디렉터리 구조
src
├── components
│ ├── page-name # 페이지 컴포넌트
│ └── ui # 공통 UI 단위
│
├── utils # 유틸 함수
├── fonts # 폰트 파일
├── styles
│ ├── common # 공통 스타일
│ └── page-name # 페이지별 스타일
├── app
│ ├── api
│ │ └── api-name # API 라우트
│ └── page-name # 페이지

5. CSS 변수 (theme.css)
   :root {
   /_ text color _/
   --color-text-primary: #1a1a1a;
   --color-text-secondary: #888888;

/_ background _/
--color-bg-primary: #ffffff;
--color-bg-secondary: #f8f8f8;

/_ border _/
--color-border: #cccccc;

/_ brand _/
--color-primary: #48a0f8;
--color-secondary: #2a8ae2;
--color-tertiary: #1b70bb;

/_ font size _/
--font-xs: 0.75rem;
--font-sm: 0.875rem;
--font-md: 1rem;
--font-lg: 1.25rem;
--font-xl: 1.625rem;
--font-2xl: 1.875rem;
--font-3xl: 2.5rem;

/_ spacing _/
--space-xs: 0.25rem;
--space-s: 0.5rem;
--space-sm: 0.75rem;
--space-ms: 1.125rem;
--space-md: 1.375rem;
--space-ml: 1.5rem;
--space-lg: 2rem;
--space-xl: 2.5rem;
--space-2xl: 3.5rem;
--space-3xl: 4rem;
--space-4xl: 5rem;
--space-5xl: 6rem;
--space-6xl: 8rem;
--space-7xl: 10rem;

/_ radius _/
--radius-xs: 0.75rem;
--radius-s: 1rem;
--radius-sm: 1.25rem;
--radius-md: 1.5rem;
--radius-lg: 2rem;
--radius-xl: 4rem;
--radius-full: 624.9375rem;
}

Breakpoints

모바일: ≤ 767px

태블릿: ≥ 768px

데스크탑: ≥ 1024px
