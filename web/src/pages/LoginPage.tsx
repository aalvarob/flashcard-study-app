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

  function handleLogin() {
    const baseUrl = window.location.origin
    const redirectUri = `${baseUrl}/oauth-callback`
    const clientId = (import.meta as any).env.VITE_OAUTH_CLIENT_ID || 'YOUR_CLIENT_ID'
    const loginUrl = `https://auth.manus.im/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid+profile+email`
    window.location.href = loginUrl
  }

  async function handleDevLogin() {
    setIsLoading(true)
    try {
      const response = await axios.post(
        '/api/trpc/auth.devLogin',
        { email: 'test@example.com' },
        { withCredentials: true }
      )
      if (response.data?.result?.data) {
        // Aguardar um pouco para a sessão ser estabelecida
        setTimeout(() => {
          window.location.reload()
        }, 500)
      }
    } catch (error) {
      console.error('Dev login failed:', error)
      alert('Erro ao fazer login de desenvolvimento. Verifique o console.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Simulado Concílio</h1>
        <p>Faça login para começar a estudar</p>
        <button className="login-button" onClick={handleLogin} disabled={isLoading}>
          Fazer Login
        </button>
        <div className="dev-section">
          <p className="dev-label">Modo Desenvolvimento:</p>
          <button className="dev-login-button" onClick={handleDevLogin} disabled={isLoading}>
            {isLoading ? 'Autenticando...' : 'Login de Teste'}
          </button>
        </div>
      </div>
    </div>
  )
}
