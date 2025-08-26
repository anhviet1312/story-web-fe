"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")
    const error = searchParams.get("error")

    if (token) {
      // Send success message to parent window
      window.opener?.postMessage(
        {
          type: "GOOGLE_AUTH_SUCCESS",
          token: token,
        },
        window.location.origin,
      )
    } else if (error) {
      // Send error message to parent window
      window.opener?.postMessage(
        {
          type: "GOOGLE_AUTH_ERROR",
          error: error,
        },
        window.location.origin,
      )
    } else {
      // Send generic error
      window.opener?.postMessage(
        {
          type: "GOOGLE_AUTH_ERROR",
          error: "Không nhận được token từ Google",
        },
        window.location.origin,
      )
    }

    // Close the popup
    window.close()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Đang xử lý đăng nhập...</p>
      </div>
    </div>
  )
}
