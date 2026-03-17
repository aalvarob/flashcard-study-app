import { useNavigate, useLocation } from 'react-router-dom'
import './Header.css'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <h1>Preparátorio para o Exame ao Ministério Pastoral Batista</h1>
        </div>
        
        <nav className="header-nav">
          <button
            className={`nav-button ${isActive('/') ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            Home
          </button>
          <button
            className={`nav-button ${isActive('/setup') ? 'active' : ''}`}
            onClick={() => navigate('/setup')}
          >
            Setup
          </button>
          <button
            className={`nav-button ${isActive('/study') ? 'active' : ''}`}
            onClick={() => navigate('/study')}
          >
            Estudar
          </button>
          <button
            className={`nav-button ${isActive('/stats') ? 'active' : ''}`}
            onClick={() => navigate('/stats')}
          >
            Estatísticas
          </button>
          <button
            className={`nav-button ${isActive('/admin') ? 'active' : ''}`}
            onClick={() => navigate('/admin')}
          >
            Admin
          </button>
        </nav>
      </div>
    </header>
  )
}
