import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

import SiteFooter from '@/components/footer/footer'
import Header from '@/components/header'
import FloatingButton from '@/components/ui/floating-button'
import { AuthProvider } from '@/context/autnContext'
import { BookMarkProvider } from '@/context/bookmarkContext'
import { LikesProvider } from '@/context/likesContext'
import { createClient } from '@/libs/supabase/server'

import '@/styles/common/index.css'

// --------------------------------------------------------------------------
// 메타데이터

export const metadata: Metadata = {
  title: '멋사 14기 파이널 프로젝트 팀3',
  description: '멋사 14기 파이널 프로젝트 팀3',
  icons: { icon: '/images/moida-icon.svg' },
}

// --------------------------------------------------------------------------
// 루트 레이아웃 컴포넌트

export default async function RootLayout({ children }: PropsWithChildren) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html lang="ko-KR">
      <body>
        <AuthProvider user={user}>
          <LikesProvider>
            <BookMarkProvider>
              <Header />
              <main className="web-main">{children}</main>
              <SiteFooter />
              <FloatingButton />
            </BookMarkProvider>
          </LikesProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
