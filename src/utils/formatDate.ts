export const formatDate = (isoString: string) => {
  if (!isoString) return ''

  const date = new Date(isoString)

  const options: Intl.DateTimeFormatOptions = {
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
  }

  const formattedTime = date.toLocaleString('ko-KR', options)

  return formattedTime
}
