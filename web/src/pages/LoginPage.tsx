import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/setup')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    // Check if we're coming from dev login redirect
    const params = new URLSearchParams(window.location.search)
    if (params.get('dev-login') === 'true') {
      handleDevLoginCallback()
    }
  }, [])

  async function handleDevLoginCallback() {
    setIsLoading(true)
    try {
      // Call the dev login endpoint on the backend
      const apiUrl = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3000'
      const response = await axios.post(
        `${apiUrl}/api/trpc/auth.devLogin`,
        { email: 'test@example.com' },
        { withCredentials: true }
      )
      
      if (response.data?.result?.data) {
        // Reload to refresh auth state
        setTimeout(() => {
          window.location.href = window.location.pathname
        }, 500)
      }
    } catch (error) {
      console.error('Dev login callback failed:', error)
      // Clear the URL parameter even if it fails
      window.history.replaceState({}, document.title, window.location.pathname)
    } finally {
      setIsLoading(false)
    }
  }

  function handleLogin() {
    const baseUrl = window.location.origin
    const redirectUri = `${baseUrl}/oauth-callback`
    const clientId = (import.meta as any).env.VITE_OAUTH_CLIENT_ID || 'YOUR_CLIENT_ID'
    const loginUrl = `https://auth.manus.im/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid+profile+email`
    window.location.href = loginUrl
  }

  function handleDevLogin() {
    // Redirect to the dev login endpoint on the backend
    const apiUrl = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3000'
    window.location.href = `${apiUrl}/api/dev-login`
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Simulado para Concílio Pastoral Batista</h1>
        <p>Faça login para começar a estudar</p>
        
        {isLoading && <p style={{ textAlign: 'center', color: 'var(--color-muted)' }}>Autenticando...</p>}
        
        <button 
          className="login-button" 
          onClick={handleLogin}
          disabled={isLoading}
        >
          Fazer Login
        </button>

        <p style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
          Ou teste com:
        </p>
        
        <button 
          className="dev-login-button" 
          onClick={handleDevLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Autenticando...' : 'Login de Teste'}
        </button>
      </div>
    </div>
  )
}
