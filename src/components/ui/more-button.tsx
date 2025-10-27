'use client'

import '@/styles/ui/more-button.css'
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

import Spinner from './spinner'

interface Props {
  isLoading: boolean
}

type MoreButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & Props
>

function MoreButton({ isLoading, ...rest }: MoreButtonProps) {
  return (
    <button className="more-button" {...rest} disabled={isLoading}>
      <span>{isLoading ? '불러오는 중...' : '더 불러오기'}</span>
      {isLoading && <Spinner className="more-button-spinner" />}
    </button>
  )
}

export default MoreButton
