'use client'

interface Props {
  error: Error
  reset: () => void
}

export default function Error({ error, reset }: Props) {
  return (
    <div>
      {error.message}
      <div>
        <button onClick={reset}>복구 하기</button>
      </div>
    </div>
  )
}
