import { describe, it, expect } from 'vitest'

// Mock de dados de flashcards com áreas reais
const mockFlashcards = [
  { id: 1, question: 'Q1', answer: 'A1', area: 'Escrituras Sagradas' },
  { id: 2, question: 'Q2', answer: 'A2', area: 'Escrituras Sagradas' },
  { id: 3, question: 'Q3', answer: 'A3', area: 'Deus Pai' },
  { id: 4, question: 'Q4', answer: 'A4', area: 'Deus Pai' },
  { id: 5, question: 'Q5', answer: 'A5', area: 'Deus Filho' },
  { id: 6, question: 'Q6', answer: 'A6', area: 'Igreja' },
  { id: 7, question: 'Q7', answer: 'A7', area: 'Igreja' },
  { id: 8, question: 'Q8', answer: 'A8', area: 'Igreja' },
  { id: 9, question: 'Q9', answer: 'A9', area: 'Salvação' },
  { id: 10, question: 'Q10', answer: 'A10', area: 'Salvação' },
]

// Função de filtro que será testada
function filterCardsByAreas(
  flashcards: typeof mockFlashcards,
  selectedAreas: string[]
): typeof mockFlashcards {
  if (selectedAreas.length === 0) {
    return flashcards
  }
  return flashcards.filter(card => selectedAreas.includes(card.area))
}

describe('Card Filter Logic', () => {
  it('should return all cards when no areas are selected', () => {
    const result = filterCardsByAreas(mockFlashcards, [])
    expect(result).toHaveLength(10)
    expect(result).toEqual(mockFlashcards)
  })

  it('should filter cards by single area', () => {
    const result = filterCardsByAreas(mockFlashcards, ['Escrituras Sagradas'])
    expect(result).toHaveLength(2)
    expect(result.every(card => card.area === 'Escrituras Sagradas')).toBe(true)
  })

  it('should filter cards by multiple areas', () => {
    const result = filterCardsByAreas(mockFlashcards, ['Deus Pai', 'Deus Filho'])
    expect(result).toHaveLength(3)
    expect(result.every(card => ['Deus Pai', 'Deus Filho'].includes(card.area))).toBe(true)
  })

  it('should return empty array when no cards match selected areas', () => {
    const result = filterCardsByAreas(mockFlashcards, ['Área Inexistente'])
    expect(result).toHaveLength(0)
  })

  it('should handle case-sensitive area matching', () => {
    // Teste para garantir que a comparação é case-sensitive
    const result = filterCardsByAreas(mockFlashcards, ['escrituras sagradas'])
    expect(result).toHaveLength(0) // Não deve encontrar nada com case diferente
  })

  it('should filter cards by area with special characters', () => {
    const result = filterCardsByAreas(mockFlashcards, ['Deus Pai'])
    expect(result).toHaveLength(2)
    expect(result.every(card => card.area === 'Deus Pai')).toBe(true)
  })

  it('should count cards correctly by area', () => {
    const areas = ['Escrituras Sagradas', 'Deus Pai', 'Deus Filho', 'Igreja', 'Salvação']
    const expectedCounts: Record<string, number> = {
      'Escrituras Sagradas': 2,
      'Deus Pai': 2,
      'Deus Filho': 1,
      'Igreja': 3,
      'Salvação': 2,
    }

    areas.forEach(area => {
      const result = filterCardsByAreas(mockFlashcards, [area])
      expect(result).toHaveLength(expectedCounts[area])
    })
  })

  it('should filter cards correctly when selecting multiple areas with different counts', () => {
    const result = filterCardsByAreas(mockFlashcards, ['Escrituras Sagradas', 'Igreja', 'Salvação'])
    expect(result).toHaveLength(7) // 2 + 3 + 2
    
    const areas = result.map(card => card.area)
    expect(areas).toContain('Escrituras Sagradas')
    expect(areas).toContain('Igreja')
    expect(areas).toContain('Salvação')
    expect(areas).not.toContain('Deus Pai')
    expect(areas).not.toContain('Deus Filho')
  })

  it('should handle duplicate areas in selection', () => {
    const result = filterCardsByAreas(mockFlashcards, ['Igreja', 'Igreja', 'Igreja'])
    expect(result).toHaveLength(3)
    expect(result.every(card => card.area === 'Igreja')).toBe(true)
  })

  it('should preserve card order after filtering', () => {
    const result = filterCardsByAreas(mockFlashcards, ['Deus Pai', 'Igreja'])
    const ids = result.map(card => card.id)
    expect(ids).toEqual([3, 4, 6, 7, 8]) // Ordem original preservada
  })
})

describe('Real-world Scenarios', () => {
  it('should simulate StudyPage config with all areas', () => {
    const allAreas = [
      'Escrituras Sagradas',
      'Deus Pai',
      'Deus Filho',
      'Deus Espírito Santo',
      'Homem',
      'Pecado',
      'Salvação',
      'Eleição',
      'Reino de Deus',
      'Igreja',
      'Dia do Senhor',
      'Ministério da Palavra',
      'Liberdade Religiosa',
      'Morte',
      'Justos e Ímpios',
      'Anjos',
      'Amor ao Próximo e Ética',
      'Batismo e Ceia',
      'Mordomia',
      'Evangelismo e Missões',
      'Educação Religiosa',
      'Ordem Social',
      'Família',
      'Princípios Batistas',
      'História dos Batistas',
      'Estrutura e Funcionamento CBB',
    ]

    const result = filterCardsByAreas(mockFlashcards, allAreas)
    expect(result).toHaveLength(10) // Todos os cards do mock correspondem a alguma área
  })

  it('should simulate StudyPage config with selected areas', () => {
    const selectedAreas = ['Igreja', 'Salvação']
    const result = filterCardsByAreas(mockFlashcards, selectedAreas)
    expect(result).toHaveLength(5) // 3 + 2
  })

  it('should handle empty flashcard list', () => {
    const result = filterCardsByAreas([], ['Igreja'])
    expect(result).toHaveLength(0)
  })

  it('should validate area names match database format', () => {
    // Áreas do banco de dados (Title Case com espaços)
    const databaseAreas = [
      'Escrituras Sagradas',
      'Deus Pai',
      'Deus Filho',
      'Deus Espírito Santo',
      'Igreja',
      'Salvação',
    ]

    databaseAreas.forEach(area => {
      const result = filterCardsByAreas(mockFlashcards, [area])
      // Deve encontrar pelo menos alguns cards para áreas válidas
      if (['Escrituras Sagradas', 'Deus Pai', 'Deus Filho', 'Igreja', 'Salvação'].includes(area)) {
        expect(result.length).toBeGreaterThan(0)
      }
    })
  })
})
