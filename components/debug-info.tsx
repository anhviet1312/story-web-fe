'use client'

import { useState } from 'react'
import { getUserFromToken, isTokenExpired } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, EyeOff, User, Clock, Mail } from 'lucide-react'

export function DebugInfo() {
  const [showDebug, setShowDebug] = useState(false)
  const userInfo = getUserFromToken()
  const tokenExpired = isTokenExpired()

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 p-2 bg-slate-600 text-white rounded-full hover:bg-slate-700 transition-colors z-50"
        title="Show debug info"
      >
        <Eye className="w-4 h-4" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Debug Info</CardTitle>
            <button
              onClick={() => setShowDebug(false)}
              className="p-1 hover:bg-slate-100 rounded"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>Token Status:</span>
            <Badge variant={tokenExpired ? "destructive" : "default"}>
              {tokenExpired ? "Expired" : "Valid"}
            </Badge>
          </div>
          
          {userInfo && (
            <>
              <div className="flex items-center gap-2">
                <User className="w-3 h-3" />
                <span>User: {userInfo.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <span>Email: {userInfo.email}</span>
              </div>
              <div className="text-slate-500">
                <div>ID: {userInfo.id.slice(0, 8)}...</div>
                <div>Expires: {new Date(userInfo.exp * 1000).toLocaleString('vi-VN')}</div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
