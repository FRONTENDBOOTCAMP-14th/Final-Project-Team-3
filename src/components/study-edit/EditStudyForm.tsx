'use client'

import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'

import BannerUploader from '@/components/study-create/fields/BannerUploader'
import CategoryField from '@/components/study-create/fields/CategoryField'
import RegionField from '@/components/study-create/fields/RegionField'
import { updateStudyAction } from '@/libs/supabase/api/study-update-edit'
import type {
  StudyActionResult,
  StudyDetail,
} from '@/libs/supabase/api/study-update-edit'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="submit-button" disabled={pending}>
      {pending ? '수정 중…' : '수정 저장'}
    </button>
  )
}

export default function EditStudyForm({ initial }: { initial: StudyDetail }) {
  const router = useRouter()

  // 로컬 상태 (미리보기/선택 값)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [category, setCategory] = useState(initial.category ?? '')
  const [region, setRegion] = useState(initial.region ?? '')
  const [regionDepth, setRegionDepth] = useState(initial.region_depth ?? '')

  // ✅ 서버 액션을 직접 연결 (래퍼 X)
  const [result, formAction] = useActionState<
    StudyActionResult | null,
    FormData
  >(updateStudyAction, null)

  // ✅ 성공 시 라우팅
  useEffect(() => {
    if (result?.ok) router.push(`/study-detail/${result.id}`)
  }, [result, router])

  return (
    <form className="study-form" action={formAction}>
      {/* hidden */}
      <input type="hidden" name="id" value={initial.id} />
      <input
        type="hidden"
        name="banner_keep"
        value={initial.banner_image ?? ''}
      />

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
          defaultValue={initial.title}
        />
      </div>

      {/* 배너: 새 파일을 올리면 교체, 아니면 유지 */}
      <BannerUploader isEdit value={bannerFile} onChange={setBannerFile} />

      {/* 카테고리/지역 */}
      <CategoryField value={category} onChange={setCategory} />
      <RegionField
        region={region}
        setRegion={setRegion}
        regionDepth={regionDepth}
        setRegionDepth={setRegionDepth}
      />

      {/* 소개 */}
      <div className="form-field form-field--full">
        <label className="field-label" htmlFor="description">
          모임 소개
        </label>
        <textarea
          id="description"
          name="description"
          className="field-control field-control--textarea"
          required
          defaultValue={initial.description}
        />
      </div>

      <div className="submit-row">
        <SubmitButton />
      </div>

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
