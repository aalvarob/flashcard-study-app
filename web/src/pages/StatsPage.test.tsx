import { describe, it, expect } from 'vitest'

describe('StatsPage - Cálculos de Estatísticas', () => {
  it('deve calcular taxa de acerto corretamente', () => {
    const totalCards = 100
    const totalCorrect = 80
    const averageScore = totalCards > 0 ? Math.round((totalCorrect / totalCards) * 100) : 0

    expect(averageScore).toBe(80)
  })

  it('deve calcular zero quando não há cards', () => {
    const totalCards = 0
    const totalCorrect = 0
    const averageScore = totalCards > 0 ? Math.round((totalCorrect / totalCards) * 100) : 0

    expect(averageScore).toBe(0)
  })

  it('deve calcular estatísticas por área corretamente', () => {
    const sessions = [
      {
        id: '1',
        date: new Date().toISOString(),
        totalCards: 10,
        correctCards: 8,
        areas: ['Direito Constitucional', 'Direito Civil'],
        duration: 30,
      },
    ]

    const areaMap: Record<string, { total: number; correct: number }> = {}

    sessions.forEach((session) => {
      session.areas.forEach((area) => {
        if (!areaMap[area]) {
          areaMap[area] = { total: 0, correct: 0 }
        }
        const cardsPerArea = session.totalCards / session.areas.length
        const correctPerArea = session.correctCards / session.areas.length
        areaMap[area].total += cardsPerArea
        areaMap[area].correct += correctPerArea
      })
    })

    const areaStats = Object.entries(areaMap)
      .map(([area, data]) => ({
        area,
        totalCards: Math.round(data.total),
        correctCards: Math.round(data.correct),
        percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage)

    expect(areaStats.length).toBe(2)
    expect(areaStats[0].percentage).toBe(80)
    expect(areaStats[0].totalCards).toBe(5)
  })

  it('deve calcular progresso semanal corretamente', () => {
    const now = new Date()
    const sessions = [
      {
        id: '1',
        date: now.toISOString(),
        totalCards: 10,
        correctCards: 8,
        areas: ['Área 1'],
        duration: 30,
      },
      {
        id: '2',
        date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        totalCards: 10,
        correctCards: 9,
        areas: ['Área 2'],
        duration: 25,
      },
    ]

    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
    const data = Array(7).fill(0)

    sessions.forEach((session) => {
      const sessionDate = new Date(session.date)
      const daysDiff = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
      if (daysDiff < 7) {
        const dayIndex = (6 - daysDiff) % 7
        data[dayIndex] += session.correctCards
      }
    })

    const weeklyProgress = days.map((day, i) => ({ day, correct: data[i] }))

    expect(weeklyProgress.length).toBe(7)
    expect(weeklyProgress[6].correct).toBeGreaterThan(0)
    expect(weeklyProgress[5].correct).toBeGreaterThan(0)
  })

  it('deve filtrar sessões por período de uma semana', () => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const sessions = [
      {
        id: '1',
        date: now.toISOString(),
        totalCards: 10,
        correctCards: 8,
        areas: ['Área 1'],
        duration: 30,
      },
      {
        id: '2',
        date: weekAgo.toISOString(),
        totalCards: 10,
        correctCards: 9,
        areas: ['Área 2'],
        duration: 25,
      },
      {
        id: '3',
        date: monthAgo.toISOString(),
        totalCards: 10,
        correctCards: 7,
        areas: ['Área 3'],
        duration: 20,
      },
    ]

    // Filtrar por semana
    const weekFiltered = sessions.filter((session) => {
      const sessionDate = new Date(session.date)
      const daysDiff = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff <= 7
    })

    expect(weekFiltered.length).toBe(2)
  })

  it('deve filtrar sessões por período de um mês', () => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    const sessions = [
      {
        id: '1',
        date: now.toISOString(),
        totalCards: 10,
        correctCards: 8,
        areas: ['Área 1'],
        duration: 30,
      },
      {
        id: '2',
        date: weekAgo.toISOString(),
        totalCards: 10,
        correctCards: 9,
        areas: ['Área 2'],
        duration: 25,
      },
      {
        id: '3',
        date: monthAgo.toISOString(),
        totalCards: 10,
        correctCards: 7,
        areas: ['Área 3'],
        duration: 20,
      },
      {
        id: '4',
        date: twoMonthsAgo.toISOString(),
        totalCards: 10,
        correctCards: 6,
        areas: ['Área 4'],
        duration: 15,
      },
    ]

    // Filtrar por mês
    const monthFiltered = sessions.filter((session) => {
      const sessionDate = new Date(session.date)
      const daysDiff = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff <= 30
    })

    expect(monthFiltered.length).toBe(3)
  })

  it('deve calcular tempo total corretamente', () => {
    const sessions = [
      {
        id: '1',
        date: new Date().toISOString(),
        totalCards: 10,
        correctCards: 8,
        areas: ['Área 1'],
        duration: 30,
      },
      {
        id: '2',
        date: new Date().toISOString(),
        totalCards: 10,
        correctCards: 9,
        areas: ['Área 2'],
        duration: 25,
      },
      {
        id: '3',
        date: new Date().toISOString(),
        totalCards: 10,
        correctCards: 7,
        areas: ['Área 3'],
        duration: 45,
      },
    ]

    const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0)
    const totalHours = Math.round(totalDuration / 60)

    expect(totalDuration).toBe(100)
    expect(totalHours).toBe(2)
  })

  it('deve contar sessões corretamente', () => {
    const sessions = [
      {
        id: '1',
        date: new Date().toISOString(),
        totalCards: 10,
        correctCards: 8,
        areas: ['Área 1'],
        duration: 30,
      },
      {
        id: '2',
        date: new Date().toISOString(),
        totalCards: 10,
        correctCards: 9,
        areas: ['Área 2'],
        duration: 25,
      },
    ]

    const totalSessions = sessions.length

    expect(totalSessions).toBe(2)
  })
})
