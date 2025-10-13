import supabase from '../client'

export async function socialLogin(
  provider: 'google' | 'kakao',
  pathname: string
) {
  const redirectToUrl = `${window.origin}/auth/callback?next=${pathname}`

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectToUrl,
    },
  })

  if (error) throw new Error(error.message)
}
