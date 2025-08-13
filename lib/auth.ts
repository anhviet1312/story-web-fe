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

// Get stored token from localStorage or fallback to hardcoded
export function getStoredToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY)
  }
  // Fallback for server-side rendering
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InF1b2N2aWV0MTMxMjIwMDJAZ21haWwuY29tIiwiZXhwIjoxNzU3MTUxMTIxLCJmaXJzdF9uYW1lIjpudWxsLCJpZCI6ImFhOGIwOTUzLWUzNGItNGE4My1iZDQzLTMyYTIzMTg4ZmQ4MSIsImlzX2FjdGl2ZSI6dHJ1ZSwibGFzdF9uYW1lIjpudWxsLCJ1c2VybmFtZSI6ImZpcmVtYW4ifQ.T5lP3RvlcJbE5f1b-WR2NJ-l2z9Z50h4JoxfO83K_3k"
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
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

export function createAuthenticatedFetch() {
  return async (url: string, options: RequestInit = {}) => {
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

// Check if user is logged in
export function isLoggedIn(): boolean {
  const token = getStoredToken()
  return token !== null && !isTokenExpired()
}

// Utility to check if token is expired
export function isTokenExpired(): boolean {
  try {
    const token = getStoredToken()
    if (!token) return true

    const payload = JSON.parse(atob(token.split(".")[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
  } catch (error) {
    console.error("Error checking token expiration:", error)
    return true
  }
}

// Get user info from token
export function getUserFromToken() {
  try {
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
