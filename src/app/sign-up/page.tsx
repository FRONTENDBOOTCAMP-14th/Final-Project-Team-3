'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import SignUpForm from '@/components/sign-up/SignUpForm'
import supabase from '@/libs/supabase/client'

export default function SignUpPage() {
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        alert('이미 로그인된 상태에서는 회원가입 페이지에 접근할 수 없습니다.')
        router.replace('/')
      }
    }

    checkUser()
  }, [router])

  return (
    <main className="sign-up-wrapper">
      <SignUpForm />
    </main>
  )
}
