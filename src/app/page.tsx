import Link from 'next/link'

import HomeComponents from '@/components/home'
import '@/styles/floating-button/floating-button.css'

interface Props {
  searchParams: Promise<{ region?: string; depth?: string; search?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const { region, depth, search } = await searchParams

  return (
    <section>
      <HomeComponents region={region} depth={depth} search={search} />

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
