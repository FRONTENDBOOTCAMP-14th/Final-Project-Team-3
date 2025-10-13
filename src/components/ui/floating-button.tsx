'use client'
import Link from 'next/link'

import { useAuth } from '@/hooks/useAuth'

import '@/styles/floating-button/floating-button.css'

function FloatingButton() {
  const { user } = useAuth()

  if (!user) return null
  return (
    <Link
      href="/study-create"
      className="fab-create"
      aria-label="스터디·모집 생성 페이지로 이동"
    >
      <span className="fab-icon">+</span>
    </Link>
  )
}

export default FloatingButton
