'use client'

import '@/styles/loading-error/status.css'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthAlertPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/'

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router, next])

  return (
    <main className="alert-page">
      <div className="status-card" role="status" aria-live="polite">
        <span className="status-info-icon">ℹ️</span>
        <p>로그인 후 이용 가능한 페이지입니다.</p>
        <p>잠시 뒤 홈으로 이동합니다…</p>
      </div>
    </main>
  )
}
