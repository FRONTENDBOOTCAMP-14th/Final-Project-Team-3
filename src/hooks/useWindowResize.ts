'use client'
import { useEffect, useState } from 'react'

export function useWindowResize() {
  const [size, setSize] = useState<number | null>(null)

  useEffect(() => {
    const resizeHandler = () => {
      setSize(window.innerWidth)
    }

    resizeHandler()

    window.addEventListener('resize', resizeHandler)

    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])
  return size
}
