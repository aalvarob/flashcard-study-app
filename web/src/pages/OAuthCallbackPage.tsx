import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import './OAuthCallbackPage.css'

export default function OAuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const error = searchParams.get('error')

      if (error) {
        console.error('OAuth error:', error)
        navigate('/login')
        return
      }

      if (!code) {
        navigate('/login')
        return
      }

      try {
        // Trocar código por token
        const response = await axios.post(
          '/api/trpc/auth.oauthCallback',
          { code },
          { withCredentials: true }
        )

        if (response.data?.result?.data) {
          // Login bem-sucedido, redirecionar para setup
          setTimeout(() => {
            navigate('/setup')
          }, 1000)
        }
      } catch (error) {
        console.error('OAuth callback error:', error)
        navigate('/login')
      }
    }

    if (isAuthenticated) {
      navigate('/setup')
    } else {
      handleCallback()
    }
  }, [searchParams, navigate, isAuthenticated])

  return (
    <div className="callback-container">
      <div className="callback-card">
        <div className="spinner"></div>
        <h2>Processando login...</h2>
        <p>Por favor, aguarde enquanto autenticamos sua conta.</p>
      </div>
    </div>
  )
}
