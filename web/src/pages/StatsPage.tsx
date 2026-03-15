import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import ProgressLineChart from '../components/ProgressLineChart'
import AreaPerformancePieChart from '../components/AreaPerformancePieChart'
import AreaPerformanceBarChart from '../components/AreaPerformanceBarChart'
import './StatsPage.css'
import '../styles/Charts.css'

interface StudySession {
  id: string
  date: string
  totalCards: number
  correctCards: number
  areas: string[]
  duration: number // em minutos
}

interface AreaStats {
  area: string
  totalCards: number
  correctCards: number
  percentage: number
}

export default function StatsPage() {
  const { user, logout, syncData } = useAuth()
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('month')

  // Carregar sessoes do localStorage e sincronizar com servidor
  useEffect(() => {
    const loadAndSync = async () => {
      const saved = localStorage.getItem('studySessions')
      if (saved) {
        setSessions(JSON.parse(saved))
      }
      // Sincronizar dados com servidor
      await syncData()
    }
    loadAndSync()
  }, [syncData])

  // Filtrar sessões por período
  const filteredSessions = useMemo(() => {
    const now = new Date()
    const sessions_data = JSON.parse(localStorage.getItem('studySessions') || '[]') as StudySession[]

    return sessions_data.filter(session => {
      const sessionDate = new Date(session.date)
      const daysDiff = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))

      if (selectedPeriod === 'week') return daysDiff <= 7
      if (selectedPeriod === 'month') return daysDiff <= 30
      return true
    })
  }, [selectedPeriod])

  // Calcular estatísticas gerais
  const stats = useMemo(() => {
    const totalSessions = filteredSessions.length
    const totalCards = filteredSessions.reduce((sum, s) => sum + s.totalCards, 0)
    const totalCorrect = filteredSessions.reduce((sum, s) => sum + s.correctCards, 0)
    const totalDuration = filteredSessions.reduce((sum, s) => sum + s.duration, 0)
    const averageScore = totalCards > 0 ? Math.round((totalCorrect / totalCards) * 100) : 0

    return {
      totalSessions,
      totalCards,
      totalCorrect,
      totalDuration,
      averageScore,
    }
  }, [filteredSessions])

  // Calcular estatísticas por área
  const areaStats = useMemo(() => {
    const areaMap: Record<string, { total: number; correct: number }> = {}

    filteredSessions.forEach(session => {
      session.areas.forEach(area => {
        if (!areaMap[area]) {
          areaMap[area] = { total: 0, correct: 0 }
        }
        // Distribuir cards e acertos proporcionalmente
        const cardsPerArea = session.totalCards / session.areas.length
        const correctPerArea = session.correctCards / session.areas.length
        areaMap[area].total += cardsPerArea
        areaMap[area].correct += correctPerArea
      })
    })

    return Object.entries(areaMap)
      .map(([area, data]) => ({
        area,
        totalCards: Math.round(data.total),
        correctCards: Math.round(data.correct),
        percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage)
  }, [filteredSessions])

  // Gráfico de progresso semanal
  const weeklyProgress = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
    const data = Array(7).fill(0)
    const now = new Date()

    filteredSessions.forEach(session => {
      const sessionDate = new Date(session.date)
      const daysDiff = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
      if (daysDiff < 7) {
        const dayIndex = (6 - daysDiff) % 7
        data[dayIndex] += session.correctCards
      }
    })

    return days.map((day, i) => ({ day, correct: data[i] }))
  }, [filteredSessions])

  const maxDaily = Math.max(...weeklyProgress.map(d => d.correct), 1)

  async function handleLogout() {
    await logout()
  }

  return (
    <div className="stats-container">
      {/* Header */}
      <div className="stats-header">
        <div className="header-content">
          <h1>Estatísticas</h1>
          <p>Acompanhe seu progresso e desempenho</p>
        </div>
        <div className="header-actions">
          <span className="user-name">{user?.name || 'Usuário'}</span>
          <button className="logout-button" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="period-selector">
        <button
          className={`period-button ${selectedPeriod === 'week' ? 'active' : ''}`}
          onClick={() => setSelectedPeriod('week')}
        >
          Última Semana
        </button>
        <button
          className={`period-button ${selectedPeriod === 'month' ? 'active' : ''}`}
          onClick={() => setSelectedPeriod('month')}
        >
          Último Mês
        </button>
        <button
          className={`period-button ${selectedPeriod === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedPeriod('all')}
        >
          Todo o Tempo
        </button>
      </div>

      <div className="stats-content">
        {/* Summary Cards */}
        <div className="stats-summary">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <div className="stat-label">Sessões de Estudo</div>
              <div className="stat-value">{stats.totalSessions}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-label">Taxa de Acerto</div>
              <div className="stat-value">{stats.averageScore}%</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-label">Cartões Estudados</div>
              <div className="stat-value">{stats.totalCards}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-info">
              <div className="stat-label">Tempo Total</div>
              <div className="stat-value">{Math.round(stats.totalDuration / 60)}h</div>
            </div>
          </div>
        </div>

        {/* Progress Line Chart */}
        <div className="chart-section">
          <h2>Progresso ao Longo do Tempo</h2>
          {filteredSessions.length > 0 ? (
            <ProgressLineChart
              data={filteredSessions
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((session) => ({
                  date: new Date(session.date).toLocaleDateString('pt-BR', {
                    month: 'short',
                    day: 'numeric',
                  }),
                  correctCards: session.correctCards,
                  totalCards: session.totalCards,
                  percentage: Math.round((session.correctCards / session.totalCards) * 100),
                }))}
            />
          ) : (
            <div className="empty-state">
              <p>Nenhum dado disponível para exibir o gráfico</p>
            </div>
          )}
        </div>

        {/* Weekly Progress Chart */}
        <div className="chart-section">
          <h2>Progresso Semanal</h2>
          <div className="weekly-chart">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="chart-bar-container">
                <div className="chart-bar-wrapper">
                  <div
                    className="chart-bar"
                    style={{
                      height: `${(day.correct / maxDaily) * 100}%`,
                    }}
                  />
                </div>
                <div className="chart-label">{day.day}</div>
                <div className="chart-value">{day.correct}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Area Performance Charts */}
        {areaStats.length > 0 && (
          <>
            {/* Pie Chart */}
            <div className="chart-section">
              <h2>Distribuição de Acertos por Área</h2>
              <AreaPerformancePieChart data={areaStats} />
            </div>

            {/* Bar Chart */}
            <div className="chart-section">
              <h2>Comparação de Desempenho por Área</h2>
              <AreaPerformanceBarChart data={areaStats} />
            </div>
          </>
        )}

        {/* Areas Performance */}
        <div className="areas-section">
          <h2>Desempenho por Área (Detalhado)</h2>
          {areaStats.length > 0 ? (
            <div className="areas-list">
              {areaStats.map((area, index) => (
                <div key={index} className="area-item">
                  <div className="area-header">
                    <span className="area-name">{area.area}</span>
                    <span className="area-percentage">{area.percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${area.percentage}%`,
                        backgroundColor:
                          area.percentage >= 80
                            ? '#22c55e'
                            : area.percentage >= 60
                              ? '#f59e0b'
                              : '#ef4444',
                      }}
                    />
                  </div>
                  <div className="area-stats">
                    <span>{area.correctCards} de {area.totalCards} cartões</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Nenhum dado de desempenho disponível ainda.</p>
              <p>Complete uma sessão de estudo para ver suas estatísticas.</p>
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        <div className="sessions-section">
          <h2>Sessões Recentes</h2>
          {filteredSessions.length > 0 ? (
            <div className="sessions-list">
              {filteredSessions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((session, index) => (
                  <div key={index} className="session-item">
                    <div className="session-date">
                      {new Date(session.date).toLocaleDateString('pt-BR', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="session-details">
                      <span className="session-score">
                        {Math.round((session.correctCards / session.totalCards) * 100)}% de acerto
                      </span>
                      <span className="session-cards">
                        {session.correctCards}/{session.totalCards} cartões
                      </span>
                    </div>
                    <div className="session-duration">
                      {session.duration} min
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Nenhuma sessão de estudo neste período.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
