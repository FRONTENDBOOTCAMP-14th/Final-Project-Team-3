'use client'

import '@/styles/study-create/study-create.css'
import { useRouter } from 'next/navigation'
import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'

import supabase from '@/libs/supabase/client'

import BannerUploader from './fields/BannerUploader'
import CategoryField from './fields/CategoryField'
import DescriptionField from './fields/DescriptionField'
import RegionField from './fields/RegionField'

const DEFAULT_BANNER = '/images/no-image.png'

/** 액션 결과 타입 */
type StudyActionResult =
  | { ok: true; id: string }
  | { ok: false; message: string }

/** 실제 비동기 액션(폼 action이 호출) */
async function createStudyAction(
  _prev: StudyActionResult | null,
  formData: FormData
): Promise<StudyActionResult> {
  const { data: auth } = await supabase.auth.getUser()
  const user = auth.user
  if (!user) return { ok: false, message: '로그인이 필요합니다.' }

  // 폼 데이터 읽기
  const title = String(formData.get('title') ?? '').trim()
  const rawCategory = String(formData.get('category') ?? '').trim()
  const otherCategory = String(formData.get('categoryOther') ?? '').trim()
  const region = String(formData.get('region') ?? '').trim()
  const regionDepth = String(formData.get('regionDepth') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const banner = formData.get('banner') as File | null

  const finalCategory = rawCategory === 'other' ? otherCategory : rawCategory
  if (!finalCategory)
    return { ok: false, message: '카테고리를 입력하거나 선택해 주세요.' }

  // PNG만 허용
  if (banner && !['image/png', 'image/jpeg', 'image/gif'].includes(banner.type)) {
    return { ok: false, message: 'jpeg, png, gif 파일만 업로드할 수 있습니다.' }
  }

  // 배너 업로드
  // 파일명 -> 한글/공백으로 인한 Invaid key방지
  let bannerPublicUrl: string | null = null
  if (banner && banner.size > 0) {
    const ext = banner.name.split('.').pop()?.toLowerCase() ?? 'png'
    const path = `${user.id}/banners/${crypto.randomUUID()}_${ext}`

    const { error: uploadErr } = await supabase.storage
      .from('study_image')
      .upload(path, banner, { cacheControl: '3600', upsert: false })

    if (uploadErr) {
      return { ok: false, message: `이미지 업로드 실패: ${uploadErr.message}` }
    }

    // public 버킷 → getPublicUrl 사용
    const { data } = supabase.storage.from('study_image').getPublicUrl(path)
    bannerPublicUrl = data.publicUrl
  }

  const finalBanner = bannerPublicUrl ?? DEFAULT_BANNER

  // DB insert
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

/** 제출 버튼: 폼 상태에 따라 로딩 표시 */
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="submit-button" disabled={pending}>
      {pending ? '만드는 중...' : '만들기'}
    </button>
  )
}

export default function StudyCreateForm() {
  const router = useRouter()

  // (UI용) 선택 컴포넌트들이 요구하는 최소 상태만 유지
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [category, setCategory] = useState('')
  const [region, setRegion] = useState('')
  const [regionDepth, setRegionDepth] = useState('')

  // 액션 래퍼: 성공 시 라우팅

  const [result, formAction, _pending] = (
    useActionState as unknown as <T>(
      action: (prevState: T, formData: FormData) => Promise<T> | T,
      initialState: T
    ) => [T, (formData: FormData) => void, boolean]
  )(async (prev: StudyActionResult | null, formData: FormData) => {
    const res = await createStudyAction(prev, formData)
    if (res.ok) router.push(`/study-detail/${res.id}`)
    return res
  }, null)

  return (
    <form className="study-form" action={formAction}>
      {/* 모임명 */}
      <div className="form-field form-field--full">
        <label className="field-label" htmlFor="title">
          스터디&모임명
        </label>
        <input
          id="title"
          name="title"
          className="field-control"
          type="text"
          required
        />
      </div>

      {/* 배너 (미리보기/UI는 state, 전송은 input[name=banner]) */}
      <BannerUploader value={bannerFile} onChange={setBannerFile} />

      {/* 카테고리 */}
      <CategoryField value={category} onChange={setCategory} />

      {/* 지역/세부지역 */}
      <RegionField
        region={region}
        setRegion={setRegion}
        regionDepth={regionDepth}
        setRegionDepth={setRegionDepth}
      />

      {/* 소개 */}
      <DescriptionField />

      {/* 제출 */}
      <div className="submit-row">
        <SubmitButton />
      </div>

      {/* 실패 메시지 노출 */}
      {result && !result.ok && (
        <p
          className="form-alert form-alert--error"
          role="alert"
          aria-live="polite"
        >
          {result.message}
        </p>
      )}
    </form>
  )
}
