import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

import { createClient } from '@/libs/supabase/server'

export async function POST() {
  const supabase = await createClient()

  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  return new NextResponse(null, { status: 200 })
}
