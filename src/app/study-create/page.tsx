import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import StudyCreateForm from '@/components/study-create/studycreateform'
import { createClient } from '@/libs/supabase/server'

import '@/styles/study-create/study-create.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '모이다(MOIDA) 스터디를 생성해 보아요.',
  description:
    '모이다(MOIDA) 스터디 모집 플랫폼과 함께 가까운 지역, 관심 분야 등 나와 가장 잘 맞는 스터디를 만들어 보세요.',
}

export default async function StudyCreatePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    //  새로운 경고 페이지로 리다이렉트
    redirect('/auth/alert?next=/study-create')
  }

  return (
    <section className="study-create-page">
      <h1 className="sr-only">스터디/모임 생성</h1>
      <StudyCreateForm />
    </section>
  )
}
