'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  showPreviousNext?: boolean
  showFirstLast?: boolean
  maxPageButtons?: number
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  showPreviousNext = true,
  showFirstLast = false,
  maxPageButtons = 5
}: PaginationProps) {
  if (totalPages <= 1) return null

  const createPageUrl = (page: number) => {
    if (page === 1) return baseUrl
    return `${baseUrl}?page=${page}`
  }

  const getPageNumbers = () => {
    const pages: number[] = []
    const halfRange = Math.floor(maxPageButtons / 2)
    let start = Math.max(1, currentPage - halfRange)
    let end = Math.min(totalPages, start + maxPageButtons - 1)
    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1)
    }
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  const pageNumbers = getPageNumbers()
  const showEllipsisStart = pageNumbers[0] > 1
  const showEllipsisEnd = pageNumbers[pageNumbers.length - 1] < totalPages

  return (
    <nav className="flex items-center justify-center gap-2 mt-8" role="navigation" aria-label="pagination">
      {showFirstLast && (
        <Button variant="outline" size="sm" asChild disabled={currentPage === 1}>
          <Link href={createPageUrl(1)}><ChevronsLeft className="h-4 w-4" /></Link>
        </Button>
      )}
      {showPreviousNext && (
        <Button variant="outline" size="sm" asChild disabled={currentPage === 1}>
          <Link href={createPageUrl(currentPage - 1)}><ChevronLeft className="h-4 w-4" /></Link>
        </Button>
      )}
      {showEllipsisStart && totalPages > maxPageButtons && (
        <Button variant="outline" size="sm" asChild>
          <Link href={createPageUrl(1)}>1</Link>
        </Button>
      )}
      {showEllipsisStart && pageNumbers[0] > 2 && (
        <span className="px-2 text-muted-foreground">...</span>
      )}
      {pageNumbers.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? 'default' : 'outline'}
          size="sm"
          asChild
        >
          <Link href={createPageUrl(page)}>{page}</Link>
        </Button>
      ))}
      {showEllipsisEnd && pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
        <span className="px-2 text-muted-foreground">...</span>
      )}
      {showEllipsisEnd && totalPages > maxPageButtons && (
        <Button variant="outline" size="sm" asChild>
          <Link href={createPageUrl(totalPages)}>{totalPages}</Link>
        </Button>
      )}
      {showPreviousNext && (
        <Button variant="outline" size="sm" asChild disabled={currentPage === totalPages}>
          <Link href={createPageUrl(currentPage + 1)}><ChevronRight className="h-4 w-4" /></Link>
        </Button>
      )}
      {showFirstLast && (
        <Button variant="outline" size="sm" asChild disabled={currentPage === totalPages}>
          <Link href={createPageUrl(totalPages)}><ChevronsRight className="h-4 w-4" /></Link>
        </Button>
      )}
    </nav>
  )
}
