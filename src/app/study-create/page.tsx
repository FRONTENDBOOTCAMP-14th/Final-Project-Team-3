'use client'

import '@/styles/study-create/study-create.css'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import supabase from '@/libs/supabase'
import { STUDY_CATEGORIES } from '@/types/categories'
import REGION_DATA from '@/types/region'

const DEFAULT_BANNER = '/images/no-image.png'

export default function StudyCreateForm() {
  const router = useRouter()

  const [region, setRegion] = useState('')
  const [regionDepth, setRegionDepth] = useState('')
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  const previewUrl = useMemo(
    () => (bannerFile ? URL.createObjectURL(bannerFile) : ''),
    [bannerFile]
  )
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    },
    [previewUrl]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return setBannerFile(null)
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.')
      e.currentTarget.value = ''
      return
    }
    setBannerFile(file)
  }

  async function createStudy(formData: FormData) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return alert('로그인이 필요합니다.')

    const title = String(formData.get('title') ?? '').trim()
    const category = String(formData.get('category') ?? '').trim()
    const region = String(formData.get('region') ?? '').trim()
    const regionDepth = String(formData.get('regionDepth') ?? '').trim()
    const description = String(formData.get('description') ?? '').trim()
    const banner = formData.get('banner') as File | null

    let bannerPublicUrl: string | null = null
    if (banner && banner.size > 0) {
      const path = `banners/${Date.now()}_${banner.name}`
      const { error: uploadErr } = await supabase.storage
        .from('study-banners')
        .upload(path, banner, {
          cacheControl: '3600',
          upsert: true,
        })
      if (uploadErr) return alert(`이미지 업로드 실패: ${uploadErr.message}`)
      const { data } = supabase.storage.from('study-banners').getPublicUrl(path)
      bannerPublicUrl = data.publicUrl
    }

    const finalBanner = bannerPublicUrl || DEFAULT_BANNER

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

    if (error) return alert(`생성 실패: ${error.message}`)
    router.push(`/study-detail/${data.id}`)
  }

  return (
    <form className="study-form" action={createStudy as any}>
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

      {/* 배너 업로드 */}
      <fieldset className="banner-fieldset form-field--full">
        <legend className="banner-legend">배너 이미지 (선택)</legend>
        <input
          className="banner-input"
          name="banner"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <div className="banner-preview">
          <img src={previewUrl || DEFAULT_BANNER} alt="배너 미리보기" />
        </div>
      </fieldset>

      {/* 카테고리 */}
      <div className="form-field form-field--full">
        <label className="field-label" htmlFor="category">
          카테고리
        </label>
        <select
          id="category"
          name="category"
          className="field-control"
          required
        >
          <option value="">선택해주세요</option>
          {STUDY_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* 지역 */}
      <div className="form-field">
        <label className="field-label" htmlFor="region">
          활동지역
        </label>
        <select
          id="region"
          name="region"
          className="field-control"
          required
          value={region}
          onChange={(e) => {
            setRegion(e.target.value)
            setRegionDepth('')
          }}
        >
          <option value="">광역시/도 선택</option>
          {Object.keys(REGION_DATA).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* 세부지역 */}
      <div className="form-field">
        <label className="field-label" htmlFor="regionDepth">
          세부지역
        </label>
        <select
          id="regionDepth"
          name="regionDepth"
          className="field-control"
          required
          value={regionDepth}
          onChange={(e) => setRegionDepth(e.target.value)}
          disabled={!region}
        >
          <option value="">구/군 선택</option>
          {region &&
            REGION_DATA[region].map((d: string) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
        </select>
      </div>

      {/* 소개 */}
      <div className="form-field form-field--full">
        <label className="field-label" htmlFor="description">
          모임 소개
        </label>
        <textarea
          id="description"
          name="description"
          className="field-control field-control--textarea"
          rows={6}
          required
        />
      </div>

      {/* 제출 */}
      <div className="submit-row">
        <button type="submit" className="submit-button">
          만들기
        </button>
      </div>
    </form>
  )
}
