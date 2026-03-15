import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

interface User {
  id: number
  openId: string
  name: string | null
  email: string | null
  loginMethod: string
  role: 'user' | 'admin'
  lastSignedIn: Date
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const response = await axios.get('/api/trpc/auth.getMe', {
        withCredentials: true,
      })
      if (response.data?.result?.data) {
        setUser(response.data.result.data)
      }
    } catch (error) {
      // User not authenticated
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  async function logout() {
    try {
      await axios.post('/api/trpc/auth.logout', {}, {
        withCredentials: true,
      })
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
