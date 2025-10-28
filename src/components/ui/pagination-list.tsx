'use client'

import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'

import type { StudyRoom } from '@/libs/supabase'

import '@/styles/pagination-list/pagination-list.css'

import MoreButton from './more-button'

interface PaginationListProps<T extends { id: string | number }> {
  items: T[] | StudyRoom[] | undefined
  itemsPerPage?: number
  renderItem: (items: T[] | StudyRoom[]) => ReactNode
  className?: string
  isDeskTop: boolean
}

export default function PaginationList<T extends { id: string | number }>({
  items,
  itemsPerPage = 8,
  renderItem,
  className = '',
  isDeskTop,
}: PaginationListProps<T>) {
  const [currentPage, setCurrentPage] = useState(0)
  const [currentData, setCurrentData] = useState<StudyRoom[]>([])
  const totalPages = Math.ceil((items?.length ?? 0) / itemsPerPage)

  const currentItems = useMemo(() => {
    const startIndex = currentPage * itemsPerPage
    return items?.slice(startIndex, startIndex + itemsPerPage) ?? []
  }, [items, currentPage, itemsPerPage])

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0))
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))

  useEffect(() => {
    if (currentPage === 0 && items && items.length > 0) {
      const initialItems = items.slice(0, itemsPerPage)
      setCurrentData(initialItems as StudyRoom[])
    }
  }, [currentPage, items, itemsPerPage])

  useEffect(() => {
    if (isDeskTop) {
      setCurrentPage(0)
    }
  }, [isDeskTop])

  const handleMoreBtn = () => {
    const nextPage = Math.min(currentPage + 1, totalPages - 1)

    if (currentPage === totalPages - 1 || totalPages === 0) return

    const startIndex = nextPage * itemsPerPage

    const nextItems = items?.slice(startIndex, startIndex + itemsPerPage) ?? []

    setCurrentData((prev) => [...prev, ...(nextItems as StudyRoom[])])

    setCurrentPage(nextPage)
  }

  if (!items || items.length === 0) {
    return <p className="pagination-empty">표시할 항목이 없습니다.</p>
  }

  return isDeskTop ? (
    <div className={`pagination-wrapper ${className}`}>
      {currentPage !== 0 && (
        <button
          className="pagination-arrow pagination-prev"
          onClick={handlePrevPage}
          aria-label="이전 페이지"
          disabled={currentPage === 0}
        >
          ◀
        </button>
      )}

      <div className="pagination-list">{renderItem(currentItems)}</div>

      {!(currentPage === totalPages - 1) && (
        <button
          className="pagination-arrow pagination-next"
          onClick={handleNextPage}
          aria-label="다음 페이지"
          disabled={currentPage >= totalPages - 1}
        >
          ▶
        </button>
      )}
    </div>
  ) : (
    <>
      <div className="pagination-list">{renderItem(currentData)}</div>
      {!(currentPage === totalPages - 1) && (
        <MoreButton onClick={handleMoreBtn} />
      )}
    </>
  )
}
