'use client'
import { useEffect, useRef, useState } from 'react'

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/gif'])
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

interface Props {
  value: File | null
  onChange: (f: File | null) => void
  isEdit?: boolean
}

export default function BannerUploader({
  value,
  onChange,
  isEdit = false,
}: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [_dragDepth, setDragDepth] = useState(0) // ✅ 드래그 안정화
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
    try {
      const dt = new DataTransfer()
      inputRef.current.files = dt.files
    } catch {
      // ignore
    }
    inputRef.current.value = ''
  }

  const validate = (f: File) => {
    if (!ALLOWED.has(f.type)) {
      alert('JPEG, PNG, GIF 파일만 업로드할 수 있습니다.')
      return false
    }
    if (f.size > MAX_SIZE) {
      alert('파일 용량은 최대 10MB까지 업로드할 수 있습니다.')
      return false
    }
    return true
  }

  const applyFile = (f: File | null, fromDrag = false) => {
    if (!f) {
      setLocalFile(null)
      onChange?.(null)
      resetNative()
      return
    }
    if (!validate(f)) {
      resetNative()
      return
    }
    setLocalFile(f)
    onChange?.(f)

    if (fromDrag && inputRef.current) {
      try {
        const dt = new DataTransfer()
        dt.items.add(f)
        inputRef.current.files = dt.files
      } catch {
        // ignore
      }
    }
  }

  const helperId = 'banner-helper'

  return (
    <fieldset className="banner-fieldset form-field--full">
      <legend className="banner-legend">배너 이미지 (선택)</legend>

      {isEdit && !previewUrl && (
        <p className="edit-banner-notice" role="note">
          배너 이미지를 수정하지 않으면{' '}
          <strong>기존 이미지가 그대로 유지</strong>됩니다.
        </p>
      )}

      <input
        ref={inputRef}
        className="banner-input"
        name="banner"
        type="file"
        accept="image/jpeg,image/png,image/gif"
        onChange={(e) => applyFile(e.currentTarget.files?.[0] ?? null)}
        onPaste={(e) => {
          const f = e.clipboardData?.files?.[0]
          if (f) applyFile(f)
        }}
        aria-describedby={helperId} // ✅ 접근성 연결
      />

      <div
        className={`banner-dropzone ${isDragging ? 'is-dragging' : ''} ${previewUrl ? 'has-image' : ''}`}
        onDragEnter={(e) => {
          e.preventDefault()
          setDragDepth((d) => {
            const next = d + 1
            if (next === 1) setIsDragging(true)
            return next
          })
        }}
        onDragOver={(e) => {
          e.preventDefault()
          e.dataTransfer.dropEffect = 'copy'
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setDragDepth((d) => {
            const next = Math.max(0, d - 1)
            if (next === 0) setIsDragging(false)
            return next
          })
        }}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          setDragDepth(0)
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
              draggable={false}
              decoding="async"
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
          <div className="banner-empty" id={helperId}>
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
