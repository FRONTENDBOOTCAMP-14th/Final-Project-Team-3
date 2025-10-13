'use client'

import '@/styles/study-create/study-create.css'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import supabase from '../../libs/supabase/client'

import BannerUploader from './fields/BannerUploader'
import CategoryField from './fields/CategoryField'
import DescriptionField from './fields/DescriptionField'
import RegionField from './fields/RegionField'

const DEFAULT_BANNER = '/images/no-image.png'

export default function StudyCreateForm() {
  const router = useRouter()

  // 상태
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [category, setCategory] = useState('')
  const [region, setRegion] = useState('')
  const [regionDepth, setRegionDepth] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const { data: auth } = await supabase.auth.getUser()
    const user = auth.user
    if (!user) return alert('로그인이 필요합니다.')

    const title = String(formData.get('title') ?? '').trim()
    const rawCategory = String(formData.get('category') ?? '').trim()
    const otherCategory = String(formData.get('categoryOther') ?? '').trim()
    const region = String(formData.get('region') ?? '').trim()
    const regionDepth = String(formData.get('regionDepth') ?? '').trim()
    const description = String(formData.get('description') ?? '').trim()
    const banner = (formData.get('banner') as File | null) ?? null

    // 기타 처리
    const finalCategory = rawCategory === 'other' ? otherCategory : rawCategory
    if (!finalCategory) return alert('카테고리를 입력하거나 선택해 주세요.')

    // 배너 업로드
    let bannerPublicUrl: string | null = null
    if (banner && banner.size > 0) {
      const path = `banners/${Date.now()}_${banner.name}`
      const { error: uploadErr } = await supabase.storage
        .from('study-banners')
        .upload(path, banner, { cacheControl: '3600', upsert: true })
      if (uploadErr) return alert(`이미지 업로드 실패: ${uploadErr.message}`)
      const { data } = supabase.storage.from('study_banners').getPublicUrl(path)
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

    if (error) return alert(`생성 실패: ${error.message}`)
    router.push(`/study-detail/${data.id}`)
  }

  return (
    <form className="study-form" onSubmit={handleSubmit}>
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

      {/* 배너 */}
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
        <button type="submit" className="submit-button">
          만들기
        </button>
      </div>
    </form>
  )
}
