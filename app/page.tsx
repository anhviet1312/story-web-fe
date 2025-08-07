import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, ArrowRight, Code, Eye } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Story Display Demo
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Nền tảng đọc truyện với JWT authentication
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Demo Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Xem trang chi tiết truyện "Trận Vấn Trường Sinh" với JWT authentication
              </p>
              <Link 
                href="/story/tran-van-truong-sinh"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xem Demo Story
                <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-green-600" />
                API Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Endpoint:</strong></p>
                <code className="block bg-slate-100 p-2 rounded text-xs break-all">
                  /api/v1/protected/story/tran-van-truong-sinh/detail
                </code>
                <p><strong>Method:</strong> GET</p>
                <p><strong>Auth:</strong> Bearer JWT Token</p>
                <p><strong>Status:</strong> 
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    Configured
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Eye className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-800">Debug Mode</h3>
              </div>
              <p className="text-blue-700 mb-4">
                Click the eye icon in the bottom-right corner of the story page to view JWT token information and debug details.
              </p>
              <div className="text-sm text-blue-600">
                <p><strong>Current Token Status:</strong> Hardcoded JWT</p>
                <p><strong>User:</strong> fireman (quocviet131220002@gmail.com)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
