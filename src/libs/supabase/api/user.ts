'use server'

import type { Bookmark, Profile } from '..'
import { createClient } from '../server'

interface SignUpData {
  email: string
  password: string
  nickname: string
}

export async function signUpAndCreateProfile(data: SignUpData): Promise<void> {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  })

  if (authError) throw authError
  const user = authData.user
  if (!user) throw new Error('회원가입 후 사용자 정보를 불러올 수 없습니다.')

  const { error: profileError } = await supabase.from('profile').insert([
    {
      id: user.id,
      email: user.email,
      nickname: data.nickname || '새 유저',
      profile_url: '/images/default-avatar.png',
    },
  ])

  if (profileError) throw profileError
}

export async function getUserProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()

  if (!userId) return null

  const { data: profileData, error: profileError } = await supabase
    .from('profile')
    .select('*')
    .eq('id', userId)
    .single()

  if (profileError) {
    throw new Error(profileError.message)
  }

  return profileData
}

export async function getMyBookMarkStudyRoom(
  userId: string
): Promise<Bookmark[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bookmark')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}

export async function setBookMarkStudyRoom(
  studyId: string,
  userId: string
): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from('bookmark').insert({
    room_id: studyId,
    user_id: userId,
  })

  if (error) {
    if (error.code === '23505') {
      throw new Error('이미 즐겨찾기에 추가 되었습니다.')
    } else {
      throw new Error(error.message)
    }
  }
}

export async function removeBookMarkStudyRoom(
  studyId: string,
  userId: string
): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('bookmark')
    .delete()
    .eq('room_id', studyId)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
}
