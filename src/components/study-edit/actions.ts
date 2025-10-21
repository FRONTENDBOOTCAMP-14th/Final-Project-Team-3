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

  if (error || !data) {
    return { ok: false, message: '존재하지 않는 스터디입니다.' }
  }
  return { ok: true, data: data as StudyDetail }
}

export async function updateStudyAction(
  _prev: StudyActionResult | null,
  formData: FormData
): Promise<StudyActionResult> {
  try {
    const supabase = await createClient()

    const file = formData.get('banner') as File | null
    const id = String(formData.get('id') ?? '')
    const title = String(formData.get('title') ?? '').trim()
    const description = String(formData.get('description') ?? '').trim()
    const region = String(formData.get('region') ?? '').trim()
    const region_depth = String(formData.get('regionDepth') ?? '').trim()
    const category = String(formData.get('category') ?? '').trim()

    if (!id || !title || !description || !region || !region_depth) {
      return { ok: false, message: '필수 값이 누락되었습니다.' }
    }

    // 기존 배너 유지값 정규화
    const keepRaw = (formData.get('banner_keep') as string) ?? ''
    const keepUrl = keepRaw.length > 0 ? keepRaw : null

    let uploadedUrl: string | null = null

    if (file && typeof file === 'object' && file.size > 0) {
      if (file.size > MAX_BYTES) {
        return { ok: false, message: '이미지 용량이 10MB를 초과했습니다.' }
      }
      if (!ALLOWED_MIME.includes(file.type as (typeof ALLOWED_MIME)[number])) {
        return {
          ok: false,
          message: 'jpeg, png, gif 파일만 업로드할 수 있습니다.',
        }
      }

      const ext = file.name?.split('.').pop()?.toLowerCase() ?? 'png'
      const filename = `${id}-${Date.now()}.${ext}`

      const up = await supabase.storage
        .from(BUCKET)
        .upload(filename, file, { cacheControl: '3600', upsert: true })
      if (up.error) {
        return { ok: false, message: '배너 업로드에 실패했습니다.' }
      }

      const pub = supabase.storage.from(BUCKET).getPublicUrl(up.data.path)
      uploadedUrl = pub.data.publicUrl
    }

    const payload: Record<string, unknown> = {
      title,
      description,
      region,
      region_depth,
      category,
    }
    if (uploadedUrl !== null) {
      payload.banner_image = uploadedUrl
    } else if (keepUrl !== null) {
      payload.banner_image = keepUrl
    }

    const upd = await supabase.from('study_room').update(payload).eq('id', id)
    if (upd.error) {
      return { ok: false, message: '수정에 실패했어요. 다시 시도해 주세요.' }
    }

    return { ok: true, id }
  } catch {
    return { ok: false, message: '예상치 못한 오류가 발생했습니다.' }
  }
}
