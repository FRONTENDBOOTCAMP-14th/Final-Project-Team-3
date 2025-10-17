'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  value: File | null
  onChange: (f: File | null) => void
}

export default function ProfileImgUploader({ value, onChange }: Props) {
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

  const onFile = (file: File | null) => {
    if (!file) {
      onChange(null)
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    onChange(file)
  }

  return (
    <div className="profile-uploader">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => onFile(e.currentTarget.files?.[0] ?? null)}
        style={{ display: 'none' }}
      />

      <div
        className={`uploader-box ${isDragging ? 'dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
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
          onFile(e.dataTransfer.files[0])
        }}
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="미리보기" className="uploader-preview" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onFile(null)
              }}
              className="uploader-clear-btn"
            >
              ×
            </button>
          </>
        ) : (
          <span className="uploader-icon">📷</span>
        )}
      </div>
    </div>
  )
}
