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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED.has(file.type)) {
      alert('JPEG 또는 PNG 파일만 업로드할 수 있습니다.')
      return
    }
    if (file.size > MAX_SIZE) {
      alert('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    onChange(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (!file) return

    if (!ALLOWED.has(file.type)) {
      alert('JPEG 또는 PNG 파일만 업로드할 수 있습니다.')
      return
    }
    if (file.size > MAX_SIZE) {
      alert('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    onChange(file)
  }

  const handleRemove = () => {
    onChange(null)
    setPreviewUrl('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div
      className={`profile-img-uploader ${isDragging ? 'dragging' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {previewUrl ? (
        <div className="preview-wrapper">
          <img src={previewUrl} alt="미리보기" className="preview-img" />
          <button
            type="button"
            className="remove-btn"
            onClick={handleRemove}
            aria-label="이미지 제거"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          className="upload-placeholder"
          onClick={() => inputRef.current?.click()}
        >
          <p>
            프로필 이미지를 업로드하거나
            <br />
            드래그해서 추가하세요
          </p>
        </div>
      )}

      <input
        type="file"
        accept="image/jpeg,image/png"
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  )
}
