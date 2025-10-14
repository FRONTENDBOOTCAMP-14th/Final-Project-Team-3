// actions.ts
'use client'

import supabase from '@/libs/supabase/client'
const DEFAULT_BANNER = '/images/no-image.png'

export type StudyActionResult =
  | { ok: true; id: string }
  | { ok: false; message: string }

const ALLOWED_MIME = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'] as const
const MAX_SIZE = 10 * 1024 * 1024

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
  const banner = formData.get('banner') as File | null

  const finalCategory = rawCategory === 'other' ? otherCategory : rawCategory
  if (!finalCategory) return { ok: false, message: '카테고리를 입력하거나 선택해 주세요.' }

  if (banner) {
    if (!ALLOWED_MIME.includes(banner.type as any)) {
      return { ok: false, message: 'JPG, PNG, GIF 파일만 업로드할 수 있습니다.' }
    }
    if (banner.size > MAX_SIZE) {
      return { ok: false, message: '파일 용량은 최대 10MB까지 가능합니다.' }
    }
  }

  let bannerPublicUrl: string | null = null
  if (banner && banner.size > 0) {
    const ext = banner.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `${user.id}/banners/${crypto.randomUUID()}.${ext}`

    const { error: uploadErr } = await supabase.storage
      .from('study_image')
      .upload(path, banner, { cacheControl: '3600', upsert: false })
    if (uploadErr) return { ok: false, message: `이미지 업로드 실패: ${uploadErr.message}` }

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
        category: finalCategory,
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
