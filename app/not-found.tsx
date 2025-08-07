import Link from 'next/link'
import { BookX, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <BookX className="w-24 h-24 text-slate-400" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-800">404</h1>
          <h2 className="text-xl font-semibold text-slate-600">Không tìm thấy truyện</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Truyện bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
        </div>
        
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          Về trang chủ
        </Link>
      </div>
    </div>
  )
}
