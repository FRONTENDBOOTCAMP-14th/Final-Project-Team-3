'use client'

import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'

import '@/styles/pagination-List/Pagination-List.css'

interface PaginationListProps<T extends { id: string | number }> {
  items: T[]
  itemsPerPage?: number
  renderItem: (item: T) => ReactNode
  className?: string
}

export default function PaginationList<T extends { id: string | number }>({
  items,
  itemsPerPage = 10,
  renderItem,
  className = '',
}: PaginationListProps<T>) {
  const [currentPage, setCurrentPage] = useState(0)

  const totalPages = Math.ceil(items.length / itemsPerPage)

  const currentItems = useMemo(() => {
    const startIndex = currentPage * itemsPerPage
    return items.slice(startIndex, startIndex + itemsPerPage)
  }, [items, currentPage, itemsPerPage])

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0))
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))

  if (!items || items.length === 0) {
    return <p className="pagination-empty">표시할 항목이 없습니다.</p>
  }

  return (
    <div className={`pagination-wrapper ${className}`}>
      <button
        className="pagination-arrow pagination-prev"
        onClick={handlePrevPage}
        aria-label="이전 페이지"
        disabled={currentPage === 0}
      >
        ◀
      </button>

      <ul className="pagination-list">
        {currentItems.map((item) => (
          <li key={item.id} className="pagination-item">
            {renderItem(item)}
          </li>
        ))}
      </ul>

      <button
        className="pagination-arrow pagination-next"
        onClick={handleNextPage}
        aria-label="다음 페이지"
        disabled={currentPage === totalPages - 1}
      >
        ▶
      </button>

      <p className="pagination-info">
        {currentPage + 1} / {totalPages}
      </p>
    </div>
  )
}
