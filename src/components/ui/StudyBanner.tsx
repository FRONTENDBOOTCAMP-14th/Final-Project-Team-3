// src/components/ui/StudyBanner.tsx
'use client'

import Image from 'next/image'

interface StudyBannerProps {
  src: string
  alt?: string
  className?: string
}

export default function StudyBanner({
  src,
  alt = '스터디 배너',
  className,
}: StudyBannerProps) {
  const isGif = src?.toLowerCase().endsWith('.gif')

  return (
    <div className={`study-banner ${className ?? ''}`}>
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: 'cover' }}
        {...(isGif ? { unoptimized: true } : {})}
      />
    </div>
  )
}
