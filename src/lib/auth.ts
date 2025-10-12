import { supabase } from './supabaseClient'

export async function signInWithOAuth(provider: 'google' | 'kakao') {
  await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
}
