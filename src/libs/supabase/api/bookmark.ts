'use server'

import type { StudyRoom } from '..'
import { createClient } from '../server'

export const toggleBookmark = async (roomId: string, userId: string) => {
  const supabase = await createClient()

  const { data: existing, error: fetchError } = await supabase
    .from('bookmark')
    .select('*')
    .eq('room_id', roomId)
    .eq('user_id', userId)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw new Error(fetchError.message)
  }

  if (existing) {
    const { error: deleteError } = await supabase
      .from('bookmark')
      .delete()
      .eq('id', existing.id)
    if (deleteError) throw new Error(deleteError.message)
    return { bookmarked: false }
  } else {
    const { error: insertError } = await supabase
      .from('bookmark')
      .insert({ room_id: roomId, user_id: userId })
    if (insertError) throw new Error(insertError.message)
    return { bookmarked: true }
  }
}

export const getUserBookmarks = async (userId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bookmark')
    .select('room_id, study_room(*)')
    .eq('user_id', userId)

  if (error) throw new Error(error.message)

  return data.map((item) => item.study_room) as StudyRoom[]
}
