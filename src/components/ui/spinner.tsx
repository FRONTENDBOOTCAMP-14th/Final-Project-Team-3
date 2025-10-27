import '@/styles/ui/spinner.css'

interface SpinnerProps {
  sizeRem?: number
  strokePx?: number
  label?: string
  className?: string
}

export default function Spinner({
  sizeRem,
  strokePx,
  label = '로딩 중…',
  className = '',
}: SpinnerProps) {
  const style: React.CSSProperties = {
    ...(sizeRem ? { ['--spinner-size' as any]: `${sizeRem}rem` } : {}),
    ...(strokePx ? { ['--spinner-stroke' as any]: `${strokePx}px` } : {}),
  }

  return (
    <div
      className={`ui-spinner ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
      style={style}
    />
  )
}
