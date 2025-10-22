'use client'
import { useEffect } from 'react'
import { toast } from 'sonner'

interface Props {
  ok: boolean
  message: string | null | undefined
}

function ToastMessage({ ok, message }: Props) {
  useEffect(() => {
    if (!ok && message) {
      toast.error(message, {
        action: {
          label: '확인',
          onClick: () => {},
        },
      })
    } else {
      if (message) {
        toast.success(message, {
          action: {
            label: '확인',
            onClick: () => {},
          },
        })
      }
    }
  }, [message, ok])

  return <div></div>
}

export default ToastMessage
