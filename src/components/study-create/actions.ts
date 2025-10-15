// actions.ts
'use client'

import supabase from '@/libs/supabase/client'

export type StudyActionResult =
  | { ok: true; id: string }
  | { ok: false; message: string }

const DEFAULT_BANNER = '/images/no-image.png'
const ALLOWED_MIME = ['image/png', 'image/jpeg', 'image/gif'] as const

export async function createStudyAction(
  _prev: StudyActionResult | null,
  formData: FormData
): Promise<StudyActionResult> {
  const { data: auth } = await supabase.auth.getUser()
  const user = auth.user
  if (!user) return { ok: false, message: '로그인이 필요합니다.' }

  const title = String(formData.get('title') ?? '').trim()
  const rawCategory = String(formData.get('category') ?? '').trim()
  const otherCategory = String(formData.get('categoryOther') ?? '').trim()
  const region = String(formData.get('region') ?? '').trim()
  const regionDepth = String(formData.get('regionDepth') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const bannerEntry = formData.get('banner')
  const banner =
    bannerEntry instanceof File && bannerEntry.size > 0 ? bannerEntry : null

  const category = rawCategory === 'other' ? otherCategory : rawCategory
  if (!category)
    return { ok: false, message: '카테고리를 입력하거나 선택해 주세요.' }

  // 파일 검사
  if (banner) {
    if (!ALLOWED_MIME.includes(banner.type as (typeof ALLOWED_MIME)[number])) {
      return {
        ok: false,
        message: 'jpeg, png, gif 파일만 업로드할 수 있습니다.',
      }
    }
  }

  // 업로드
  let bannerPublicUrl: string | null = null
  if (banner && banner.size > 0) {
    const ext = banner.name.split('.').pop()?.toLowerCase() ?? 'png'
    const path = `${user.id}/banners/${crypto.randomUUID()}.${ext}` // ✅ 확장자는 점(.)으로

    const { error: uploadErr } = await supabase.storage
      .from('study_image') // ✅ 실제 버킷명으로 통일
      .upload(path, banner, { cacheControl: '3600', upsert: false })

    if (uploadErr) {
      return { ok: false, message: `이미지 업로드 실패: ${uploadErr.message}` }
    }

    const { data } = supabase.storage.from('study_image').getPublicUrl(path)
    bannerPublicUrl = data.publicUrl
  }

  const finalBanner = bannerPublicUrl ?? DEFAULT_BANNER

  const { data, error } = await supabase
    .from('study_room')
    .insert([
      {
        owner_id: user.id,
        title,
        category,
        region,
        region_depth: regionDepth,
        description,
        banner_image: finalBanner,
        created_at: new Date().toISOString(),
      },
    ])
    .select('id')
    .single()

  if (error) return { ok: false, message: `생성 실패: ${error.message}` }
  return { ok: true, id: data.id }
}
