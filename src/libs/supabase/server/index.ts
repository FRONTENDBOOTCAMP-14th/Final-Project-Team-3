import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import type { Database } from '../database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAPIKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY as string

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(supabaseUrl, supabaseAPIKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Server Component에서는 setAll을 무시
          // Middleware에서 세션 갱신을 처리
        }
      },
    },
  })
}
