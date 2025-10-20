'use server'

import { createClient } from '@/libs/supabase/server'

const ALLOWED_MIME = ['image/png', 'image/jpeg', 'image/gif'] as const
const MAX_BYTES = 10 * 1024 * 1024 // 10MB
const BUCKET = 'study_image'

export interface StudyDetail {
  id: string
  title: string
  description: string
  region: string
  region_depth: string
  category: string
  banner_image: string | null
}

export type StudyActionResult =
  | { ok: true; id: string }
  | { ok: false; message: string }

export async function fetchStudyDetail(
  id: string
): Promise<{ ok: true; data: StudyDetail } | { ok: false; message: string }> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('study_room')
    .select(
      'id, title, description, region, region_depth, category, banner_image'
    )
    .eq('id', id)
    .single()

  if (error || !data)
    return { ok: false, message: '존재하지 않는 스터디입니다.' }
  return { ok: true, data: data as StudyDetail }
}

export async function updateStudyAction(
  _prev: StudyActionResult | null,
  formData: FormData
): Promise<StudyActionResult> {
  try {
    const supabase = await createClient()

    const id = String(formData.get('id') ?? '')
    const title = String(formData.get('title') ?? '')
    const description = String(formData.get('description') ?? '')
    const region = String(formData.get('region') ?? '')
    const region_depth = String(formData.get('regionDepth') ?? '')
    const category = String(formData.get('category') ?? '')

    if (!id || !title || !description || !region || !region_depth) {
      return { ok: false, message: '필수 값이 누락되었습니다.' }
    }

    // 배너 유지 기본 값
    let banner_image: string | null =
      (formData.get('banner_keep') as string) || null

    const file = formData.get('banner') as File | null
    if (file && typeof file === 'object' && file.size > 0) {
      // ① 사이즈/타입 검증 (서버 본문 10MB 이내여야 여기 도달)
      if (file.size > MAX_BYTES) {
        return { ok: false, message: '이미지 용량이 10MB를 초과했습니다.' }
      }
      const isAllowed = ALLOWED_MIME.includes(
        file.type as (typeof ALLOWED_MIME)[number]
      )
      if (!isAllowed) {
        return {
          ok: false,
          message: 'jpeg, png, gif 파일만 업로드할 수 있습니다.',
        }
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      // ② 경로/확장자
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png'
      const owner = user?.id ?? 'anonymous'
      const path = `${owner}/banners/${id}-${Date.now()}.${ext}`

      // ③ 업로드 (생성과 동일하게 BUCKET 통일)
      const { data: up, error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { cacheControl: '3600', upsert: true })
      if (upErr)
        return { ok: false, message: `배너 업로드 실패: ${upErr.message}` }

      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(up.path)
      banner_image = urlData.publicUrl
    }

    //  DB 업데이트
    const { error: updErr } = await supabase
      .from('study_room')
      .update({
        title,
        description,
        region,
        region_depth,
        category,
        banner_image,
      })
      .eq('id', id)

    if (updErr)
      return { ok: false, message: '수정에 실패했어요. 다시 시도해 주세요.' }
    return { ok: true, id }
  } catch (_e) {
    return { ok: false, message: '예상치 못한 오류가 발생했습니다.' }
  }
}
