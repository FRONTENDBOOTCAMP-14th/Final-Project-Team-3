import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

import SiteFooter from '@/components/footer/footer'
import Header from '@/components/header'

import '@/styles/common/index.css'
import { AuthProvider } from '../context/autnContext'
// --------------------------------------------------------------------------
// 메타데이터

export const metadata: Metadata = {
  title: '멋사 14기 파이널 프로젝트 팀3',
  description: '멋사 14기 파이널 프로젝트 팀3',
  icons: { icon: '/images/moida-icon.svg' },
}

// --------------------------------------------------------------------------
// 루트 레이아웃 컴포넌트

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ko-KR">
      <body>
        <AuthProvider>
          <Header />
          <main className="web-main">{children}</main>
          <SiteFooter />
        </AuthProvider>
      </body>
    </html>
  )
}
