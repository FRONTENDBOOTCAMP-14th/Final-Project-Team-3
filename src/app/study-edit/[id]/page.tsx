import { notFound, redirect } from 'next/navigation'

import { fetchStudyDetail } from '@/components/study-edit/actions'
import EditStudyForm from '@/components/study-edit/EditStudyForm'

import { createClient } from '../../../libs/supabase/server'

export const revalidate = 0

export default async function Page({
  params,
}: {
  // ✅ Promise 사용 (프로젝트 설정과 일치)
  params: Promise<{ id: string }>
}) {
  const { id } = await params // ✅ 반드시 await

  // 1) 세션
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/study-detail/${id}`)

  // 2) 소유자 확인
  const { data: ownerRow, error: ownerErr } = await supabase
    .from('study_room')
    .select('owner_id')
    .eq('id', id)
    .single()

  if (ownerErr || !ownerRow) notFound()
  if (ownerRow.owner_id !== user.id) redirect(`/study-detail/${id}`)

  // 3) 초기 데이터
  const res = await fetchStudyDetail(id)
  if (!res.ok) notFound()

  return (
    <EditStudyForm initial={res.data} /* submitMode="server" | "client" */ />
  )
}
