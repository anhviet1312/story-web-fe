import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, Hash } from 'lucide-react'
import { createAuthenticatedFetch, isTokenExpired } from "@/lib/auth"

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
  data: Story[]
  // Optionally your API may add pagination meta later
  total?: number
  current_page?: number
  per_page?: number
  last_page?: number
}

async function getStories(page: number): Promise<StoriesResponse | null> {
  try {
    if (isTokenExpired()) {
      console.error("JWT token has expired")
      return null
    }

    const authFetch = createAuthenticatedFetch()
    const res = await authFetch(`${process.env.API_BASE_URL}/api/v1/protected/story?page=${page}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText}`)
      return null
    }

    const data: StoriesResponse = await res.json()
    return data
  } catch (err) {
    console.error("Failed to fetch stories:", err)
    return null
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

export default async function StoriesIndex({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const currentPage = Number.parseInt(page || "1")
  const storiesRes = await getStories(currentPage)

  if (!storiesRes) {
    notFound()
  }

  const stories = storiesRes.data || []

  // Heuristic pagination when API meta is not provided:
  // enable next if page is "full" (commonly 20 items per page)
  const itemsPerPage = 20
  const hasPrev = currentPage > 1
  const hasNext = stories.length === itemsPerPage

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Card className="mb-6 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Danh sách truyện</CardTitle>
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
                      "/placeholder.svg?height=160&width=160&query=story%20cover%20thumbnail"
                     || "/placeholder.svg"}
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
            <CardContent className="p-6 text-center text-slate-600">
              Không có truyện nào ở trang này.
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <div>
            {hasPrev ? (
              <Link href={`/story?page=${currentPage - 1}`}>
                <Button variant="outline">Trang trước</Button>
              </Link>
            ) : (
              <Button variant="outline" disabled>
                Trang trước
              </Button>
            )}
          </div>

          <div className="text-sm text-slate-600">Trang {currentPage}</div>

          <div>
            {hasNext ? (
              <Link href={`/story?page=${currentPage + 1}`}>
                <Button variant="outline">Trang sau</Button>
              </Link>
            ) : (
              <Button variant="outline" disabled>
                Trang sau
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
