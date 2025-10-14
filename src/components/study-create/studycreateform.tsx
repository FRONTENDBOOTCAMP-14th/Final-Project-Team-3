'use client'

import '@/styles/study-create/study-create.css'
import { useRouter } from 'next/navigation'
import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'

import supabase from '@/libs/supabase/client'

import { createStudyAction, type StudyActionResult } from './actions'
import TitleField from './fields/TitleField'
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

export default function StudyCreateFormShell() {
  const router = useRouter()

  // React 19 시그니처 강제 타입 지정(프로젝트 타입 정리 전까지)
  const [result, formAction] = (
    useActionState as unknown as <T>(
      action: (prev: T, formData: FormData) => Promise<T> | T,
      initial: T
    ) => [T, (formData: FormData) => void, boolean]
  )(async (prev: StudyActionResult | null, formData: FormData) => {
    const res = await createStudyAction(prev, formData)
    if (res.ok) router.push(`/study-detail/${res.id}`)
    return res
  }, null)

  return (
    <form className="study-form" action={formAction}>
      <TitleField />
      <BannerUploader />
      <CategoryField />
      <RegionField />
      <DescriptionField />

      <div className="submit-row">
        <SubmitButton />
      </div>

      {result && !result.ok && (
        <p className="form-alert form-alert--error" role="alert" aria-live="polite">
          {result.message}
        </p>
      )}
    </form>
  )
}