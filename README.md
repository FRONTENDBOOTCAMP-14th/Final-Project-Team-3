# 🧩 파이널 프로젝트 – 3시세끼조

**📚 모이다(MOIDA)** – 지역 기반 스터디 & 모집 플랫폼

---

## 1️⃣ 프로젝트 소개

### 🗂 주제

지역을 기반으로 한 스터디 & 모집 플랫폼

### 🧭 배경

- 스터디/소모임을 만들고 싶어도 **정보 부족과 참여 방식의 불편함** 존재
- 기존 모집은 오픈채팅 등 **체계적이지 못한 채널** 의존 → 관리·지속성 부족

### 🎯 서비스 목표

- 효율적인 스터디 모집과 지역 커뮤니티 활성화
- 단순 모집/참가를 넘어 **지속적 교류·라이프스타일 확장**
- **직관적 UX**로 접근성 강화

---

## 2️⃣ 주요 기능

### ✳️ 스터디

- 생성 (제목, 소개, 인원, 지역, 카테고리)
- 검색/필터 (지역, 주제, 인원, 상태 등)
- 참가 신청/승인
- 실시간 채팅방

### 👤 사용자 경험

- 회원가입/소셜 로그인 (Google, Kakao → Supabase)
- 프로필 관리
- 북마크/찜하기

### 💡 기대 효과

- 흩어진 모집 채널을 한 곳에서 **효율적 관리**
- 지역 기반 추천으로 **스터디 이후 자연스러운 소셜 활동 확장**
- 사용자 간 **신뢰 높은 커뮤니티 형성**

---

## 3️⃣ 기술 스택 🧰

<table>
  <thead>
    <tr>
      <th>분류</th>
      <th>기술</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>언어</strong></td>
      <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="40" alt="TypeScript" /></td>
    </tr>
    <tr>
      <td><strong>프레임워크</strong></td>
      <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="40" alt="Next.js" /></td>
    </tr>
    <tr>
      <td><strong>상태 관리</strong></td>
      <td>
          <img src="https://raw.githubusercontent.com/vercel/swr/main/docs/logo.svg" width="48" alt="SWR" />
          &nbsp;
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40" alt="React Context" />
      </td>
    </tr>
    <tr>
      <td><strong>배포</strong></td>
      <td><img src="https://api.iconify.design/simple-icons:vercel.svg" width="40" alt="Vercel" /></td>
    </tr>
    <tr>
      <td><strong>BaaS</strong></td>
       <td>
        <img src="https://raw.githubusercontent.com/supabase/supabase/master/apps/docs/public/img/supabase-logo-wordmark--light.svg" width="120" alt="Supabase" />
     </td>
    </tr>
  </tbody>
</table>

---

## 4️⃣ 실행 방법 ⚙️

```bash
# 패키지 설치
bun install
# 또는 npm i

# 개발 서버 실행
bun dev
# 또는 npm run dev
```

---

### 5️⃣ 디렉터리 구조 📁

```bash
src
├── app # 페이지 라우팅
│
├── components
│ ├── page-name # 페이지 컴포넌트
│ └── ui # 공통 UI 단위
│
├── context # 전역 상태 관리
│
├── fonts # 폰트 파일 관리
│
├── hooks  # 커스텀 훅 모음
│
├── styles
│ ├── common # 공통 스타일
│ └── page-name # 페이지별 스타일
│
├── types                # 전역 타입 정의
│   ├── apiResultsType.ts # API 응답 타입
│   ├── categories.ts     # 카테고리 타입
│   └── region.ts         # 지역 타입
│
└── utils # 유틸 함수

```

---

## 6️⃣ 팀원 소개 및 역할👥

| 이름   | 역할 | 담당 업무                                                     | GitHub                                 |
| ------ | ---- | ------------------------------------------------------------- | -------------------------------------- |
| 장영주 | 팀장 | UI 디자인, 디테일 페이지, 로딩                                | [GitHub](https://github.com/JYJ7435)   |
| 김상훈 | 조원 | UI 디자인, 에러 페이지, 로그인, 유저 정보 페이지, 기획안 발표 | [GitHub](https://github.com/ksh2998)   |
| 조선현 | 조원 | UI 디자인, 푸터, 스터디 생성 페이지, 파이널 발표              | [GitHub](https://github.com/hana12051) |

---

## 7️⃣ 배포 링크 🔗

배포주소- [모이다(Moida)](https://moida3-theta.vercel.app/)
