'use server'

import type { TablesInsert, TablesUpdate } from '@/libs/supabase/database.types'
import { createClient } from '@/libs/supabase/server'

type StudyRoomInsert = TablesInsert<'study_room'>
type StudyRoomUpdate = TablesUpdate<'study_room'>

/** 업로드 정책 */
const ALLOWED_MIME = ['image/png', 'image/jpeg', 'image/gif'] as const
const MAX_BYTES = 10 * 1024 * 1024 // 10MB
const BUCKET = 'study_image' // 너희가 사용 중인 버킷명

/** 액션 결과 타입(throw 금지) */
export type StudyActionResult =
  | { ok: true; id: string; message?: string }
  | { ok: false; message: string }

/** 상세 타입 */
export interface StudyDetail {
  id: string
  title: string
  description: string
  region: string
  region_depth: string | null
  category: string | null
  banner_image: string | null
}

/** 상세 조회 */
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

  const dto: StudyDetail = {
    id: data.id,
    title: data.title,
    description: data.description,
    region: data.region,
    region_depth: data.region_depth ?? null,
    category: data.category ?? null,
    banner_image: data.banner_image ?? null,
  }
  return { ok: true, data: dto }
}

/** 배너 업로드(공용) */
async function uploadBanner(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
  objectName: string // 생성: 'new' 같은 임시, 수정: 기존 id
): Promise<{ ok: true; url: string } | { ok: false; message: string }> {
  if (file.size > MAX_BYTES)
    return { ok: false, message: '이미지 용량이 10MB를 초과했습니다.' }
  if (!ALLOWED_MIME.includes(file.type as (typeof ALLOWED_MIME)[number])) {
    return { ok: false, message: 'jpeg, png, gif 파일만 업로드할 수 있습니다.' }
  }

  const ext = file.name?.split('.').pop()?.toLowerCase() ?? 'png'
  const filename = `${objectName}-${Date.now()}.${ext}`

  const up = await supabase.storage.from(BUCKET).upload(filename, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type,
  })
  if (up.error) return { ok: false, message: '배너 업로드에 실패했습니다.' }

  const pub = supabase.storage.from(BUCKET).getPublicUrl(up.data.path)
  return { ok: true, url: pub.data.publicUrl }
}

/** 내부 공용: 생성/수정 통합 로직 */
async function saveStudyCore(fd: FormData): Promise<StudyActionResult> {
  const supabase = await createClient()

  // 인증
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()
  if (userErr) return { ok: false, message: userErr.message }
  if (!user) return { ok: false, message: '로그인이 필요합니다.' }

  // 입력값
  const id = String(fd.get('id') ?? '').trim() // '' 이면 생성
  const title = String(fd.get('title') ?? '').trim()
  const description = String(fd.get('description') ?? '').trim()
  const region = String(fd.get('region') ?? '').trim()
  const region_depth = String(fd.get('regionDepth') ?? '').trim() || null // 공백 → null
  const category = String(fd.get('category') ?? '').trim() || null

  // 배너 파일
  const fileEntry = fd.get('banner')
  const file =
    fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null

  // 공통 필수값(페이지 요구사항에 맞춤)
  if (!title || !description || !region) {
    return { ok: false, message: '필수 값이 누락되었습니다.' }
  }

  const isUpdate = id.length > 0

  // 수정 시 기존 배너 유지값(''이면 null 취급)
  const keepUrl = isUpdate
    ? ((): string | null => {
        const raw = fd.get('banner_keep')
        const s = typeof raw === 'string' ? raw : ''
        return s.length ? s : null
      })()
    : null

  // 배너 업로드 or 유지
  let bannerUrl: string | null = null
  if (file) {
    const up = await uploadBanner(supabase, file, isUpdate ? id : 'new')
    if (!up.ok) return { ok: false, message: up.message }
    bannerUrl = up.url
  } else if (isUpdate) {
    bannerUrl = keepUrl // 새 파일이 없으면 유지(null 가능)
  }

  // 수정
  if (isUpdate) {
    // owner만 수정
    const payload: StudyRoomUpdate = {
      title,
      description,
      region,
      region_depth, // Update 타입은 null 허용
      category, // Update 타입은 null 허용
      banner_image: bannerUrl ?? undefined, // 안 바꾸면 undefined로 컬럼 미포함
    }

    const { error } = await supabase
      .from('study_room')
      .update(payload)
      .eq('id', id)
      .eq('owner_id', user.id) // owner만
    if (error)
      return { ok: false, message: '수정에 실패했어요. 다시 시도해 주세요.' }

    return { ok: true, id, message: '스터디가 수정되었습니다.' }
  }

  // 생성
  const insertPayload: StudyRoomInsert = {
    owner_id: user.id,
    title,
    description,
    region,
    region_depth,
    category,
    banner_image: bannerUrl ?? null,
  }

  const { data, error } = await supabase
    .from('study_room')
    .insert(insertPayload)
    .select('id')
    .single()

  if (error || !data) {
    return { ok: false, message: '생성에 실패했어요. 다시 시도해 주세요.' }
  }

  return { ok: true, id: data.id, message: '스터디가 생성되었습니다.' }
}

/** 공개 액션 */
export async function createStudyAction(
  _prev: StudyActionResult | null,
  fd: FormData
): Promise<StudyActionResult> {
  fd.delete('id') // 생성 보장
  return saveStudyCore(fd)
}

export async function updateStudyAction(
  _prev: StudyActionResult | null,
  fd: FormData
): Promise<StudyActionResult> {
  return saveStudyCore(fd)
}
