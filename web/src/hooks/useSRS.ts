import { useState, useEffect, useCallback } from 'react'

export interface SRSCard {
  id: number
  question: string
  answer: string
  area: string
  interval: number // dias até próxima revisão
  easeFactor: number // fator de dificuldade (1.3 a 2.5)
  repetitions: number // número de vezes revisado
  lastReviewDate: number // timestamp da última revisão
  nextReviewDate: number // timestamp da próxima revisão
  correctCount: number // número de acertos
  incorrectCount: number // número de erros
}

interface UseSRSResult {
  srsCards: SRSCard[]
  dueCards: SRSCard[]
  updateCardReview: (cardId: number, isCorrect: boolean) => void
  getCardPriority: (card: SRSCard) => number
}

/**
 * Hook para implementar Spaced Repetition System (SRS)
 * Algoritmo SM-2 adaptado para priorizar cards com menor taxa de acerto
 */
export function useSRS(cards: any[]): UseSRSResult {
  const [srsCards, setSrsCards] = useState<SRSCard[]>([])

  // Inicializar cards com dados SRS
  useEffect(() => {
    const saved = localStorage.getItem('srsCards')
    if (saved) {
      try {
        setSrsCards(JSON.parse(saved))
      } catch (err) {
        console.error('Erro ao carregar dados SRS:', err)
        initializeSRSCards()
      }
    } else {
      initializeSRSCards()
    }
  }, [])

  function initializeSRSCards() {
    const initialized: SRSCard[] = cards.map(card => ({
      id: card.id,
      question: card.question,
      answer: card.answer,
      area: card.area,
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0,
      lastReviewDate: 0,
      nextReviewDate: Date.now(),
      correctCount: 0,
      incorrectCount: 0,
    }))
    setSrsCards(initialized)
    localStorage.setItem('srsCards', JSON.stringify(initialized))
  }

  // Calcular cards que estão vencidos (prontos para revisão)
  const dueCards = srsCards.filter(card => card.nextReviewDate <= Date.now())

  const updateCardReview = useCallback((cardId: number, isCorrect: boolean) => {
    setSrsCards(prev => {
      const updated = prev.map(card => {
        if (card.id !== cardId) return card

        const now = Date.now()
        let newInterval = card.interval
        let newEaseFactor = card.easeFactor
        let newRepetitions = card.repetitions

        if (isCorrect) {
          // Acerto: aumentar intervalo
          newRepetitions = card.repetitions + 1

          if (newRepetitions === 1) {
            newInterval = 1
          } else if (newRepetitions === 2) {
            newInterval = 3
          } else {
            newInterval = Math.round(card.interval * card.easeFactor)
          }

          // Aumentar ease factor (máximo 2.5)
          newEaseFactor = Math.min(2.5, card.easeFactor + 0.1)
        } else {
          // Erro: resetar e diminuir ease factor
          newRepetitions = 0
          newInterval = 1
          newEaseFactor = Math.max(1.3, card.easeFactor - 0.2)
        }

        const nextReviewDate = now + newInterval * 24 * 60 * 60 * 1000

        return {
          ...card,
          interval: newInterval,
          easeFactor: newEaseFactor,
          repetitions: newRepetitions,
          lastReviewDate: now,
          nextReviewDate,
          correctCount: isCorrect ? card.correctCount + 1 : card.correctCount,
          incorrectCount: !isCorrect ? card.incorrectCount + 1 : card.incorrectCount,
        }
      })

      localStorage.setItem('srsCards', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Calcular prioridade de um card (quanto menor, maior a prioridade)
  const getCardPriority = useCallback((card: SRSCard): number => {
    const now = Date.now()
    const daysOverdue = Math.max(0, (now - card.nextReviewDate) / (24 * 60 * 60 * 1000))
    const successRate = card.correctCount / Math.max(1, card.correctCount + card.incorrectCount)

    // Prioridade baseada em:
    // 1. Dias vencidos (quanto mais vencido, maior a prioridade)
    // 2. Taxa de acerto (quanto menor, maior a prioridade)
    return daysOverdue * 10 + (1 - successRate) * 100
  }, [])

  return {
    srsCards,
    dueCards,
    updateCardReview,
    getCardPriority,
  }
}
