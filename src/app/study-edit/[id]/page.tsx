import { notFound, redirect } from 'next/navigation'

import { fetchStudyDetail } from '@/components/study-edit/actions'
import EditStudyForm from '@/components/study-edit/EditStudyForm'
import { createClient } from '@/libs/supabase/server'

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/study-detail/${id}`)
  }

  // 2) 소유자 확인
  const { data: ownerRow, error: ownerErr } = await supabase
    .from('study_room')
    .select('owner_id')
    .eq('id', id)
    .single()

  if (ownerErr || !ownerRow) notFound()
  if (ownerRow.owner_id !== user.id) {
    redirect(`/study-detail/${id}`)
  }

  const res = await fetchStudyDetail(id)
  if (!res.ok) notFound()

  return (
    <EditStudyForm initial={res.data} /* submitMode='server' or 'client' */ />
  )
}
