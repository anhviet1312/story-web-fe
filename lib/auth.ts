// Token management utility
// Currently using hardcoded token, but this can be extended for proper token management

export const AUTH_CONFIG = {
  // Hardcoded JWT token - replace with proper token management later
  JWT_TOKEN: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InF1b2N2aWV0MTMxMjIwMDJAZ21haWwuY29tIiwiZXhwIjoxNzU3MTUxMTIxLCJmaXJzdF9uYW1lIjpudWxsLCJpZCI6ImFhOGIwOTUzLWUzNGItNGE4My1iZDQzLTMyYTIzMTg4ZmQ4MSIsImlzX2FjdGl2ZSI6dHJ1ZSwibGFzdF9uYW1lIjpudWxsLCJ1c2VybmFtZSI6ImZpcmVtYW4ifQ.T5lP3RvlcJbE5f1b-WR2NJ-l2z9Z50h4JoxfO83K_3k"
}

export function getAuthHeaders(): HeadersInit {
  return {
    'Authorization': `Bearer ${AUTH_CONFIG.JWT_TOKEN}`,
    'Content-Type': 'application/json',
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

// Utility to check if token is expired (basic check)
export function isTokenExpired(): boolean {
  try {
    const token = AUTH_CONFIG.JWT_TOKEN
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
  } catch (error) {
    console.error('Error checking token expiration:', error)
    return true
  }
}

// Get user info from token
export function getUserFromToken() {
  try {
    const token = AUTH_CONFIG.JWT_TOKEN
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      id: payload.id,
      email: payload.email,
      username: payload.username,
      firstName: payload.first_name,
      lastName: payload.last_name,
      isActive: payload.is_active,
      exp: payload.exp
    }
  } catch (error) {
    console.error('Error parsing token:', error)
    return null
  }
}
