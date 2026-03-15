import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/setup')
    }
  }, [isAuthenticated, navigate])

  function handleLogin() {
    const baseUrl = window.location.origin
    const redirectUri = `${baseUrl}/oauth/callback`
    const loginUrl = `https://auth.manus.im/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid+profile+email`
    window.location.href = loginUrl
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Simulado Concílio</h1>
        <p>Faça login para começar a estudar</p>
        <button className="login-button" onClick={handleLogin}>
          Fazer Login
        </button>
      </div>
    </div>
  )
}
