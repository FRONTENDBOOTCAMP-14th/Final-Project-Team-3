'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthAlertPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/'

  useEffect(() => {
    alert('로그인 후 이용 가능한 페이지입니다.\n잠시 뒤 홈으로 이동합니다.')
    const timer = setTimeout(() => {
      router.replace('/')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router, next])

  return (
    <main>
      <p role="status">
        로그인 후 이용 가능한 페이지입니다. 잠시 뒤 홈으로 이동합니다…
      </p>
    </main>
  )
}
