'use server'

import Link from 'next/link'

import { createClient } from '@/libs/supabase/server'
import '@/styles/study-detail/edit-button.css'

export default async function EditButtonServer({
  studyId,
}: {
  studyId: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('study_room')
    .select('owner_id')
    .eq('id', studyId)
    .single()

  if (error || !data) return null
  if (data.owner_id !== user.id) return null

  return (
    <div className="edit-button-wrap">
      <Link href={`/study-edit/${studyId}`} className="edit-button-link">
        <img
          src="/images/edit-icon.svg"
          alt="수정하기"
          className="edit-button-icon"
          draggable="false"
        />
      </Link>
    </div>
  )
}
