'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { supabase } from '@/lib/supabaseClient'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const initProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (!existingProfile) {
          await supabase.from('profiles').insert([
            {
              id: user.id,
              email: user.email,
              username:
                user.user_metadata.full_name ??
                user.user_metadata.name ??
                user.email?.split('@')[0],
              avatar_url:
                user.user_metadata.avatar_url ?? '/default-avatar.png',
            },
          ])
        }
      }

      router.push('/')
    }

    initProfile()
  }, [router])

  return <p>로그인 중입니다... 잠시만 기다려주세요.</p>
}
