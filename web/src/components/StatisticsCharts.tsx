import { useMemo, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import './StatisticsCharts.css'

interface StudySession {
  id: string
  date: string
  totalCards: number
  correctCards: number
  areas: string[]
  duration: number
}

interface StatisticsChartsProps {
  sessions: StudySession[]
}

export function StatisticsCharts({ sessions }: StatisticsChartsProps) {
  const [period, setPeriod] = useState<'7d' | '30d' | 'all'>('30d')

  // Filtrar sessões pelo período
  const filteredSessions = useMemo(() => {
    const now = new Date()
    const cutoffDate = new Date()

    if (period === '7d') {
      cutoffDate.setDate(cutoffDate.getDate() - 7)
    } else if (period === '30d') {
      cutoffDate.setDate(cutoffDate.getDate() - 30)
    }

    return sessions.filter(session => new Date(session.date) >= cutoffDate)
  }, [sessions, period])

  // Dados para gráfico de progresso (acertos ao longo do tempo)
  const progressData = useMemo(() => {
    return filteredSessions
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(session => ({
        date: new Date(session.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
        acertos: session.correctCards,
        total: session.totalCards,
        taxa: Math.round((session.correctCards / session.totalCards) * 100),
      }))
  }, [filteredSessions])

  // Dados para gráfico por área
  const areaData = useMemo(() => {
    const areaStats: Record<string, { total: number; correct: number }> = {}

    filteredSessions.forEach(session => {
      session.areas.forEach(area => {
        if (!areaStats[area]) {
          areaStats[area] = { total: 0, correct: 0 }
        }
        // Distribuir cards igualmente entre áreas
        const cardsPerArea = session.totalCards / session.areas.length
        const correctPerArea = (session.correctCards / session.totalCards) * cardsPerArea
        areaStats[area].total += cardsPerArea
        areaStats[area].correct += correctPerArea
      })
    })

    return Object.entries(areaStats).map(([area, stats]) => ({
      area: area.substring(0, 15) + (area.length > 15 ? '...' : ''),
      taxa: Math.round((stats.correct / stats.total) * 100),
      total: Math.round(stats.total),
    }))
  }, [filteredSessions])

  // Dados para gráfico de tempo de estudo
  const timeData = useMemo(() => {
    const days = new Map<string, number>()

    filteredSessions.forEach(session => {
      const date = new Date(session.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })
      days.set(date, (days.get(date) || 0) + session.duration)
    })

    return Array.from(days.entries()).map(([date, duration]) => ({
      date,
      minutos: duration,
    }))
  }, [filteredSessions])

  // Estatísticas gerais
  const stats = useMemo(() => {
    const totalSessions = filteredSessions.length
    const totalCards = filteredSessions.reduce((sum, s) => sum + s.totalCards, 0)
    const totalCorrect = filteredSessions.reduce((sum, s) => sum + s.correctCards, 0)
    const totalTime = filteredSessions.reduce((sum, s) => sum + s.duration, 0)
    const averageRate = totalCards > 0 ? Math.round((totalCorrect / totalCards) * 100) : 0

    return {
      totalSessions,
      totalCards,
      totalCorrect,
      totalTime,
      averageRate,
    }
  }, [filteredSessions])

  const COLORS = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#f56565', '#38b2ac']

  return (
    <div className="statistics-charts">
      {/* Filtros de período */}
      <div className="period-filters">
        <button
          className={`period-button ${period === '7d' ? 'active' : ''}`}
          onClick={() => setPeriod('7d')}
        >
          Últimos 7 dias
        </button>
        <button
          className={`period-button ${period === '30d' ? 'active' : ''}`}
          onClick={() => setPeriod('30d')}
        >
          Últimos 30 dias
        </button>
        <button
          className={`period-button ${period === 'all' ? 'active' : ''}`}
          onClick={() => setPeriod('all')}
        >
          Tudo
        </button>
      </div>

      {/* Estatísticas Gerais */}
      <div className="stats-summary">
        <div className="stat-box">
          <span className="stat-label">Simulados</span>
          <span className="stat-value">{stats.totalSessions}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Cards Estudados</span>
          <span className="stat-value">{stats.totalCards}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Taxa Média</span>
          <span className="stat-value">{stats.averageRate}%</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Tempo Total</span>
          <span className="stat-value">{stats.totalTime}h</span>
        </div>
      </div>

      {/* Gráfico de Progresso */}
      {progressData.length > 0 && (
        <div className="chart-container">
          <h3>Progresso de Acertos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#718096" />
              <YAxis stroke="#718096" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}
                formatter={(value) => `${value}%`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="taxa"
                stroke="#4299e1"
                strokeWidth={2}
                dot={{ fill: '#4299e1', r: 4 }}
                activeDot={{ r: 6 }}
                name="Taxa de Acerto (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráfico por Área */}
      {areaData.length > 0 && (
        <div className="chart-container">
          <h3>Taxa de Acerto por Área</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="area" stroke="#718096" />
              <YAxis stroke="#718096" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}
                formatter={(value) => `${value}%`}
              />
              <Legend />
              <Bar dataKey="taxa" fill="#4299e1" name="Taxa de Acerto (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráfico de Tempo de Estudo */}
      {timeData.length > 0 && (
        <div className="chart-container">
          <h3>Tempo de Estudo Diário</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#718096" />
              <YAxis stroke="#718096" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}
                formatter={(value) => `${value} min`}
              />
              <Legend />
              <Bar dataKey="minutos" fill="#48bb78" name="Minutos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {filteredSessions.length === 0 && (
        <div className="empty-state">
          <p>Nenhuma sessão de estudo neste período</p>
        </div>
      )}
    </div>
  )
}
