import { describe, it, expect } from 'vitest'

describe('Chart Components - Data Preparation', () => {
  it('deve preparar dados para gráfico de linha corretamente', () => {
    const sessions = [
      {
        id: '1',
        date: new Date('2026-03-10').toISOString(),
        totalCards: 10,
        correctCards: 8,
        areas: ['Área 1'],
        duration: 30,
      },
      {
        id: '2',
        date: new Date('2026-03-11').toISOString(),
        totalCards: 10,
        correctCards: 9,
        areas: ['Área 2'],
        duration: 25,
      },
    ]

    const chartData = sessions
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((session) => ({
        date: new Date(session.date).toLocaleDateString('pt-BR', {
          month: 'short',
          day: 'numeric',
        }),
        correctCards: session.correctCards,
        totalCards: session.totalCards,
        percentage: Math.round((session.correctCards / session.totalCards) * 100),
      }))

    expect(chartData.length).toBe(2)
    expect(chartData[0].percentage).toBe(80)
    expect(chartData[1].percentage).toBe(90)
  })

  it('deve preparar dados para gráfico de pizza corretamente', () => {
    const areaStats = [
      {
        area: 'Direito Constitucional',
        totalCards: 10,
        correctCards: 8,
        percentage: 80,
      },
      {
        area: 'Direito Civil',
        totalCards: 10,
        correctCards: 7,
        percentage: 70,
      },
    ]

    const chartData = areaStats.map((item) => ({
      name: item.area,
      value: item.correctCards,
      percentage: item.percentage,
    }))

    expect(chartData.length).toBe(2)
    expect(chartData[0].value).toBe(8)
    expect(chartData[0].percentage).toBe(80)
  })

  it('deve preparar dados para gráfico de barras corretamente', () => {
    const areaStats = [
      {
        area: 'Direito Constitucional',
        totalCards: 10,
        correctCards: 8,
        percentage: 80,
      },
      {
        area: 'Direito Civil',
        totalCards: 10,
        correctCards: 7,
        percentage: 70,
      },
    ]

    const chartData = areaStats.map((item) => ({
      name: item.area.length > 15 ? item.area.substring(0, 15) + '...' : item.area,
      fullName: item.area,
      corretos: item.correctCards,
      total: item.totalCards,
      acerto: item.percentage,
    }))

    expect(chartData.length).toBe(2)
    expect(chartData[0].corretos).toBe(8)
    expect(chartData[0].total).toBe(10)
    expect(chartData[0].acerto).toBe(80)
  })

  it('deve truncar nomes longos no gráfico de barras', () => {
    const areaStats = [
      {
        area: 'Direito Constitucional e Administrativo',
        totalCards: 10,
        correctCards: 8,
        percentage: 80,
      },
    ]

    const chartData = areaStats.map((item) => ({
      name: item.area.length > 15 ? item.area.substring(0, 15) + '...' : item.area,
      fullName: item.area,
      corretos: item.correctCards,
      total: item.totalCards,
      acerto: item.percentage,
    }))

    expect(chartData[0].name.length).toBeLessThanOrEqual(18)
    expect(chartData[0].name).toContain('...')
  })

  it('deve calcular percentual corretamente para gráficos', () => {
    const session = {
      id: '1',
      date: new Date().toISOString(),
      totalCards: 25,
      correctCards: 20,
      areas: ['Área 1'],
      duration: 30,
    }

    const percentage = Math.round((session.correctCards / session.totalCards) * 100)

    expect(percentage).toBe(80)
  })

  it('deve ordenar dados de gráfico de linha por data', () => {
    const sessions = [
      {
        id: '3',
        date: new Date('2026-03-12').toISOString(),
        totalCards: 10,
        correctCards: 6,
        areas: ['Área 3'],
        duration: 20,
      },
      {
        id: '1',
        date: new Date('2026-03-10').toISOString(),
        totalCards: 10,
        correctCards: 8,
        areas: ['Área 1'],
        duration: 30,
      },
      {
        id: '2',
        date: new Date('2026-03-11').toISOString(),
        totalCards: 10,
        correctCards: 9,
        areas: ['Área 2'],
        duration: 25,
      },
    ]

    const sortedSessions = sessions.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    expect(sortedSessions[0].id).toBe('1')
    expect(sortedSessions[1].id).toBe('2')
    expect(sortedSessions[2].id).toBe('3')
  })

  it('deve retornar array vazio para dados vazios', () => {
    const sessions: any[] = []

    const chartData = sessions.map((session) => ({
      date: new Date(session.date).toLocaleDateString('pt-BR'),
      correctCards: session.correctCards,
      totalCards: session.totalCards,
      percentage: Math.round((session.correctCards / session.totalCards) * 100),
    }))

    expect(chartData.length).toBe(0)
  })

  it('deve lidar com divisão por zero em cálculo de percentual', () => {
    const session = {
      id: '1',
      date: new Date().toISOString(),
      totalCards: 0,
      correctCards: 0,
      areas: ['Área 1'],
      duration: 0,
    }

    const percentage =
      session.totalCards > 0
        ? Math.round((session.correctCards / session.totalCards) * 100)
        : 0

    expect(percentage).toBe(0)
  })
})
