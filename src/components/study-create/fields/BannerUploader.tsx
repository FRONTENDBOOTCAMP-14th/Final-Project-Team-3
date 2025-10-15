'use client'
import { useEffect, useRef, useState } from 'react'

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/gif'])

interface Props {
  value: File | null
  onChange: (f: File | null) => void
}

interface Props {
  value: File | null
  onChange: (f: File | null) => void
}

export default function BannerUploader({ value, onChange }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [localFile, setLocalFile] = useState<File | null>(value ?? null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const file = value ?? localFile

  useEffect(() => {
    if (!file) {
      setPreviewUrl('')
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const resetNative = () => {
    if (!inputRef.current) return
    const dt = new DataTransfer()
    inputRef.current.files = dt.files
    inputRef.current.value = ''
  }

  const applyFile = (f: File | null, fromDrag = false) => {
    if (!f) {
      setLocalFile(null)
      onChange?.(null) // ← ✅ 안전 호출
      resetNative()
      return
    }
    if (!ALLOWED.has(f.type)) {
      alert('JPEG, PNG, GIF 파일만 업로드할 수 있습니다.')
      resetNative()
      return
    }

    setLocalFile(f)
    onChange?.(f) // ← ✅ 안전 호출

    if (fromDrag && inputRef.current) {
      const dt = new DataTransfer()
      dt.items.add(f)
      inputRef.current.files = dt.files
    }
  }

  return (
    <fieldset className="banner-fieldset form-field--full">
      <legend className="banner-legend">배너 이미지 (선택)</legend>

      <input
        ref={inputRef}
        className="banner-input"
        name="banner"
        type="file"
        // 3종만 선택 가능하게
        accept=".jpeg,.png,.gif"
        onChange={(e) => applyFile(e.currentTarget.files?.[0] ?? null)}
      />

      <div
        className={`banner-dropzone ${isDragging ? 'is-dragging' : ''} ${previewUrl ? 'has-image' : ''}`}
        onDragEnter={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          e.dataTransfer.dropEffect = 'copy'
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setIsDragging(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          const file = e.dataTransfer.files?.[0] ?? null
          applyFile(file, true)
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
        aria-label="배너 이미지 드래그 앤 드롭 또는 클릭으로 업로드"
      >
        {previewUrl ? (
          <>
            <img
              className="banner-image"
              src={previewUrl}
              alt="배너 미리보기"
              draggable={false}
            />

            <button
              type="button"
              className="banner-delete"
              aria-label="배너 이미지 삭제"
              onClick={(e) => {
                e.stopPropagation()
                applyFile(null)
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
                ※ 이미지를 선택하지 않으면 기본 배너가 적용됩니다.
                <br />※ 지원: JPEG, PNG, GIF / 최대 10MB
              </small>
            </p>
          </div>
        )}
      </div>
    </fieldset>
  )
}
