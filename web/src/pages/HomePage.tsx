import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './HomePage.css'

interface StudySession {
  id: string
  date: string
  totalCards: number
  correctCards: number
  duration: number
  areas: string[]
}

export default function HomePage() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalCardsStudied: 0,
    averageScore: 0,
    currentStreak: 0,
  })

  useEffect(() => {
    // Load sessions from localStorage
    const savedSessions = JSON.parse(localStorage.getItem('studySessions') || '[]')
    setSessions(savedSessions.slice(0, 5)) // Get last 5 sessions

    // Calculate stats
    if (savedSessions.length > 0) {
      const totalSessions = savedSessions.length
      const totalCardsStudied = savedSessions.reduce(
        (sum: number, session: StudySession) => sum + session.totalCards,
        0
      )
      const averageScore =
        savedSessions.reduce((sum: number, session: StudySession) => {
          return sum + (session.correctCards / session.totalCards) * 100
        }, 0) / totalSessions

      setStats({
        totalSessions,
        totalCardsStudied,
        averageScore: Math.round(averageScore),
        currentStreak: calculateStreak(savedSessions),
      })
    }
  }, [])

  function calculateStreak(sessions: StudySession[]): number {
    if (sessions.length === 0) return 0

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < sessions.length; i++) {
      const sessionDate = new Date(sessions[i].date)
      sessionDate.setHours(0, 0, 0, 0)

      const expectedDate = new Date(today)
      expectedDate.setDate(expectedDate.getDate() - i)

      if (sessionDate.getTime() === expectedDate.getTime()) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  function formatTime(minutes: number): string {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="home-container">
      <div className="home-content">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h1>Bem-vindo ao Simulado para Concílio Pastoral Batista</h1>
          <p>Acompanhe seu progresso e continue estudando</p>
        </section>

        {/* Stats Grid */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.totalSessions}</div>
            <div className="stat-label">Simulados Realizados</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalCardsStudied}</div>
            <div className="stat-label">Cards Estudados</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.averageScore}%</div>
            <div className="stat-label">Taxa de Acerto</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.currentStreak}</div>
            <div className="stat-label">Dias em Sequência</div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Ações Rápidas</h2>
          <div className="action-buttons">
            <button className="action-button primary" onClick={() => navigate('/setup')}>
              📚 Novo Simulado
            </button>
            <button className="action-button secondary" onClick={() => navigate('/stats')}>
              📊 Ver Estatísticas
            </button>
          </div>
        </section>

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <section className="recent-sessions">
            <h2>Últimas Sessões</h2>
            <div className="sessions-list">
              {sessions.map((session) => (
                <div key={session.id} className="session-item">
                  <div className="session-info">
                    <div className="session-date">{formatDate(session.date)}</div>
                    <div className="session-areas">
                      {session.areas.slice(0, 3).join(', ')}
                      {session.areas.length > 3 && ` +${session.areas.length - 3}`}
                    </div>
                  </div>
                  <div className="session-stats">
                    <div className="session-score">
                      {session.correctCards}/{session.totalCards}
                    </div>
                    <div className="session-duration">{formatTime(session.duration)}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {sessions.length === 0 && (
          <section className="empty-state">
            <div className="empty-icon">📚</div>
            <h2>Nenhum simulado realizado ainda</h2>
            <p>Comece a estudar agora e acompanhe seu progresso!</p>
            <button className="action-button primary" onClick={() => navigate('/setup')}>
              Começar Primeiro Simulado
            </button>
          </section>
        )}
      </div>
    </div>
  )
}
