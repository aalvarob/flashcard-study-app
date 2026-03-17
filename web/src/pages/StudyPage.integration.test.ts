import { describe, it, expect } from 'vitest'

// Simular dados reais
const mockFlashcards = [
  { id: 1, question: 'Q1', answer: 'A1', area: 'Escrituras Sagradas' },
  { id: 2, question: 'Q2', answer: 'A2', area: 'Escrituras Sagradas' },
  { id: 3, question: 'Q3', answer: 'A3', area: 'Deus Pai' },
  { id: 4, question: 'Q4', answer: 'A4', area: 'Deus Pai' },
  { id: 5, question: 'Q5', answer: 'A5', area: 'Igreja' },
  { id: 6, question: 'Q6', answer: 'A6', area: 'Igreja' },
  { id: 7, question: 'Q7', answer: 'A7', area: 'Igreja' },
  { id: 8, question: 'Q8', answer: 'A8', area: 'Salvação' },
]

describe('StudyPage Integration', () => {
  it('should filter cards correctly when config areas match database areas', () => {
    // Config salvo no localStorage (do SetupPage)
    const config = {
      mode: 'all',
      areas: ['Escrituras Sagradas', 'Deus Pai', 'Igreja'],
      cardsPerArea: 10,
    }

    // Simular o filtro da StudyPage (linha 58)
    const filtered = mockFlashcards.filter(card => config.areas.includes(card.area))

    console.log('Config areas:', config.areas)
    console.log('Flashcards areas:', mockFlashcards.map(c => c.area))
    console.log('Filtered cards:', filtered.length)
    console.log('Filtered:', filtered)

    expect(filtered).toHaveLength(7) // 2 + 2 + 3
    expect(filtered.every(card => config.areas.includes(card.area))).toBe(true)
  })

  it('should handle case-sensitive area matching', () => {
    // Config com áreas em case diferente
    const config = {
      mode: 'all',
      areas: ['escrituras sagradas', 'deus pai'], // lowercase
      cardsPerArea: 10,
    }

    const filtered = mockFlashcards.filter(card => config.areas.includes(card.area))

    // Não deve encontrar nada porque o case é diferente
    expect(filtered).toHaveLength(0)
  })

  it('should debug area comparison', () => {
    const config = {
      mode: 'all',
      areas: ['Escrituras Sagradas', 'Deus Pai'],
      cardsPerArea: 10,
    }

    // Debug: mostrar cada comparação
    mockFlashcards.forEach(card => {
      const isIncluded = config.areas.includes(card.area)
      console.log(`Card area: "${card.area}" | Included: ${isIncluded}`)
      
      // Verificar se há diferença de espaços ou caracteres
      const exactMatch = config.areas.some(area => area === card.area)
      console.log(`  Exact match: ${exactMatch}`)
    })

    const filtered = mockFlashcards.filter(card => config.areas.includes(card.area))
    expect(filtered).toHaveLength(4) // 2 + 2
  })

  it('should handle all areas selection', () => {
    const allAreas = [
      'Escrituras Sagradas',
      'Deus Pai',
      'Igreja',
      'Salvação',
    ]

    const config = {
      mode: 'all',
      areas: allAreas,
      cardsPerArea: 10,
    }

    const filtered = mockFlashcards.filter(card => config.areas.includes(card.area))
    expect(filtered).toHaveLength(8) // Todos
  })

  it('should simulate complete StudyPage flow', () => {
    // 1. SetupPage salva config
    const config = {
      mode: 'all',
      areas: ['Escrituras Sagradas', 'Deus Pai'],
      cardsPerArea: 2,
    }

    // 2. StudyPage carrega flashcards
    const flashcards = mockFlashcards

    // 3. StudyPage filtra por áreas
    let filtered = flashcards.filter(card => config.areas.includes(card.area))
    console.log('Filtered count:', filtered.length)
    expect(filtered).toHaveLength(4)

    // 4. Distribuir cards por área (lógica unificada: cardsPerArea por área)
    const selectedCards: typeof flashcards = []
    const areaMap: Record<string, typeof flashcards> = {}

    filtered.forEach(card => {
      if (!areaMap[card.area]) {
        areaMap[card.area] = []
      }
      areaMap[card.area].push(card)
    })

    config.areas.forEach(area => {
      if (areaMap[area]) {
        const toSelect = Math.min(config.cardsPerArea, areaMap[area].length)
        selectedCards.push(...areaMap[area].slice(0, toSelect))
      }
    })

    filtered = selectedCards
    console.log('Final cards:', filtered.length)
    // 2 áreas × 2 cards por área = 4 cards
    expect(filtered).toHaveLength(4)
  })
})
