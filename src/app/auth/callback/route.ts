import { NextResponse } from 'next/server'

import { createClient } from '@/libs/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()

    const {
      error,
      data: { user },
    } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(`${origin}/login?message=${error.message}`)
    }

    if (user) {
      const { data: existingProfile } = await supabase
        .from('profile')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!existingProfile) {
        const { error } = await supabase.from('profile').insert([
          {
            id: user.id,
            email: user.email,
            nickname:
              user.user_metadata?.full_name ??
              user.user_metadata?.name ??
              user.email?.split('@')[0],
            profile_url:
              user.user_metadata?.avatar_url ?? '/default-avatar.png',
          },
        ])

        if (error) {
          return NextResponse.redirect(
            `${origin}/login?message=프로필 생성 에러`
          )
        }
      }
    }

    return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect('/')
}
