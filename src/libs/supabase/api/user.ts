// actions/auth.ts (변경 없음)
'use server'

import { createClient } from '../server'

interface SignUpData {
  email: string
  password: string
  nickname: string
}

export async function signUpAndCreateProfile(data: SignUpData): Promise<void> {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  })

  if (authError) throw authError
  const user = authData.user
  if (!user) throw new Error('회원가입 후 사용자 정보를 불러올 수 없습니다.')

  const { error: profileError } = await supabase.from('profile').insert([
    {
      id: user.id,
      email: user.email,
      nickname: data.nickname || '새 유저',
      profile_url: '/avatar-default.png',
    },
  ])

  if (profileError) throw profileError
}
