import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronLeft, ChevronRight, List } from 'lucide-react'

export default async function ChapterPage({ 
  params 
}: { 
  params: { slug: string; chapterId: string }
}) {
  // This is a placeholder - you can implement chapter content fetching here
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            href={`/story/${params.slug}/chapters`}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Danh sách chương
          </Link>
          
          <Link 
            href={`/story/${params.slug}`}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <List className="w-4 h-4" />
            Chi tiết truyện
          </Link>
        </div>

        {/* Chapter Content Placeholder */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
            <CardTitle>
              <h1 className="text-2xl font-bold">Đang phát triển...</h1>
              <p className="text-slate-200 text-sm mt-2">
                Chapter ID: {params.chapterId}
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <p className="text-slate-600">
                Trang đọc chương đang được phát triển. Bạn có thể implement API call để lấy nội dung chương tại đây.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Chương trước
                </Button>
                <Button variant="outline">
                  Chương sau
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
