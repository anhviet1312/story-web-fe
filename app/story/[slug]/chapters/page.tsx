import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, BookOpen, ArrowLeft, List } from 'lucide-react'
import { createAuthenticatedFetch, isTokenExpired } from '@/lib/auth'

interface Chapter {
  id: string
  name: string
}

interface ChaptersResponse {
  data: Chapter[]
  // Add pagination metadata if your API provides it
  total?: number
  current_page?: number
  per_page?: number
  last_page?: number
}

async function getChapters(slug: string, page: number = 1): Promise<ChaptersResponse | null> {
  try {
    if (isTokenExpired()) {
      console.error('JWT token has expired')
      return null
    }

    const authenticatedFetch = createAuthenticatedFetch()
    
    const response = await authenticatedFetch(
      `${process.env.API_BASE_URL}/api/v1/protected/story/${slug}/chapters?page=${page}`,
      {
        cache: 'no-store',
      }
    )
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`)
      return null
    }
    
    const result: ChaptersResponse = await response.json()
    return result
  } catch (error) {
    console.error('Failed to fetch chapters:', error)
    return null
  }
}

// Extract chapter number from chapter name
function extractChapterNumber(chapterName: string): string {
  const match = chapterName.match(/Chương (\d+)/)
  return match ? match[1] : '?'
}

// Extract chapter title (everything after the colon)
function extractChapterTitle(chapterName: string): string {
  const parts = chapterName.split(' : ')
  return parts.length > 1 ? parts[1] : chapterName
}

export default async function ChaptersPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string }
  searchParams: { page?: string }
}) {
  const currentPage = parseInt(searchParams.page || '1')
  const chaptersData = await getChapters(params.slug, currentPage)

  if (!chaptersData) {
    notFound()
  }

  const { data: chapters } = chaptersData
  
  // Calculate pagination (assuming 20 items per page based on your data)
  const itemsPerPage = 20
  const totalItems = chapters.length
  const hasNextPage = totalItems === itemsPerPage // If we got full page, there might be more
  const hasPrevPage = currentPage > 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href={`/story/${params.slug}`}
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
                    Trang {currentPage} • {chapters.length} chương
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
                const chapterNumber = extractChapterNumber(chapter.name)
                const chapterTitle = extractChapterTitle(chapter.name)
                
                return (
                  <Link
                    key={chapter.id}
                    href={`/story/${params.slug}/chapter/${chapter.id}`}
                    className="block hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-4 flex items-center gap-4">
                      {/* Chapter Number Badge */}
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className="w-16 justify-center font-mono">
                          #{chapterNumber}
                        </Badge>
                      </div>
                      
                      {/* Chapter Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-800 truncate">
                          {chapterTitle}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          Chương {chapterNumber}
                        </p>
                      </div>
                      
                      {/* Read Icon */}
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
        {(hasPrevPage || hasNextPage) && (
          <div className="mt-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {hasPrevPage ? (
                      <Link href={`/story/${params.slug}/chapters?page=${currentPage - 1}`}>
                        <Button variant="outline" className="flex items-center gap-2">
                          <ChevronLeft className="w-4 h-4" />
                          Trang trước
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" disabled className="flex items-center gap-2">
                        <ChevronLeft className="w-4 h-4" />
                        Trang trước
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">
                      Trang {currentPage}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasNextPage ? (
                      <Link href={`/story/${params.slug}/chapters?page=${currentPage + 1}`}>
                        <Button variant="outline" className="flex items-center gap-2">
                          Trang sau
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" disabled className="flex items-center gap-2">
                        Trang sau
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Navigation */}
        <div className="mt-6 text-center">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href={`/story/${params.slug}/chapters?page=1`}>
              <Button variant="ghost" size="sm">
                Trang đầu
              </Button>
            </Link>
            {currentPage > 1 && (
              <Link href={`/story/${params.slug}/chapters?page=${currentPage - 1}`}>
                <Button variant="ghost" size="sm">
                  Trang {currentPage - 1}
                </Button>
              </Link>
            )}
            <Button variant="default" size="sm" disabled>
              Trang {currentPage}
            </Button>
            {hasNextPage && (
              <Link href={`/story/${params.slug}/chapters?page=${currentPage + 1}`}>
                <Button variant="ghost" size="sm">
                  Trang {currentPage + 1}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
