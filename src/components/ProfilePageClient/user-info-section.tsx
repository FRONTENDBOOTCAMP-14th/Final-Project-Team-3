'use client'

import { useEffect, useState } from 'react'

import ProfileImgUploader from '@/components/study-create/fields/profileimguploader'

interface Props {
  user: {
    name: string
    email: string
    avatarUrl: string
  }
  setAvatarFile: (file: File | null) => void
}

export default function UserInfoSection({ user, setAvatarFile }: Props) {
  const [_avatarFile, setAvatarFileState] = useState<File | null>(null)
  const [displayedImage, setDisplayedImage] = useState<string>(
    user.avatarUrl || '/images/default-avatar.png'
  )

  const handleFileChange = (file: File | null) => {
    setAvatarFileState(file)
    setAvatarFile(file)
  }

  useEffect(() => {
    if (_avatarFile) {
      const url = URL.createObjectURL(_avatarFile)
      setDisplayedImage(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setDisplayedImage(user.avatarUrl || '/images/default-avatar.png')
    }
  }, [_avatarFile, user.avatarUrl])

  return (
    <div className="user-info-section">
      <ProfileImgUploader value={_avatarFile} onChange={handleFileChange} />

      <div className="user-info-text">
        <h2 className="user-name">{user.name}</h2>
        <p className="user-email">{user.email}</p>
      </div>

      <img src={displayedImage} alt="User avatar" className="user-avatar" />
    </div>
  )
}
