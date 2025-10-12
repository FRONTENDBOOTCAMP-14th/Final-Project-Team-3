'use client'
import { useEffect, useRef, useState } from 'react'

interface Opt {
  label: string
  value: string
}

interface Props {
  name: string
  value: string
  onChange: (v: string) => void
  options: Opt[]
  placeholder?: string
  disabled?: boolean
}

export default function InlineSelect({
  name,
  value,
  onChange,
  options,
  placeholder = '선택해주세요',
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const listRef = useRef<HTMLUListElement | null>(null)
  const optionRefs = useRef<(HTMLLIElement | null)[]>([])

  // 바깥 클릭 닫기
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!open) return
      const t = e.target as Node
      if (!buttonRef.current?.contains(t) && !listRef.current?.contains(t)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  // 버튼 키보드: Enter/Space로 열기 + 첫 옵션 포커스
  const onBtnKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen(true)
      requestAnimationFrame(() => optionRefs.current[0]?.focus())
    }
  }

  // 옵션 키보드: Tab/Shift+Tab으로 이동, Enter 선택
  const onOptKeyDown = (e: React.KeyboardEvent<HTMLLIElement>, idx: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onChange(options[idx].value)
      setOpen(false)
      buttonRef.current?.focus()
      return
    }
    if (e.key === 'Tab') {
      const isShift = e.shiftKey
      if (isShift && idx > 0) {
        e.preventDefault()
        optionRefs.current[idx - 1]?.focus()
      } else if (!isShift && idx < options.length - 1) {
        e.preventDefault()
        optionRefs.current[idx + 1]?.focus()
      } else {
        // 첫/마지막에서 기본 Tab 흐름으로 다음/이전 필드로
        setOpen(false)
      }
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      buttonRef.current?.focus()
    }
  }

  const selected = options.find((o) => o.value === value)

  return (
    <div className="moida-select">
      <input type="hidden" name={name} value={value} />

      <button
        ref={buttonRef}
        type="button"
        className="moida-select__button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${name}-panel`}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={onBtnKeyDown}
        disabled={disabled}
      >
        <span
          className={`moida-select__label ${selected ? '' : 'is-placeholder'}`}
        >
          {selected ? selected.label : placeholder}
        </span>
        <span className="moida-select__arrow" aria-hidden="true">
          ▾
        </span>
      </button>

      {open && !disabled && (
        <ul
          ref={listRef}
          id={`${name}-panel`}
          role="listbox"
          tabIndex={-1}
          className="moida-select__panel"
        >
          {options.map((opt, i) => {
            const active = opt.value === value
            return (
              <li
                key={opt.value}
                ref={(el) => {
                  optionRefs.current[i] = el
                }}
                role="option"
                aria-selected={active}
                tabIndex={0}
                className={`moida-select__option ${active ? 'is-active' : ''}`}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                  buttonRef.current?.focus()
                }}
                onKeyDown={(e) => onOptKeyDown(e, i)}
              >
                {opt.label}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
