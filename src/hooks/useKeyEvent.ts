import { useEffect } from 'react'

export default function useKeyEvent(
  keys: string[] | string,
  callback: () => void,
  state: boolean
) {
  useEffect(() => {
    if (!state) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const keyList = Array.isArray(keys) ? keys : [keys]
      if (keyList.includes(e.key)) {
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.addEventListener('keydown', handleKeyDown)
    }
  }, [callback, keys, state])
}
