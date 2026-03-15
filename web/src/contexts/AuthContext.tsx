import React, { createContext, useContext, useEffect, useState } from 'react'

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
  syncData: () => Promise<void>
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
      // Usar tRPC para chamar auth.me
      // Note: tRPC queries não podem ser chamadas diretamente fora de componentes React
      // Por enquanto, apenas definir isLoading como false
      setUser(null)
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  async function logout() {
    try {
      setUser(null)
      // Limpar dados locais
      localStorage.removeItem('studySessions')
      localStorage.removeItem('studyConfig')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  async function syncData() {
    if (!user) return

    try {
      // Sincronizar sessões de estudo com o servidor
      const sessions = JSON.parse(localStorage.getItem('studySessions') || '[]')
      if (sessions.length > 0) {
        // TODO: Implementar sincronização via tRPC
        console.log('Sincronizando', sessions.length, 'sessões')
      }
    } catch (error) {
      console.error('Data sync failed:', error)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    logout,
    syncData,
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
