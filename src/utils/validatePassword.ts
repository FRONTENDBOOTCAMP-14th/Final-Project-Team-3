export const validatePassword = (password: string): boolean => {
  if (password.length < 8 || password.length > 32) return false
  if (/(\w)\1\1/.test(password)) return false
  const count = [/[a-zA-Z]/, /\d/, /[!@#$%^&*]/].reduce(
    (acc, regex) => acc + Number(regex.test(password)),
    0
  )
  return count >= 2
}
