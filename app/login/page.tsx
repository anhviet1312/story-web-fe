"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, BookOpen, Shield } from "lucide-react"
import { login, loginWithGoogle, type LoginCredentials } from "@/lib/auth"

export default function LoginPage() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await login(credentials)
      // Redirect to stories page after successful login
      router.push("/story")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setError(null)

    try {
      await loginWithGoogle()
      // Redirect to stories page after successful login
      router.push("/story")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập Google thất bại")
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleInputChange = (field: keyof LoginCredentials) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <BookOpen className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Chào mừng trở lại</h1>
          <p className="text-muted-foreground">Khám phá thế giới truyện Việt Nam</p>
        </div>

        <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl font-semibold text-foreground">Đăng nhập tài khoản</CardTitle>
            <CardDescription className="text-muted-foreground">
              Đăng nhập để trải nghiệm đầy đủ tính năng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full h-12 bg-background hover:bg-muted border-2 border-border hover:border-primary/50 transition-all duration-200"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Đang kết nối...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Tiếp tục với Google
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm uppercase">
                <span className="bg-card px-4 text-muted-foreground font-medium">Hoặc đăng nhập với</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-foreground">
                  Tên đăng nhập
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập của bạn"
                  value={credentials.username}
                  onChange={handleInputChange("username")}
                  required
                  disabled={isLoading || isGoogleLoading}
                  className="h-12 bg-background border-2 border-border focus:border-primary transition-colors duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Mật khẩu
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu của bạn"
                  value={credentials.password}
                  onChange={handleInputChange("password")}
                  required
                  disabled={isLoading || isGoogleLoading}
                  className="h-12 bg-background border-2 border-border focus:border-primary transition-colors duration-200"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                  <AlertDescription className="text-destructive">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={isLoading || isGoogleLoading || !credentials.username || !credentials.password}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Đang xác thực...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-3" />
                    Đăng nhập an toàn
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
              <div className="text-center">
                <p className="text-sm font-medium text-foreground mb-2">Tài khoản demo để trải nghiệm:</p>
                <div className="bg-background p-3 rounded border border-border font-mono text-sm">
                  <div className="text-muted-foreground">
                    Tên đăng nhập: <span className="text-foreground font-semibold">fireman</span>
                  </div>
                  <div className="text-muted-foreground">
                    Mật khẩu: <span className="text-foreground font-semibold">Helsinki1</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                <Shield className="w-3 h-3" />
                Thông tin của bạn được bảo mật tuyệt đối
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
