'use client'

import { useEffect, useRef, useState } from 'react'

const ALLOWED = new Set(['image/jpeg', 'image/png'])
const MAX_SIZE = 5 * 1024 * 1024

interface Props {
  value: File | null
  onChange: (f: File | null) => void
  externalPreview?: string
}

export default function ProfileImgUploader({
  value,
  onChange,
  externalPreview,
}: Props) {
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else if (externalPreview) {
      setPreviewUrl(externalPreview)
    } else {
      setPreviewUrl('')
    }
  }, [value, externalPreview])

  const validate = (f: File) => {
    if (!ALLOWED.has(f.type)) {
      alert('JPG, PNG 형식만 가능합니다.')
      return false
    }
    if (f.size > MAX_SIZE) {
      alert('최대 5MB까지 업로드할 수 있습니다.')
      return false
    }
    return true
  }

  const handleFile = (file: File | null) => {
    if (!file) {
      onChange(null)
      if (inputRef.current) inputRef.current.value = ''
      return
    }
    if (!validate(file)) {
      if (inputRef.current) inputRef.current.value = ''
      return
    }
    onChange(file)
  }

  return (
    <div
      className={`user-avatar-wrapper ${isDragging ? 'dragging' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFile(e.dataTransfer.files?.[0] ?? null)
      }}
      role="button"
      tabIndex={0}
    >
      {previewUrl ? (
        <img src={previewUrl} alt="이미지 미리보기" className="user-avatar" />
      ) : (
        <div className="avatar-placeholder">
          <span className="avatar-upload-icon">📷</span>
        </div>
      )}

      {previewUrl && (
        <button
          type="button"
          className="uploader-clear-btn"
          onClick={(e) => {
            e.stopPropagation()
            handleFile(null)
          }}
          aria-label="이미지 삭제"
        >
          <span>x</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.currentTarget.files?.[0] ?? null)}
      />
    </div>
  )
}
