import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { BookOpen, Github, Mail, Heart } from "lucide-react"
import AuthStatus from "@/components/auth-status"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Story Display - Đọc truyện online",
  description: "Nền tảng đọc truyện trực tuyến với nhiều thể loại hấp dẫn",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <div className="min-h-screen flex flex-col">
          <nav className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold text-slate-800">
                  <BookOpen className="w-6 h-6" />
                  Story Display
                </Link>
                <div className="flex items-center gap-4">
                  <Link
                    href="/story/tran-van-truong-sinh"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Demo Story
                  </Link>
                  <Link
                    href="/story"
                    className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Tất cả truyện
                  </Link>
                  <AuthStatus />
                </div>
              </div>
            </div>
          </nav>

          <main className="flex-1">{children}</main>

          <footer className="bg-slate-900 text-slate-300 mt-auto">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand Section */}
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-2 text-xl font-bold text-white mb-4">
                    <BookOpen className="w-6 h-6" />
                    Story Display
                  </div>
                  <p className="text-slate-400 mb-4 max-w-md">
                    Nền tảng đọc truyện trực tuyến hàng đầu với kho tàng truyện phong phú, giao diện thân thiện và trải
                    nghiệm đọc tuyệt vời.
                  </p>
                  <div className="flex items-center gap-4">
                    <a href="#" className="text-slate-400 hover:text-white transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors">
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Liên kết nhanh</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/story" className="text-slate-400 hover:text-white transition-colors">
                        Tất cả truyện
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile" className="text-slate-400 hover:text-white transition-colors">
                        Hồ sơ cá nhân
                      </Link>
                    </li>
                    <li>
                      <Link href="/login" className="text-slate-400 hover:text-white transition-colors">
                        Đăng nhập
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Hỗ trợ</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-slate-400 hover:text-white transition-colors">
                        Liên hệ
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-slate-400 hover:text-white transition-colors">
                        Điều khoản sử dụng
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-slate-400 hover:text-white transition-colors">
                        Chính sách bảo mật
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between">
                <p className="text-slate-400 text-sm">© 2025 Story Display. Tất cả quyền được bảo lưu.</p>
                <div className="flex items-center gap-1 text-slate-400 text-sm mt-2 md:mt-0">
                  <span>Được tạo với</span>
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>tại Việt Nam</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
