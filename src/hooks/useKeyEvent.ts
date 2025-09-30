import { useEffect } from 'react'

export default function useKeyEvent(
  keys: string[] | string,
  callback: () => void,
  state: boolean = true
) {
  useEffect(() => {
    if (!state) return

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      const keyList = Array.isArray(keys) ? keys : [keys]
      if (keyList.includes(e.key)) {
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [callback, keys, state])
}
