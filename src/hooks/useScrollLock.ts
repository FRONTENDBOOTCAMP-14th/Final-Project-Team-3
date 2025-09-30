import { useEffect } from 'react'

export default function useScrollLock(
  isLocked: boolean,
  elementsClassName: string | string[]
) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!isLocked) return

    const bodyOverflowStyle = document.body.style.overflow
    const bodyPaddingRight = document.body.style.paddingRight

    const scrollWidth = window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollWidth}px`

    const htmlElementLists = Array.isArray(elementsClassName)
      ? elementsClassName
      : [elementsClassName]

    const originalStyles = new Map<HTMLElement, string>()

    htmlElementLists.forEach((selector) => {
      const element = document.querySelector(selector) as HTMLElement
      if (element) {
        const current = window.getComputedStyle(element).paddingRight

        originalStyles.set(element, current)
        const currentValue = parseInt(current || '0', 10)
        const newValue = currentValue + scrollWidth

        element.style.paddingRight = `${newValue}px`
      }
    })

    return () => {
      document.body.style.overflow = bodyOverflowStyle
      document.body.style.paddingRight = bodyPaddingRight

      originalStyles.forEach((_, element) => {
        element.style.paddingRight = ''
      })
    }
  }, [elementsClassName, isLocked])
}
