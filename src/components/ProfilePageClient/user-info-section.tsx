'use client'

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
  return (
    <div className="user-info-section">
      <div className="avatar-uploader">
        <BannerUploader value={null} onChange={setAvatarFile} />
        <img src={avatarUrl} alt="User avatar" className="avatar-preview" />
      </div>

      <div className="user-details">
        <h2 className="user-name">{user.name}</h2>
        <p className="user-email">{user.email}</p>
      </div>
    </div>
  )
}
