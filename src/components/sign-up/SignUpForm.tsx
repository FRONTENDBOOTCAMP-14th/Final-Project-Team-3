'use client'

import '@/styles/sign-up/sign-up.css'
import type { ChangeEvent } from 'react'
import { useActionState, useEffect, useState } from 'react'

import Button from '@/components/ui/button'

import { signUpAndCreateProfile } from '../../libs/supabase/api/user'
import { validatePassword } from '../../utils/validatePassword'

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
    />
  </div>
)

interface FormState {
  message: string | null
  success: boolean
}

const initialFormState: FormState = {
  message: null,
  success: false,
}

async function signUpAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const nickname = formData.get('nickname') as string

  const valid = validatePassword(password)

  if (!valid) {
    return { message: '비밀번호 규칙을 확인해주세요.', success: false }
  }

  if (password !== confirmPassword) {
    return { message: '비밀번호가 일치하지 않습니다.', success: false }
  }

  try {
    await signUpAndCreateProfile({ email, password, nickname })

    return {
      message: '회원가입 성공! 이메일을 확인해주세요 📧',
      success: true,
    }
  } catch (error: any) {
    console.error(error)
    return {
      message: `회원가입 실패: ${error.message ?? '알 수 없는 오류'}`,
      success: false,
    }
  }
}

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [isPasswordValid, setIsPasswordValid] = useState(true)

  const [state, formAction] = useActionState(signUpAction, initialFormState)

  useEffect(() => {
    if (state.success) {
      alert(state.message)
      setEmail('')
      setPassword('')
      setNickname('')
      setConfirmPassword('')
    }
  }, [state.message, state.success])

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
