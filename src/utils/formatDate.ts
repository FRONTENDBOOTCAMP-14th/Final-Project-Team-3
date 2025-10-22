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

export const formatDateSeparator = (isoString: string) => {
  const targetDate = new Date(isoString)
  const now = new Date()

  const targetKST = new Date(
    targetDate.toLocaleString('en-US', { timeZone: 'Asia/Seoul' })
  )
  const nowKST = new Date(
    now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' })
  )

  const targetDay = new Date(targetKST.setHours(0, 0, 0, 0))
  const todayDay = new Date(nowKST.setHours(0, 0, 0, 0))

  const dayDifference = Math.floor(
    (todayDay.getTime() - targetDay.getTime()) / (1000 * 60 * 60 * 24)
  )

  const options = { timeZone: 'Asia/Seoul' }

  if (dayDifference === 0) {
    return '오늘'
  } else if (dayDifference === 1) {
    return '어제'
  } else if (targetDay.getFullYear() === todayDay.getFullYear()) {
    return targetDay.toLocaleString('ko-KR', {
      ...options,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
}
