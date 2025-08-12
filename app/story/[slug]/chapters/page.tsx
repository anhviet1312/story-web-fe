import { notFound } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ArrowLeft, List, Hash } from "lucide-react"
import { createAuthenticatedFetch, isTokenExpired } from "@/lib/auth"
import { PaginationAdvanced } from "@/components/pagination-advanced"

interface Chapter {
  id: string
  name: string
  number: number
}

interface ChaptersResponse {
  data: {
    total: number
    page: number
    page_size: number
    items: Chapter[]
  }
}

async function getChapters(slug: string, page = 1): Promise<ChaptersResponse | null> {
  try {
    if (isTokenExpired()) {
      console.error("JWT token has expired")
      return null
    }

    const authenticatedFetch = createAuthenticatedFetch()

    const response = await authenticatedFetch(
      `${process.env.API_BASE_URL}/api/v1/protected/story/${slug}/chapters?page=${page}`,
      {
        cache: "no-store",
      },
    )

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`)
      return null
    }

    const result: ChaptersResponse = await response.json()
    return result
  } catch (error) {
    console.error("Failed to fetch chapters:", error)
    return null
  }
}

// Extract chapter title (everything after the colon)
function extractChapterTitle(chapterName: string): string {
  const parts = chapterName.split(" : ")
  return parts.length > 1 ? parts[1] : chapterName
}

export default async function ChaptersPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { slug } = await params
  const { page } = await searchParams

  const currentPage = Number.parseInt(page || "1")
  const chaptersData = await getChapters(slug, currentPage)

  if (!chaptersData) {
    notFound()
  }

  const {
    data: { total, page: apiPage, page_size, items: chapters },
  } = chaptersData
  const totalPages = Math.ceil(total / page_size)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href={`/story/${slug}`}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại chi tiết truyện
            </Link>
          </div>

          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <List className="w-6 h-6" />
                <div>
                  <h1 className="text-2xl font-bold">Danh sách chương</h1>
                  <p className="text-blue-100 text-sm mt-1">
                    Trang {currentPage} / {totalPages} • Tổng {total} chương
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Chapters List */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="divide-y divide-slate-200">
              {chapters.map((chapter, index) => {
                const chapterTitle = extractChapterTitle(chapter.name)

                return (
                  <Link
                    key={chapter.id}
                    href={`/story/${slug}/chapter/${chapter.number}`}
                    className="block hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-4 flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className="w-16 justify-center font-mono">
                          <Hash className="w-3 h-3 mr-1" />
                          {chapter.number}
                        </Badge>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-800 truncate">{chapterTitle}</h3>
                        <p className="text-sm text-slate-500 mt-1">Chương {chapter.number}</p>
                      </div>

                      <div className="flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Card>
              <CardContent className="p-6">
                <PaginationAdvanced
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl={`/story/${slug}/chapters`}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Chapter Statistics */}
        <div className="mt-8 text-center">
          <Card className="bg-slate-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{chapters.length} chương trong trang này</span>
                </div>
                <div className="flex items-center gap-1">
                  <List className="w-4 h-4" />
                  <span>Tổng {total} chương</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
