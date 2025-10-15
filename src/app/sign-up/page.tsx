import { redirect } from 'next/navigation'

import SignUpForm from '@/components/sign-up/SignUpForm'
import { createClient } from '@/libs/supabase/server'

export default async function SignUpPage() {
  const supabase = await createClient()

  const {
    data: { user: loggedInUser },
  } = await supabase.auth.getUser()

  if (loggedInUser) {
    redirect('/')
  }

  return (
    <main className="sign-up-wrapper">
      <SignUpForm />
    </main>
  )
}
