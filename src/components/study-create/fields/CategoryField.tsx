'use client'

import InlineSelect from '@/components/study-create/ui/InlineSelect'
import { STUDY_CATEGORIES } from '@/types/categories'

interface Props {
  value: string
  onChange: (v: string) => void
}

export default function CategoryField({ value, onChange }: Props) {
  const options = [
    ...STUDY_CATEGORIES.map((c) => ({ label: c, value: c })),
    { label: '기타(직접 입력)', value: 'other' },
  ]

  return (
    <>
      <div className="form-field form-field--full">
        <label className="field-label" htmlFor="category">
          카테고리
        </label>
        <InlineSelect
          name="category"
          value={value}
          onChange={onChange}
          options={options}
          placeholder="카테고리 선택"
        />
      </div>

      {value === 'other' && (
        <div className="form-field form-field--full">
          <label className="field-label" htmlFor="categoryOther">
            카테고리 직접 입력
          </label>
          <input
            id="categoryOther"
            name="categoryOther"
            className="field-control"
            type="text"
            placeholder="예: 러닝, 베이킹, 창업 스터디 등"
            required
          />
          <p className="field-hint">
            ※ ‘기타’를 선택하면 직접 카테고리를 입력해 주세요.
          </p>
        </div>
      )}
    </>
  )
}
