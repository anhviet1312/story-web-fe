import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronLeft, ChevronRight, List, BookOpen, Clock, User, Hash } from "lucide-react"
import { createAuthenticatedFetch } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"

interface ChapterDetail {
  id: string
  name: string
  story_id: string
  status: string
  number: number
  description: string | null
  content: string
  created_by: string
  updated_at: string
  created_at: string
}

interface ChapterResponse {
  data: ChapterDetail
}

async function getChapterByNumber(slug: string, chapterNumber: string): Promise<ChapterDetail | null> {
  try {
    const authenticatedFetch = createAuthenticatedFetch()

    const response = await authenticatedFetch(
      `${process.env.API_BASE_URL}/api/v1/protected/story/${slug}/chapters/${chapterNumber}`,
      {
        cache: "no-store",
      },
    )

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`)
      return null
    }

    const result: ChapterResponse = await response.json()
    return result.data
  } catch (error) {
    console.error("Failed to fetch chapter:", error)
    return null
  }
}

function formatDate(dateString: string): string {
  if (dateString === "0001-01-01T06:06:36+06:06") {
    return "Chưa cập nhật"
  }
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
    return "Chưa cập nhật"
  }
}

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "inactive":
      return "bg-red-100 text-red-800 hover:bg-red-100"
    case "draft":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

// Extract chapter title (everything after the colon)
function extractChapterTitle(chapterName: string): string {
  const parts = chapterName.split(" : ")
  return parts.length > 1 ? parts[1] : chapterName
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string; chapterNumber: string }>
}) {
  // Await params before using its properties
  const { slug, chapterNumber } = await params

  const chapter = await getChapterByNumber(slug, chapterNumber)

  if (!chapter) {
    notFound()
  }

  const chapterTitle = extractChapterTitle(chapter.name)
  const currentChapterNum = Number.parseInt(chapterNumber)
  const previousChapter = currentChapterNum > 1 ? currentChapterNum - 1 : null
  const nextChapter = currentChapterNum + 1 // We'll assume there's a next chapter for now

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Navigation Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/story/${slug}/chapters`}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Danh sách chương
            </Link>

            <Link
              href={`/story/${slug}`}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <List className="w-4 h-4" />
              Chi tiết truyện
            </Link>
          </div>

          {/* Chapter Navigation */}
          <div className="flex items-center gap-2">
            {previousChapter ? (
              <Link href={`/story/${slug}/chapter/${previousChapter}`}>
                <Button variant="outline" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}

            <span className="text-sm text-slate-600 px-2">Chương {chapter.number}</span>

            <Link href={`/story/${slug}/chapter/${nextChapter}`}>
              <Button variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Chapter Content */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(chapter.status)}>
                    {chapter.status === "active" ? "Hoạt động" : chapter.status}
                  </Badge>
                  <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                    <Hash className="w-3 h-3 mr-1" />
                    {chapter.number}
                  </Badge>
                </div>
              </div>

              <CardTitle className="text-2xl md:text-3xl font-bold leading-tight">{chapterTitle}</CardTitle>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-200">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Chương {chapter.number}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Cập nhật: {formatDate(chapter.updated_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>ID: {chapter.created_by ? `${chapter.created_by.slice(0, 8)}...` : "—"}</span>
                </div>
              </div>

              {chapter.description && (
                <div className="pt-2 border-t border-white/20">
                  <p className="text-slate-200 text-sm italic">{chapter.description}</p>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="p-8 md:p-12">
              <div className="prose prose-slate max-w-none">
                <div className="text-slate-800 leading-relaxed whitespace-pre-line text-lg font-serif">
                  {chapter.content}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chapter Info Card */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-slate-800 mb-2">Thông tin chương</h3>
              <div className="space-y-1 text-sm text-slate-600">
                <p>
                  <span className="font-medium">Số chương:</span> {chapter.number}
                </p>
                <p>
                  <span className="font-medium">ID:</span> {chapter.id}
                </p>
                <p>
                  <span className="font-medium">Trạng thái:</span>
                  <Badge className={`ml-2 ${getStatusColor(chapter.status)}`} variant="secondary">
                    {chapter.status === "active" ? "Hoạt động" : chapter.status}
                  </Badge>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-slate-800 mb-2">Thời gian</h3>
              <div className="space-y-1 text-sm text-slate-600">
                <p>
                  <span className="font-medium">Tạo lúc:</span> {formatDate(chapter.created_at)}
                </p>
                <p>
                  <span className="font-medium">Cập nhật:</span> {formatDate(chapter.updated_at)}
                </p>
                <p>
                  <span className="font-medium">Tác giả:</span> {chapter.created_by.slice(0, 8)}...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <div>
            {previousChapter ? (
              <Link href={`/story/${slug}/chapter/${previousChapter}`}>
                <Button className="flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Chương {previousChapter}
                </Button>
              </Link>
            ) : (
              <Button disabled className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                Chương đầu
              </Button>
            )}
          </div>

          <Link href={`/story/${slug}/chapters`}>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <List className="w-4 h-4" />
              Danh sách chương
            </Button>
          </Link>

          <div>
            <Link href={`/story/${slug}/chapter/${nextChapter}`}>
              <Button className="flex items-center gap-2">
                Chương {nextChapter}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Reading Progress */}
        <div className="mt-6 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-blue-700 text-sm">
                Bạn đang đọc <strong>Chương {chapter.number}</strong> •
                <Link href={`/story/${slug}`} className="ml-1 underline hover:no-underline">
                  Quay về trang truyện
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
