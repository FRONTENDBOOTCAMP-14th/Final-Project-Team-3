interface PasswordHintProps {
  isValid: boolean
}

export default function PasswordHint({ isValid }: PasswordHintProps) {
  return (
    <ul className={`password-hint ${isValid ? 'valid' : 'invalid'}`}>
      <li>영문/숫자/특수문자 중 2가지 이상 포함</li>
      <li>8자 이상 32자 이하 입력 (공백 제외)</li>
      <li>연속 3자 이상 동일한 문자/숫자 제외</li>
    </ul>
  )
}
