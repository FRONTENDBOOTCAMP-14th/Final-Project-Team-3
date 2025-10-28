import '@/styles/loading-error/status.css'
import Spinner from '@/components/ui/spinner'

export default function Loading() {
  return (
    <div className="loading-page">
      <div className="status-card">
        <Spinner />
        <p>로딩 중...</p>
      </div>
    </div>
  )
}
