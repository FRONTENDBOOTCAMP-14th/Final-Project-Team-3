import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import EditStudyForm from '@/components/study-edit/EditStudyForm'
import { getStudyRoomDetail } from '@/libs/supabase/api/study-room'
import { fetchStudyDetail } from '@/libs/supabase/api/study-update-edit'
import { createClient } from '@/libs/supabase/server'
import '@/styles/study-create/study-create.css'

export const revalidate = 0

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const response = await getStudyRoomDetail(id)
  if (!response.ok) {
    throw new Error(response.message)
  }

  return {
    title: `${response.data?.title}`,
    description: `${response.data?.title} | ${response.data?.description}`,
  }
}

export default async function Page({ params }: Props) {
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
