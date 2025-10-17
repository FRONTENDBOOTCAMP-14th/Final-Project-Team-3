'use client'

import '@/styles/Pagination-List/Pagination-List.css'
import type { ReactNode } from 'react'
import { useState } from 'react'

interface PaginationListProps<T> {
  items: T[]
  itemsPerPage?: number
  renderItem: (item: T) => ReactNode
  className?: string
}

export default function PaginationList<T>({
  items,
  itemsPerPage = 10,
  renderItem,
  className = '',
}: PaginationListProps<T>) {
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = Math.ceil(items.length / itemsPerPage)

  const startIndex = currentPage * itemsPerPage
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage)

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
  }

  if (items.length === 0) {
    return <p className="pagination-empty">표시할 항목이 없습니다.</p>
  }

  return (
    <div className={`pagination-wrapper ${className}`}>
      {currentPage > 0 && (
        <button
          className="pagination-arrow pagination-prev"
          onClick={handlePrevPage}
          aria-label="이전 페이지"
        >
          ◀
        </button>
      )}

      <ul className="pagination-list">
        {currentItems.map((item, index) => (
          <li key={index} className="pagination-item">
            {renderItem(item)}
          </li>
        ))}
      </ul>

      {currentPage < totalPages - 1 && (
        <button
          className="pagination-arrow pagination-next"
          onClick={handleNextPage}
          aria-label="다음 페이지"
        >
          ▶
        </button>
      )}
    </div>
  )
}
