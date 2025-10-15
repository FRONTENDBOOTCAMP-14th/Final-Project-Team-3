// app/study-create/page.tsx
import { redirect } from 'next/navigation'

import StudyCreateForm from '@/components/study-create/studycreateform'
import { createClient } from '@/libs/supabase/server'

// 캐시 없이 매 요청마다 인증 확인(선택 사항, 권장)
export const dynamic = 'force-dynamic'

export default async function StudyCreatePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // 로그인 안 된 경우 홈(또는 로그인)으로
    redirect('/?next=/study-create')
  }

  return (
    <section className="study-create-page">
      <h1 className="sr-only">스터디/모임 생성</h1>
      <StudyCreateForm />
    </section>
  )
}
