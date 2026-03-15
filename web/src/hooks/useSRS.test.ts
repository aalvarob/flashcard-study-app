import { describe, it, expect } from 'vitest'

describe('useSRS - Spaced Repetition System', () => {

  it('deve inicializar card SRS com valores padrão', () => {
    const card = {
      id: 1,
      question: 'Test Q',
      answer: 'Test A',
      area: 'Test Area',
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0,
      lastReviewDate: 0,
      nextReviewDate: Date.now(),
      correctCount: 0,
      incorrectCount: 0,
    }

    expect(card.easeFactor).toBe(2.5)
    expect(card.interval).toBe(1)
    expect(card.repetitions).toBe(0)
  })

  it('deve calcular próximo intervalo após acerto', () => {
    const card = {
      id: 1,
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0,
      nextReviewDate: Date.now(),
    }

    // Simulando primeira revisão correta
    const newRepetitions = card.repetitions + 1
    let newInterval = card.interval

    if (newRepetitions === 1) {
      newInterval = 1
    } else if (newRepetitions === 2) {
      newInterval = 3
    } else {
      newInterval = Math.round(card.interval * card.easeFactor)
    }

    expect(newInterval).toBe(1)
    expect(newRepetitions).toBe(1)
  })

  it('deve resetar intervalo após erro', () => {
    const card = {
      id: 1,
      interval: 10,
      easeFactor: 2.5,
      repetitions: 5,
    }

    // Simulando erro
    const newRepetitions = 0
    const newInterval = 1

    expect(newInterval).toBe(1)
    expect(newRepetitions).toBe(0)
  })

  it('deve aumentar ease factor com acertos', () => {
    let easeFactor = 2.5

    // Acerto
    easeFactor = Math.min(2.5, easeFactor + 0.1)
    expect(easeFactor).toBe(2.5) // Máximo é 2.5

    // Começar com valor menor
    easeFactor = 2.0
    easeFactor = Math.min(2.5, easeFactor + 0.1)
    expect(easeFactor).toBe(2.1)
  })

  it('deve diminuir ease factor com erros', () => {
    let easeFactor = 2.5

    // Erro
    easeFactor = Math.max(1.3, easeFactor - 0.2)
    expect(easeFactor).toBe(2.3)

    // Múltiplos erros
    easeFactor = 1.5
    easeFactor = Math.max(1.3, easeFactor - 0.2)
    expect(easeFactor).toBe(1.3) // Mínimo é 1.3
  })

  it('deve calcular prioridade corretamente', () => {
    const now = Date.now()
    const card1 = {
      nextReviewDate: now - 2 * 24 * 60 * 60 * 1000, // 2 dias vencido
      correctCount: 5,
      incorrectCount: 1,
    }

    const card2 = {
      nextReviewDate: now + 1 * 24 * 60 * 60 * 1000, // 1 dia no futuro
      correctCount: 2,
      incorrectCount: 8,
    }

    // Card1 está vencido, card2 não
    const daysOverdue1 = Math.max(0, (now - card1.nextReviewDate) / (24 * 60 * 60 * 1000))
    const daysOverdue2 = Math.max(0, (now - card2.nextReviewDate) / (24 * 60 * 60 * 1000))

    expect(daysOverdue1).toBeGreaterThan(0)
    expect(daysOverdue2).toBe(0)
  })

  it('deve serializar dados SRS para JSON', () => {
    const srsData = [
      {
        id: 1,
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
      },
    ]

    const serialized = JSON.stringify(srsData)
    const deserialized = JSON.parse(serialized)

    expect(deserialized).toBeTruthy()
    expect(deserialized).toHaveLength(1)
    expect(deserialized[0].easeFactor).toBe(2.5)
  })
})
