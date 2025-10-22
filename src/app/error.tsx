'use client'

import '@/styles/loading-error/status.css'

interface Props {
  error: Error
  reset: () => void
}

export default function Error({ error, reset }: Props) {
  return (
    <div className="error-page">
      <div className="status-card">
        <span className="status-error-icon">⚠️</span>
        <p>{error.message}</p>
        <button className="status-button" onClick={reset}>
          복구 하기
        </button>
      </div>
    </div>
  )
}
