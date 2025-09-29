import type React from 'react'
import { useCallback, useEffect } from 'react'

// Focus Trap을 위한 커스텀 Hooks
// React.RefObject를 Props로 받는다
export default function useFocusTrap(ref: React.RefObject<HTMLElement | null>) {
  const handleKeydown = useCallback(
    (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const trapElement = ref.current
      if (!trapElement) return

      // Tab키로 포커스 할 수 있는 모든 요소를 가져옴
      const focusAbleElement = trapElement.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabIndex]:not([tabIndex="-1"])'
      )

      if (focusAbleElement.length === 0) return

      const firstElement = focusAbleElement[0] as HTMLElement
      const lastElement = focusAbleElement[
        focusAbleElement.length - 1
      ] as HTMLElement

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    },
    [ref]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [handleKeydown])

  useEffect(() => {
    if (ref.current) {
      const firstFocusable = ref.current.querySelector(
        'a[href], button:not([disabled]), input:not([disabled]), [tabIndex]:not([tabIndex="-1"])'
      )

      ;(firstFocusable as HTMLElement)?.focus()
    }
  }, [ref])
}
