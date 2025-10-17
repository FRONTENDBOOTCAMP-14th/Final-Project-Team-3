'use client'
import { useFormStatus } from 'react-dom'

const Button = (props: React.ComponentProps<'button'>) => {
  const { pending } = useFormStatus()

  return (
    <button
      style={{
        padding: '8px 16px',
        backgroundColor: '#0070f3',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
      disabled={pending}
      {...props}
    >
      {pending ? '가입 중...' : '가입하기'}
    </button>
  )
}

export default Button
