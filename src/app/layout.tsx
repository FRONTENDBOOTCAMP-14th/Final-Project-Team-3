import type { Metadata } from 'next'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import { Suspense, type PropsWithChildren } from 'react'
import { Toaster } from 'sonner'

import SiteFooter from '@/components/footer/footer'
import Header from '@/components/header'
import FloatingButton from '@/components/ui/floating-button'
import { AuthProvider } from '@/context/authContext'
import { BookMarkProvider } from '@/context/bookmarkContext'
import { LikesProvider } from '@/context/likesContext'
import { createClient } from '@/libs/supabase/server'

import '@/styles/common/index.css'
import Error from './error'
import Loading from './loading'

// --------------------------------------------------------------------------
// 메타데이터

export const metadata: Metadata = {
  title: {
    template: '%s | 모이다(MOIDA)',
    default: '모이다(MOIDA) - 스터디 모집 플랫폼',
  },
  description:
    '모이다(MOIDA) 스터디 모집 플랫폼과 함께 가까운 지역, 관심 분야 등 나와 가장 잘 맞는 스터디 멤버를 꾸려 함께 성장해 보세요.',
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
        <ErrorBoundary errorComponent={Error}>
          <Suspense fallback={<Loading />}>
            <AuthProvider user={user}>
              <LikesProvider>
                <BookMarkProvider>
                  <Header />
                  <main className="web-main">{children}</main>
                  <SiteFooter />
                  <FloatingButton />
                  <Toaster position="top-center" richColors />
                </BookMarkProvider>
              </LikesProvider>
            </AuthProvider>
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  )
}
