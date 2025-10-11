'use client'

export default function DescriptionField() {
  return (
    <div className="form-field form-field--full">
      <label className="field-label" htmlFor="description">
        모임 소개
      </label>
      <textarea
        id="description"
        name="description"
        className="field-control field-control--textarea"
        required
        placeholder='모임에 대해 소개해주세요. 예) "매주 토요일 오후 2시에 만나서 책을 읽고 토론합니다."'
      />
    </div>
  )
}
