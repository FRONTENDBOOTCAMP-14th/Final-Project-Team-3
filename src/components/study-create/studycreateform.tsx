'use client'

import '@/styles/study-create/study-create.css'
import { useRouter } from 'next/navigation'
import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'

import { createStudyAction, type StudyActionResult } from './actions'
import BannerUploader from './fields/BannerUploader'
import CategoryField from './fields/CategoryField'
import DescriptionField from './fields/DescriptionField'
import RegionField from './fields/RegionField'

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

  // UI 표시용 로컬 상태(선택값/미리보기)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [category, setCategory] = useState('')
  const [region, setRegion] = useState('')
  const [regionDepth, setRegionDepth] = useState('')

  // 서버 액션 훅
  const [result, formAction] = (
    useActionState as unknown as <T>(
      fn: (prev: T, fd: FormData) => Promise<T> | T,
      init: T
    ) => [T, (fd: FormData) => void]
  )(async (prev: StudyActionResult | null, fd: FormData) => {
    const res = await createStudyAction(prev, fd)
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

      {/* 배너 (미리보기는 state, 전송은 input[name=banner]) */}
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
