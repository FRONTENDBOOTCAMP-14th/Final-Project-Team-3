import Link from 'next/link'

import HomeComponents from '@/components/home'
import '@/styles/floating-button/floating-button.css'

export default function HomePage() {
  return (
    <section>
      <HomeComponents />

      {/* 플로팅 버튼 */}
      <Link
        href="/study-create"
        className="fab-create"
        aria-label="스터디·모집 생성 페이지로 이동"
      >
        <span className="fab-icon">+</span>
      </Link>
    </section>
  )
}
