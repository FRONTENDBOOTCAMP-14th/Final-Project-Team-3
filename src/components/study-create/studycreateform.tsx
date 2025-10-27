'use client'

import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'

import BannerUploader from '@/components/study-create/fields/BannerUploader'
import CategoryField from '@/components/study-create/fields/CategoryField'
import DescriptionField from '@/components/study-create/fields/DescriptionField'
import RegionField from '@/components/study-create/fields/RegionField'
import ToastMessage from '@/components/ui/toast-message'
import {
  createStudyAction,
  type StudyActionResult,
} from '@/libs/supabase/api/study-update-edit'

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

  // 로컬 상태
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [category, setCategory] = useState('')
  const [region, setRegion] = useState('')
  const [regionDepth, setRegionDepth] = useState('')

  // 서버 액션을 직접 연결
  const [result, formAction] = useActionState<
    StudyActionResult | null,
    FormData
  >(createStudyAction, null)

  useEffect(() => {
    if (result?.ok) router.push(`/study-detail/${result.id}`)
  }, [result, router])

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

      {/* 배너 (미리보기는 state, 전송은 name=banner) */}
      <BannerUploader value={bannerFile} onChange={setBannerFile} />

      {/* 카테고리/지역 */}
      <CategoryField value={category} onChange={setCategory} />
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

      {/* 실패 메시지 */}
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
