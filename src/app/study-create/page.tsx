// app/study-create/page.tsx
import { redirect } from 'next/navigation'

import '@/styles/study-create/study-create.css'
import StudyCreateForm from '@/components/study-create/studycreateform'
import { createClient } from '@/libs/supabase/server'

export const dynamic = 'force-dynamic'

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
