'use server'

import type { ResultType } from '@/types/apiResultsType'

import type { Bookmark, Likes, Profile } from '..'
import { createClient } from '../server'

interface SignUpData {
  email: string
  password: string
  nickname: string
}

export async function signUpAndCreateProfile(
  data: SignUpData
): Promise<ResultType<void>> {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  })

  if (authError || !authData.user) {
    return { ok: false, message: '회원가입 실패...' }
  }

  const user = authData.user

  const { error: profileError } = await supabase.from('profile').insert([
    {
      id: user.id,
      email: user.email,
      nickname: data.nickname || '새 유저',
      profile_url: '/images/default-avatar.png',
    },
  ])

  if (profileError?.code === '23505') {
    return {
      ok: false,
      message: '이미 가입된 이메일 주소 입니다.',
    }
  } else if (profileError) {
    return { ok: false, message: '프로파일 업데이트 실패...' }
  } else {
    return { ok: true, message: '회원가입 성공! 이메일을 확인해주세요 📧' }
  }
}

export async function getUserProfile(
  userId: string
): Promise<ResultType<Profile> | null> {
  const supabase = await createClient()

  if (!userId) return null

  const { data: profileData, error: profileError } = await supabase
    .from('profile')
    .select('*')
    .eq('id', userId)
    .single()

  if (profileError) {
    return { ok: false, message: '프로필 정보 조회 실패...' }
  }

  return { ok: true, data: profileData }
}

export async function getMyBookMarkStudyRoom(
  userId: string
): Promise<ResultType<Bookmark[]>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bookmark')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    return { ok: false, message: '"좋아요" 가져오기 실패...' }
  }

  return { ok: true, data: data ?? [] }
}

export async function setBookMarkStudyRoom(
  studyId: string,
  userId: string
): Promise<ResultType<void>> {
  const supabase = await createClient()

  const { error } = await supabase.from('bookmark').insert({
    room_id: studyId,
    user_id: userId,
  })

  if (error) {
    if (error.code === '23505') {
      return { ok: false, message: '이미 즐겨찾기에 추가 되었습니다.' }
    } else {
      return { ok: false, message: '즐겨찾기 추가 실패.' }
    }
  }

  return { ok: true, message: '즐겨찾기에 추가 되었습니다..' }
}

export async function removeBookMarkStudyRoom(
  studyId: string,
  userId: string
): Promise<ResultType<void>> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('bookmark')
    .delete()
    .eq('room_id', studyId)
    .eq('user_id', userId)

  if (error) {
    return { ok: false, message: '즐겨찾기 제거 실패.' }
  }

  return { ok: true, message: '즐겨찾기가 제거 되었습니다..' }
}

export async function setLikesStudyRoom(
  studyId: string,
  userId: string
): Promise<ResultType<void>> {
  const supabase = await createClient()

  const { error } = await supabase.from('likes').insert({
    room_id: studyId,
    user_id: userId,
  })

  if (error) {
    if (error.code === '23505') {
      return { ok: false, message: '이미 "좋아요"에 추가 되었습니다.' }
    } else {
      return { ok: false, message: '"좋아요" 추가 실패...' }
    }
  }

  return { ok: true, message: '"좋아요"에 추가 되었습니다..' }
}

export async function getMyLikesStudyRoom(
  userId: string
): Promise<ResultType<Likes[]>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    return { ok: false, message: '"좋아요" 가져오기 실패...' }
  }

  return { ok: true, data: data ?? [] }
}

export async function removeLikesStudyRoom(
  studyId: string,
  userId: string
): Promise<ResultType<void>> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('room_id', studyId)
    .eq('user_id', userId)

  if (error) {
    return { ok: false, message: '"좋아요" 제거 실패...' }
  }

  return { ok: true, message: '"좋아요"가 제거 되었습니다.' }
}

export async function avatarUpload(
  userId: string,
  file: File | null
): Promise<ResultType<string>> {
  const supabase = await createClient()

  if (!userId) {
    return { ok: false, message: '로그인이 필요 합니다...' }
  }
  if (!file) {
    // DB의 프로필 URL 기본 이미지로 변경

    const { error: updateError } = await supabase
      .from('profile')
      .update({ profile_url: '/images/default-avatar.png' })
      .eq('id', userId)

    if (updateError) {
      return { ok: false, message: '프로필 업로드 실패...' }
    }
    return { ok: true, message: '기본 프로필 이미지로 수정 되었습니다.' }
  }

  // ✅ 이미지 업로드 로직
  const filePath = `profile/${userId}/${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('profile')
    .upload(filePath, file, { upsert: true })

  if (uploadError) {
    return { ok: false, message: '이미지 업로드 실패...' }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('profile').getPublicUrl(filePath)

  const { error: updateError } = await supabase
    .from('profile')
    .update({ profile_url: publicUrl })
    .eq('id', userId)

  if (updateError) {
    return { ok: false, message: '프로필 이미지 수정 실패...' }
  }

  return {
    ok: true,
    data: publicUrl,
    message: '프로필 이미지가 변경 되었습니다.',
  }
}

export async function updateUserProfile(
  userId: string,
  bio: string | null
): Promise<ResultType<Profile> | null> {
  const supabase = await createClient()

  if (!userId) return null

  const { data: profileData, error: profileError } = await supabase
    .from('profile')
    .update({
      bio,
    })
    .eq('id', userId)
    .select('*')
    .single()

  if (profileError) {
    return { ok: false, message: '프로필 수정 실패...' }
  }

  return { ok: true, data: profileData, message: '프로필을 수정 하였습니다.' }
}
