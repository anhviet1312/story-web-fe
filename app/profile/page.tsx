import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Shield, Hash } from "lucide-react"
import { createAuthenticatedFetch, isTokenExpired } from "@/lib/auth"

interface UserProfile {
  id: string
  first_name: string | null
  last_name: string | null
  username: string
  email: string
  is_active: boolean
}

interface UserResponse {
  data: UserProfile
}

async function getUserProfile(): Promise<UserProfile | null> {
  try {
    if (isTokenExpired()) {
      console.error("JWT token has expired")
      return null
    }

    const authenticatedFetch = createAuthenticatedFetch()

    const response = await authenticatedFetch(`${process.env.API_BASE_URL}/api/v1/protected/user/me`, {
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`)
      return null
    }

    const result: UserResponse = await response.json()
    return result.data
  } catch (error) {
    console.error("Failed to fetch user profile:", error)
    return null
  }
}

function getDisplayName(user: UserProfile): string {
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`
  }
  if (user.first_name) {
    return user.first_name
  }
  if (user.last_name) {
    return user.last_name
  }
  return user.username
}

export default async function ProfilePage() {
  const user = await getUserProfile()

  if (!user) {
    notFound()
  }

  const displayName = getDisplayName(user)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Profile Header */}
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">{displayName}</CardTitle>
                <p className="text-blue-100">@{user.username}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Account Status */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Trạng thái tài khoản</h3>
                <Badge className={user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {user.is_active ? "Hoạt động" : "Không hoạt động"}
                </Badge>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Thông tin cá nhân</h3>

                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-600">Tên hiển thị</p>
                      <p className="font-medium text-slate-800">{displayName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-600">Tên người dùng</p>
                      <p className="font-medium text-slate-800">@{user.username}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-600">Email</p>
                      <p className="font-medium text-slate-800">{user.email}</p>
                    </div>
                  </div>

                  {user.first_name && (
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="text-sm text-slate-600">Họ</p>
                        <p className="font-medium text-slate-800">{user.first_name}</p>
                      </div>
                    </div>
                  )}

                  {user.last_name && (
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="text-sm text-slate-600">Tên</p>
                        <p className="font-medium text-slate-800">{user.last_name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Chi tiết tài khoản</h3>

                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-600">ID tài khoản</p>
                      <p className="font-mono text-sm text-slate-800">{user.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-600">Quyền truy cập</p>
                      <p className="font-medium text-slate-800">
                        {user.is_active ? "Người dùng hoạt động" : "Tài khoản bị khóa"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <h4 className="font-semibold text-slate-800 mb-2">Thư viện của tôi</h4>
              <p className="text-sm text-slate-600 mb-3">Xem các truyện đã lưu</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Xem thư viện
              </button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <h4 className="font-semibold text-slate-800 mb-2">Lịch sử đọc</h4>
              <p className="text-sm text-slate-600 mb-3">Theo dõi tiến độ đọc</p>
              <button className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm">
                Xem lịch sử
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
