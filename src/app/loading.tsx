import '@/styles/loading-error/status.css'

export default function Loading() {
  return (
    <div className="loading-page">
      <div className="status-card">
        <div className="status-spinner" />
        <p>로딩 중...</p>
      </div>
    </div>
  )
}
