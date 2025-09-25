import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next'
import '@/styles/common/index.css'

// --------------------------------------------------------------------------
// 메타데이터

export const metadata: Metadata = {
  title: '멋사 14기 파이널 프로젝트 팀3',
  description: '멋사 14기 파이널 프로젝트 팀3',
}

// --------------------------------------------------------------------------
// 루트 레이아웃 컴포넌트

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ko-KR">
      <body>
        <header>헤더</header>
        <main>{children}</main>
      </body>
    </html>
  )
}
