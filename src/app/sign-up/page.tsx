import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import SignUpForm from '@/components/sign-up/SignUpForm'
import { createClient } from '@/libs/supabase/server'

export const metadata: Metadata = {
  title: '모이다(MOIDA)에 회원가입 해주세요.',
  description:
    '간단하게 모이다(MOIDA) 스터디 모집 플랫폼에 회원가입 해주세요. ',
}

export default async function SignUpPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/')
  }

  return (
    <main className="sign-up-wrapper">
      <SignUpForm />
    </main>
  )
}
