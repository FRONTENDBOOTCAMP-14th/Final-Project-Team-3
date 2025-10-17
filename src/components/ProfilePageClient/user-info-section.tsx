'use client'

import { useEffect, useState } from 'react'

import BannerUploader from '@/components/study-create/fields/profileimguploader'

interface UserInfoSectionProps {
  user: {
    name: string
    email: string
  }
  avatarUrl: string
  setAvatarFile: (file: File | null) => void
}

export default function UserInfoSection({
  user,
  avatarUrl,
  setAvatarFile,
}: UserInfoSectionProps) {
  // ✅ 업로드 파일 상태
  const [avatarFile, setAvatarFileState] = useState<File | null>(null)

  // BannerUploader 변경 시 상태 업데이트
  const handleFileChange = (file: File | null) => {
    setAvatarFileState(file)
    setAvatarFile(file)
  }

  // 기존 avatarUrl + 업로드 파일 미리보기 통합
  const [displayedImage, setDisplayedImage] = useState<string>(avatarUrl)
  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile)
      setDisplayedImage(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setDisplayedImage(avatarUrl)
    }
  }, [avatarFile, avatarUrl])

  return (
    <div className="user-info-section">
      <div className="avatar-uploader">
        <BannerUploader value={avatarFile} onChange={handleFileChange} />
        <img
          src={displayedImage}
          alt="User avatar"
          className="avatar-preview"
        />
      </div>

      <div className="user-details">
        <h2 className="user-name">{user.name}</h2>
        <p className="user-email">{user.email}</p>
      </div>
    </div>
  )
}
