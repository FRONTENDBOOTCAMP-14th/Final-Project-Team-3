'use client'

import '@/styles/sign-up/sign-up.css'
import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'

import Button from '@/components/ui/button'

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
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
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
    />
  </div>
)

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPasswordValid, setIsPasswordValid] = useState(true)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const valid = validatePassword(password)
    setIsPasswordValid(valid)
    if (valid && password === confirmPassword) {
      alert('가입 완료!')
    }
  }

  return (
    <form className="sign-up-form" onSubmit={handleSubmit}>
      <h1 className="form-title">회원가입</h1>

      <InputField
        label="이메일"
        type="email"
        placeholder="example@inflab.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <InputField
        label="비밀번호"
        type="password"
        placeholder="********"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <InputField
        label="비밀번호 확인"
        type="password"
        placeholder="********"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <PasswordHint isValid={isPasswordValid} />

      <Button text="가입하기" type="submit" />
    </form>
  )
}
