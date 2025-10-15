'use client'
import { useEffect, useRef, useState } from 'react'

interface Props {
  value: File | null
  onChange: (f: File | null) => void
}

export default function BannerUploader({ value, onChange }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!value) {
      setPreviewUrl('')
      return
    }
    const url = URL.createObjectURL(value)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [value])

  const onFile = (file: File | null, opts?: { fromDrag?: boolean }) => {
    if (!file) {
      onChange(null)
      if (inputRef.current) {
        inputRef.current.value = ''
        const dt = new DataTransfer()
        inputRef.current.files = dt.files
      }
      return
    }
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.')
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    onChange(file)

    if (opts?.fromDrag && inputRef.current) {
      const dt = new DataTransfer()
      dt.items.add(file)
      inputRef.current.files = dt.files
    }
  }

  return (
    <fieldset className="banner-fieldset form-field--full">
      <legend className="banner-legend">프로필 이미지 (선택)</legend>
      <input
        ref={inputRef}
        className="banner-input"
        name="banner"
        type="file"
        accept="image/*"
        onChange={(e) => onFile(e.currentTarget.files?.[0] ?? null)}
      />

      <div
        className={`banner-dropzone ${isDragging ? 'is-dragging' : ''} ${previewUrl ? 'has-image' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setIsDragging(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          const file = e.dataTransfer.files?.[0] ?? null
          onFile(file, { fromDrag: true })
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onClick={() => inputRef.current?.click()}
        aria-label="프로필 이미지 드래그 앤 드롭 또는 클릭으로 업로드"
      >
        {previewUrl ? (
          <>
            <img
              className="banner-image"
              src={previewUrl}
              alt="프로필 이미지 미리보기"
              draggable={false}
            />
            <button
              type="button"
              className="banner-delete"
              aria-label="프로필이 이미지 삭제"
              onClick={(e) => {
                e.stopPropagation()
                onFile(null)
              }}
            >
              <span className="banner-delete__icon" aria-hidden="true">
                ×
              </span>
            </button>
          </>
        ) : (
          <div className="banner-empty">
            <span className="banner-empty-icon">📎</span>
            <p className="banner-empty-text">
              이미지를 드래그해 놓거나 <u>클릭</u>하여 업로드
              <br />
              <small className="banner-empty-sub">
                ※ 이미지를 선택하지 않으면 기본 이미지가 적용됩니다.
              </small>
            </p>
          </div>
        )}
      </div>
    </fieldset>
  )
}
