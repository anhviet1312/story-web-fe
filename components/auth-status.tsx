"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, LogOut, UserCircle } from "lucide-react"
import { isLoggedIn, getUserFromToken, logout } from "@/lib/auth"

export default function AuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

  const checkAuth = () => {
    const loggedIn = isLoggedIn()
    setIsAuthenticated(loggedIn)

    if (loggedIn) {
      const userData = getUserFromToken()
      setUser(userData)
    } else {
      setUser(null)
    }
  }

  useEffect(() => {
    checkAuth()

    const handleAuthChange = () => {
      checkAuth()
    }

    window.addEventListener("auth-changed", handleAuthChange)

    // Check auth status periodically as backup
    const interval = setInterval(checkAuth, 30000) // Check every 30 seconds

    return () => {
      window.removeEventListener("auth-changed", handleAuthChange)
      clearInterval(interval)
    }
  }, [])

  const handleLogout = () => {
    logout()
    // No need to manually update state here since logout() dispatches the event
  }

  if (!isAuthenticated) {
    return (
      <Link href="/login">
        <Button variant="outline" size="sm">
          <User className="w-4 h-4 mr-2" />
          Đăng nhập
        </Button>
      </Link>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-gray-600">
        Xin chào, <span className="font-medium">{user?.username}</span>
      </span>
      <Link href="/profile">
        <Button variant="ghost" size="sm">
          <UserCircle className="w-4 h-4 mr-2" />
          Hồ sơ
        </Button>
      </Link>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        <LogOut className="w-4 h-4 mr-2" />
        Đăng xuất
      </Button>
    </div>
  )
}
