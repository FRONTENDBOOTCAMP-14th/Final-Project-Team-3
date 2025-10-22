import Image from 'next/image'
import Link from 'next/link'
import { useId } from 'react'

import '@/styles/footer/footer.css'

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

const linksCompany = [
  { label: '소개', href: '/about' },
  { label: '문의', href: '/contact' },
] as const satisfies ReadonlyArray<FooterLink>

const linksSupport = [
  { label: '이용약관', href: '/terms' },
  { label: '개인정보처리방침', href: '/privacy' },
  { label: '위치기반 서비스 이용약관', href: '/location-terms' },
] as const satisfies ReadonlyArray<FooterLink>

const linksSocial = [
  {
    label: 'Notion',
    href: 'https://www.notion.so/3-27773873401a801c928ec6d118a16ed4',
    external: true,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/FRONTENDBOOTCAMP-14th/Final-Project-Team-3',
    external: true,
  },
] as const satisfies ReadonlyArray<FooterLink>

function A11yLink({
  label,
  href,
  external,
  className,
}: {
  label: string
  href: string
  external?: boolean
  className?: string
}) {
  if (external) {
    return (
      <a
        className={className}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
        <span className="sr-only"> (새 창에서 열림)</span>
        <span className="external-indicator" aria-hidden="true" />
      </a>
    )
  }
  return (
    <Link className={className} href={href}>
      {label}
    </Link>
  )
}

export default function SiteFooter() {
  const navId = useId()
  const platformId = useId()
  const supportId = useId()
  const socialId = useId()

  // 모든 내부 링크 비활성화 (준비중)
  const DISABLE_INTERNAL_LINKS = true

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link className="brand-link" href="/" aria-label="홈으로 이동">
            {/* ✅ 아이콘 추가 */}
            <Image
              src="/images/moida-icon.svg"
              alt="/"
              width={70}
              height={70}
              className="brand-icon"
            />
            <span className="brand-text">모이다</span>
          </Link>

          <p className="brand-desc">
            지역 기반 스터디,모임 플랫폼 - &quot;모이다&quot;
          </p>
        </div>

        <nav
          className="footer-nav"
          id={navId}
          aria-labelledby={`${navId}-title`}
        >
          <h2 id={`${navId}-title`} className="sr-only">
            푸터 내비게이션
          </h2>

          {/* 플랫폼 */}
          <div className="nav-group" aria-labelledby={platformId}>
            <h3 id={platformId} className="nav-title">
              플랫폼
            </h3>
            <ul className="nav-list">
              {linksCompany.map((item) => (
                <li key={item.href}>
                  {DISABLE_INTERNAL_LINKS ? (
                    <span
                      role="link"
                      aria-disabled="true"
                      tabIndex={-1}
                      className="nav-link disabled"
                    >
                      {item.label} (준비중)
                    </span>
                  ) : (
                    <A11yLink
                      className="nav-link"
                      label={item.label}
                      href={item.href}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* 지원 */}
          <div className="nav-group" aria-labelledby={supportId}>
            <h3 id={supportId} className="nav-title">
              지원
            </h3>
            <ul className="nav-list">
              {linksSupport.map((item) => (
                <li key={item.href}>
                  {DISABLE_INTERNAL_LINKS ? (
                    <span
                      role="link"
                      aria-disabled="true"
                      tabIndex={-1}
                      className="nav-link disabled"
                    >
                      {item.label} (준비중)
                    </span>
                  ) : (
                    <A11yLink
                      className="nav-link"
                      label={item.label}
                      href={item.href}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* 소셜 */}
          <div className="nav-group" aria-labelledby={socialId}>
            <h3 id={socialId} className="nav-title">
              소셜
            </h3>
            <ul className="nav-list">
              {linksSocial.map((item) => (
                <li key={item.href}>
                  <A11yLink
                    className="nav-link"
                    label={item.label}
                    href={item.href}
                    external
                  />
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="footer-bottom" aria-label="저작권 정보">
        <p className="copyright">©2025. 3시세끼. All rights reserved</p>
      </div>
    </footer>
  )
}
