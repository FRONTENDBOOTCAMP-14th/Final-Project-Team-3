'use client'
import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { useAuth } from '@/hooks/useAuth'
import { avatarUpload, getUserProfile } from '@/libs/supabase/api/user'

export interface ProfileContextValue {
  avatarUrl: string | null | undefined
  handleAvatarUpload: (file: File | null) => Promise<void>
  _avatarFile: File | null
}

export const ProfileContext = createContext<ProfileContextValue | null>(null)
ProfileContext.displayName = 'ProfileContext'

export function ProfileProvider({ children }: PropsWithChildren) {
  const { user } = useAuth()

  const [avatarUrl, setAvatarUrl] = useState<string | null | undefined>(null)
  const [_avatarFile, _setAvatarFile] = useState<File | null>(null)

  useEffect(() => {
    if (!user) return
    const fetch = async () => {
      const response = await getUserProfile(user.id)
      setAvatarUrl(response?.data?.profile_url)
    }

    fetch()
  }, [user])

  const handleAvatarUpload = useCallback(
    async (file: File | null) => {
      if (!user) return

      if (!file) {
        setAvatarUrl(null)
        _setAvatarFile(null)
      }

      const publicUrl = await avatarUpload(user.id, file)

      if (publicUrl?.ok) {
        toast.success(publicUrl.message, {
          action: {
            label: '닫기',
            onClick: () => {},
          },
        })
        setAvatarUrl(publicUrl?.data)
      } else {
        toast.error(publicUrl?.message, {
          action: {
            label: '닫기',
            onClick: () => {},
          },
        })
      }
    },
    [user]
  )

  const state = useMemo(
    () => ({
      handleAvatarUpload,
      avatarUrl,
      _avatarFile,
    }),
    [_avatarFile, avatarUrl, handleAvatarUpload]
  )

  return <ProfileContext value={state}>{children}</ProfileContext>
}
