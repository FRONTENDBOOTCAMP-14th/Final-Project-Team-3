import type { ResultType } from '@/types/apiResultsType'

import supabase from '../client'

export async function socialLogin(
  provider: 'google' | 'kakao',
  pathname: string
): Promise<ResultType<void>> {
  const redirectToUrl = `${window.origin}/auth/callback?next=${pathname}`

  const msg = provider === 'google' ? '구글' : '카카오'

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectToUrl,
    },
  })

  if (error) {
    return {
      ok: false,
      message: `${msg} 로그인 실패... 잠시후 다시 시도해 주세요.`,
    }
  }

  return { ok: true, message: `${msg} 로그인 성공!` }
}
