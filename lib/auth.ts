// Token management utility with login functionality and localStorage storage

const TOKEN_KEY = "story_app_token"
const TMA_AUTH_KEY = "tma_auth_data"

// Store TMA authorization data (from Telegram Mini App)
const TMA_AUTH_DATA =
  "tma query_id=AAHxAvVhAgAAAPEC9WFKc61u&user=%7B%22id%22%3A5938414321%2C%22first_name%22%3A%22Viet%22%2C%22last_name%22%3A%22Hoang%22%2C%22username%22%3A%22anhviet1312%22%2C%22language_code%22%3A%22vi%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F-2xihp_MFnFSH6TKZdZ3Nj82iZYhRRvGjU81vnswwa1UZrJlKJmuKbO-nhDjad3E.svg%22%7D&auth_date=1753339232&signature=vEtvl3QwctrBAHbGE5aRtZYKyOmPcL8tidcVILyLBSoDYM2g5982ISehIIp-Zdrt9BvWl8ZRTl4hPVkPhSqaBA&hash=be98b5bd6b1b4138235c5493a32a67f95876c53d2fdda0efd80ae8b68edcf328"

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  data: string // JWT token
}

function dispatchAuthChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth-changed"))
  }
}

export function getStoredToken(): string | null {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY)
    return token
  }

  // Server-side: no token available
  return null
}

// Store token in localStorage
export function storeToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token)
    dispatchAuthChange()
  }
}

// Remove token from localStorage
export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY)
    dispatchAuthChange()
  }
}

// Login function
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

  const response = await fetch(`${apiBaseUrl}/api/v1/public/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: TMA_AUTH_DATA,
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    if (response.status === 400) {
      try {
        const errorData = await response.json()
        throw new Error(errorData.message || "Đăng nhập thất bại")
      } catch (parseError) {
        const errorText = await response.text()
        throw new Error(`Login failed: ${response.status} ${errorText}`)
      }
    } else {
      const errorText = await response.text()
      throw new Error(`Login failed: ${response.status} ${errorText}`)
    }
  }

  const data: LoginResponse = await response.json()

  // Store the token (this will automatically dispatch the auth change event)
  storeToken(data.data)

  return data
}

export async function loginWithGoogle(): Promise<void> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

  return new Promise((resolve, reject) => {
    // Open Google OAuth in popup
    const popup = window.open(
      `${apiBaseUrl}/api/v1/auth/google`,
      "google-login",
      "width=500,height=600,scrollbars=yes,resizable=yes",
    )

    if (!popup) {
      reject(new Error("Không thể mở popup. Vui lòng cho phép popup và thử lại."))
      return
    }

    // Listen for messages from the popup
    const messageListener = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== window.location.origin) {
        return
      }

      if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
        // Store the token
        storeToken(event.data.token)
        window.removeEventListener("message", messageListener)
        resolve()
      } else if (event.data.type === "GOOGLE_AUTH_ERROR") {
        window.removeEventListener("message", messageListener)
        reject(new Error(event.data.error || "Đăng nhập Google thất bại"))
      }
    }

    window.addEventListener("message", messageListener)

    // Check if popup was closed manually
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed)
        window.removeEventListener("message", messageListener)
        reject(new Error("Đăng nhập bị hủy"))
      }
    }, 1000)
  })
}

// Logout function
export function logout(): void {
  // Remove token (this will automatically dispatch the auth change event)
  removeToken()
  if (typeof window !== "undefined") {
    window.location.href = "/login"
  }
}

export function getAuthHeaders(): HeadersInit {
  const token = getStoredToken()
  if (!token) {
    return {
      "Content-Type": "application/json",
    }
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

export function createAuthenticatedFetch() {
  return async (url: string, options: RequestInit = {}) => {
    const token = getStoredToken()

    if (!token) {
      throw new Error("No authentication token available")
    }

    const authHeaders = getAuthHeaders()

    return fetch(url, {
      ...options,
      headers: {
        ...authHeaders,
        ...options.headers,
      },
    })
  }
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") {
    // Server-side: can't check localStorage, assume not logged in
    return false
  }

  const token = getStoredToken()
  return token !== null && !isTokenExpired()
}

// Utility to check if token is expired
export function isTokenExpired(): boolean {
  try {
    if (typeof window === "undefined") {
      // Server-side: can't access localStorage, assume expired
      return true
    }

    const token = getStoredToken()
    if (!token) return true

    console.log("[v0] Checking token expiration...")
    const payload = JSON.parse(atob(token.split(".")[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    const tokenExp = payload.exp
    const timeUntilExpiry = tokenExp - currentTime

    console.log("[v0] Current time (seconds):", currentTime)
    console.log("[v0] Token expires at (seconds):", tokenExp)
    console.log("[v0] Time until expiry (seconds):", timeUntilExpiry)
    console.log("[v0] Token expired?", tokenExp < currentTime)

    return payload.exp < currentTime
  } catch (error) {
    console.error("Error checking token expiration:", error)
    return true
  }
}

// Get user info from token
export function getUserFromToken() {
  try {
    if (typeof window === "undefined") {
      // Server-side: can't access localStorage
      return null
    }

    const token = getStoredToken()
    if (!token) return null

    const payload = JSON.parse(atob(token.split(".")[1]))
    return {
      id: payload.id,
      email: payload.email,
      username: payload.username,
      firstName: payload.first_name,
      lastName: payload.last_name,
      isActive: payload.is_active,
      exp: payload.exp,
    }
  } catch (error) {
    console.error("Error parsing token:", error)
    return null
  }
}
