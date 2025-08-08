import { notFound } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, User, Eye, BookOpen } from 'lucide-react'
import Image from "next/image"
import { createAuthenticatedFetch, isTokenExpired, getUserFromToken } from '@/lib/auth'
import { DebugInfo } from '@/components/debug-info'
import Link from 'next/link'

interface Story {
  id: string
  slug: string
  name: string
  description: string
  type: string
  status: string
  image_url: string | null
  created_by: string
  updated_at: string
  created_at: string
}

interface StoryResponse {
  data: Story
}

async function getStory(slug: string): Promise<Story | null> {
  try {
    // Check if token is expired
    if (isTokenExpired()) {
      console.error('JWT token has expired')
      return null
    }

    const authenticatedFetch = createAuthenticatedFetch()
    
    const response = await authenticatedFetch(`${process.env.API_BASE_URL}/api/v1/protected/story/${slug}/detail`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`)
      return null
    }
    
    const result: StoryResponse = await response.json()
    return result.data
  } catch (error) {
    console.error('Failed to fetch story:', error)
    return null
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'published':
      return 'bg-green-100 text-green-800 hover:bg-green-100'
    case 'unpublish':
      return 'bg-red-100 text-red-800 hover:bg-red-100'
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
  }
}

function getTypeColor(type: string): string {
  switch (type.toUpperCase()) {
    case 'TTV':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
    case 'NOVEL':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-100'
    case 'MANGA':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-100'
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
  }
}

export default async function StoryPage({ 
  params 
}: { 
  params: Promise<{ slug: string }>
}) {
  // Await params before using its properties
  const { slug } = await params
  const story = await getStory(slug)

  if (!story) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={getTypeColor(story.type)}>
                  {story.type}
                </Badge>
                <Badge className={getStatusColor(story.status)}>
                  {story.status === 'unpublish' ? 'Chưa xuất bản' : story.status}
                </Badge>
              </div>
              
              <CardTitle className="text-2xl md:text-3xl font-bold leading-tight">
                {story.name}
              </CardTitle>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-200">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Tạo: {formatDate(story.created_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>ID: {story.created_by.slice(0, 8)}...</span>
                </div>
                {story.updated_at !== story.created_at && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>Cập nhật: {formatDate(story.updated_at)}</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {story.image_url && (
              <div className="relative h-64 md:h-80 overflow-hidden">
                <Image
                  src={story.image_url || "/placeholder.svg"}
                  alt={story.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-5 h-5 text-slate-600" />
                <h2 className="text-xl font-semibold text-slate-800">Mô tả truyện</h2>
              </div>
              
              <Separator className="mb-6" />
              
              <div className="prose prose-slate max-w-none">
                <div className="text-slate-700 leading-relaxed whitespace-pre-line text-base">
                  {story.description}
                </div>
              </div>

              <Separator className="my-8" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-800">Thông tin chi tiết</h3>
                  <div className="space-y-1 text-slate-600">
                    <p><span className="font-medium">ID:</span> {story.id}</p>
                    <p><span className="font-medium">Slug:</span> {story.slug}</p>
                    <p><span className="font-medium">Thể loại:</span> {story.type}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-800">Thời gian</h3>
                  <div className="space-y-1 text-slate-600">
                    <p><span className="font-medium">Tạo lúc:</span> {formatDate(story.created_at)}</p>
                    <p><span className="font-medium">Cập nhật:</span> {formatDate(story.updated_at)}</p>
                    <p><span className="font-medium">Trạng thái:</span> 
                      <Badge className={`ml-2 ${getStatusColor(story.status)}`} variant="secondary">
                        {story.status === 'unpublish' ? 'Chưa xuất bản' : story.status}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link 
            href={`/story/${story.slug}/chapters`}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Đọc truyện
          </Link>
          <button className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
            Thêm vào thư viện
          </button>
          <button className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            Chia sẻ
          </button>
        </div>
      </div>
      {/* Add debug info component */}
      <DebugInfo />
    </div>
  )
}
