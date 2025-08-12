"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface PaginationAdvancedProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  className?: string
}

export function PaginationAdvanced({ currentPage, totalPages, baseUrl, className = "" }: PaginationAdvancedProps) {
  const [jumpPage, setJumpPage] = useState("")

  // Validate and clamp page input
  const validateAndClampPage = (value: string): number => {
    const num = Number.parseInt(value)
    if (isNaN(num) || num < 1) return 1
    if (num > totalPages) return totalPages
    return num
  }

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const targetPage = validateAndClampPage(jumpPage)
    window.location.href = `${baseUrl}?page=${targetPage}`
  }

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 4) {
        pages.push("ellipsis")
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 3) {
        pages.push("ellipsis")
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Previous Button */}
      <div className="flex items-center gap-2">
        {currentPage > 1 ? (
          <Link href={`${baseUrl}?page=${currentPage - 1}`}>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <ChevronLeft className="w-4 h-4" />
              Trước
            </Button>
          </Link>
        ) : (
          <Button variant="outline" disabled className="flex items-center gap-2 bg-transparent">
            <ChevronLeft className="w-4 h-4" />
            Trước
          </Button>
        )}
      </div>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) =>
          page === "ellipsis" ? (
            <div key={`ellipsis-${index}`} className="px-2">
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>
          ) : (
            <Link key={page} href={`${baseUrl}?page=${page}`}>
              <Button variant={currentPage === page ? "default" : "ghost"} size="sm" className="min-w-[40px]">
                {page}
              </Button>
            </Link>
          ),
        )}
      </div>

      {/* Next Button */}
      <div className="flex items-center gap-2">
        {currentPage < totalPages ? (
          <Link href={`${baseUrl}?page=${currentPage + 1}`}>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              Sau
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <Button variant="outline" disabled className="flex items-center gap-2 bg-transparent">
            Sau
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Jump to Page */}
      <form onSubmit={handleJumpSubmit} className="flex items-center gap-2">
        <span className="text-sm text-slate-600 whitespace-nowrap">Đến trang:</span>
        <Input
          type="text"
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          placeholder="1"
          className="w-16 text-center"
          min="1"
          max={totalPages}
        />
        <Button type="submit" size="sm" variant="outline">
          Đi
        </Button>
      </form>
    </div>
  )
}
