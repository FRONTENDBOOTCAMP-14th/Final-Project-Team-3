'use client'

import '@/styles/sign-up/sign-up.css'
import type { ChangeEvent } from 'react'
import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'

import Button from '@/components/ui/button'
import { signUpAndCreateProfile } from '@/libs/supabase/api/user'
import type { ResultType } from '@/types/apiResultsType'
import { validatePassword } from '@/utils/validatePassword'

interface PasswordHintProps {
  isValid: boolean
}

function PasswordHint({ isValid }: PasswordHintProps) {
  return (
    <ul className={`password-hint ${isValid ? 'valid' : 'invalid'}`}>
      <li>영문/숫자/특수문자 중 2가지 이상 포함</li>
      <li>8자 이상 32자 이하 입력 (공백 제외)</li>
      <li>연속 3자 이상 동일한 문자/숫자 제외</li>
    </ul>
  )
}

interface InputFieldProps {
  label?: string
  type?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  name: string
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  name,
}) => (
  <div style={{ marginBottom: '12px' }}>
    {label && (
      <label style={{ display: 'block', marginBottom: '4px' }}>{label}</label>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
      name={name}
      autoComplete={type === 'password' ? 'off' : ''}
    />
  </div>
)

const initialFormState: ResultType<void> = {
  message: '',
  ok: false,
}

async function signUpAction(
  _prevState: ResultType<void>,
  formData: FormData
): Promise<{ ok: boolean }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const nickname = formData.get('nickname') as string

  const valid = validatePassword(password)

  if (!valid) {
    toast.error('비밀번호 규칙을 확인해주세요.')
    return { ok: false }
  }

  if (password !== confirmPassword) {
    toast.error('비밀번호가 일치하지 않습니다.')

    return { ok: false }
  }

  const res = await signUpAndCreateProfile({
    email,
    password,
    nickname,
  })

  if (res.ok) {
    toast.success(res.message, {
      action: {
        label: '닫기',
        onClick: () => {},
      },
    })
    return { ok: true }
  } else {
    toast.error(res.message, {
      action: {
        label: '닫기',
        onClick: () => {},
      },
    })
    return { ok: false }
  }
}

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [isPasswordValid, _setIsPasswordValid] = useState(true)

  const [state, formAction] = useActionState(signUpAction, initialFormState)

  useEffect(() => {
    if (state.ok) {
      setEmail('')
      setPassword('')
      setNickname('')
      setConfirmPassword('')
    }
  }, [state.ok])

  return (
    <form className="sign-up-form" action={formAction}>
      <h1 className="form-title">회원가입</h1>

      <InputField
        label="이메일"
        type="email"
        placeholder="example@inflab.com"
        value={email}
        name="email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <InputField
        label="닉네임"
        placeholder="닉네임을 입력하세요"
        value={nickname}
        name="nickname"
        onChange={(e) => setNickname(e.target.value)}
      />

      <InputField
        label="비밀번호"
        type="password"
        placeholder="********"
        value={password}
        name="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <InputField
        label="비밀번호 확인"
        type="password"
        placeholder="********"
        value={confirmPassword}
        name="confirmPassword"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <PasswordHint isValid={isPasswordValid} />

      <Button type="submit" />
    </form>
  )
}
