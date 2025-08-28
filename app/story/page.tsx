"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, Hash, Loader2 } from "lucide-react"
import { createAuthenticatedFetch } from "@/lib/auth"
import { useSearchParams } from "next/navigation"

interface Story {
  id: string
  slug: string
  name: string
  description: string
  type: string
  status: string
  image_url: string | null
  created_by: string | null
  updated_at: string
  created_at: string
}

interface StoriesResponse {
  data: {
    total: number
    page: number
    page_size: number
    items: Story[]
  }
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    })
  } catch {
    return "—"
  }
}

function getStatusColor(status: string): string {
  switch ((status || "").toLowerCase()) {
    case "published":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "unpublish":
      return "bg-red-100 text-red-800 hover:bg-red-100"
    case "draft":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

function getTypeColor(type: string): string {
  switch ((type || "").toUpperCase()) {
    case "TTV":
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
    case "NOVEL":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100"
    case "MANGA":
      return "bg-orange-100 text-orange-800 hover:bg-orange-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

export default function StoriesIndex() {
  const searchParams = useSearchParams()
  const currentPage = Number.parseInt(searchParams.get("page") || "1")

  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    page_size: 20,
    totalPages: 0,
  })

  useEffect(() => {
    async function fetchStories() {
      try {
        setLoading(true)
        setError(null)

        const authFetch = createAuthenticatedFetch()
        const res = await authFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/protected/story?page=${currentPage}`,
          {
            cache: "no-store",
          },
        )

        if (!res.ok) {
          throw new Error(`API Error: ${res.status} ${res.statusText}`)
        }

        const data: StoriesResponse = await res.json()
        setStories(data.data.items)
        setPagination({
          total: data.data.total,
          page: data.data.page,
          page_size: data.data.page_size,
          totalPages: Math.ceil(data.data.total / data.data.page_size),
        })
      } catch (err) {
        console.error("Failed to fetch stories:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch stories")
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [currentPage])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
            <span className="ml-2 text-slate-600">Đang tải danh sách truyện...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-4">Lỗi khi tải danh sách truyện: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Thử lại
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Card className="mb-6 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Danh sách truyện</CardTitle>
            <p className="text-slate-300 text-sm mt-1">
              Trang {currentPage} / {pagination.totalPages} • Tổng {pagination.total} truyện
            </p>
          </CardHeader>
        </Card>

        {/* Grid of stories */}
        <div className="grid gap-6 md:grid-cols-2">
          {stories.map((story) => (
            <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex">
                <div className="relative w-28 h-28 flex-shrink-0 hidden sm:block">
                  <Image
                    src={
                      story.image_url ||
                      "/placeholder.svg?height=160&width=160&query=story%20cover%20thumbnail" ||
                      "/placeholder.svg"
                    }
                    alt={story.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                    priority={false}
                  />
                </div>
                <div className="flex-1">
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge className={getTypeColor(story.type)}>{story.type || "N/A"}</Badge>
                      <Badge className={getStatusColor(story.status)}>
                        {story.status === "unpublish" ? "Chưa xuất bản" : story.status || "—"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-snug line-clamp-2">{story.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {story.description ? (
                      <p className="text-sm text-slate-600 line-clamp-2">{story.description}</p>
                    ) : (
                      <p className="text-sm text-slate-500 italic">Chưa có mô tả</p>
                    )}
                    <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {formatDate(story.created_at)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Hash className="w-3.5 h-3.5" /> {story.slug}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={`/story/${story.slug}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 text-sm"
                      >
                        Xem chi tiết
                      </Link>
                      <Link
                        href={`/story/${story.slug}/chapters`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
                      >
                        <BookOpen className="w-4 h-4" />
                        Đọc truyện
                      </Link>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {stories.length === 0 && (
          <Card className="mt-6">
            <CardContent className="p-6 text-center text-slate-600">Không có truyện nào ở trang này.</CardContent>
          </Card>
        )}

        {/* Story Statistics */}
        <div className="mt-6 text-center">
          <Card className="bg-slate-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{stories.length} truyện trong trang này</span>
                </div>
                <div className="flex items-center gap-1">
                  <Hash className="w-4 h-4" />
                  <span>Tổng {pagination.total} truyện</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
