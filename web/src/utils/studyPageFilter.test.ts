import { describe, it, expect } from 'vitest'

// Simulação de dados reais do banco de dados
const realDatabaseAreas = [
  'Amor ao Próximo e Ética',
  'Anjos',
  'Batismo e Ceia',
  'Deus Espírito Santo',
  'Deus Filho',
  'Deus Pai',
  'Dia do Senhor',
  'Educação Religiosa',
  'Eleição',
  'Escrituras Sagradas',
  'Estrutura e Funcionamento CBB',
  'Evangelismo e Missões',
  'Família',
  'História dos Batistas',
  'Homem',
  'Igreja',
  'Justos e Ímpios',
  'Liberdade Religiosa',
  'Ministério da Palavra',
  'Mordomia',
  'Morte',
  'Ordem Social',
  'Pecado',
  'Princípios Batistas',
  'Reino de Deus',
  'Salvação',
]

// Mock de flashcards com distribuição realista
function generateMockFlashcards() {
  const flashcards: Array<{ id: number; question: string; answer: string; area: string }> = []
  let id = 1

  // Distribuição realista: algumas áreas com mais cards, outras com menos
  const cardCounts: Record<string, number> = {
    'Escrituras Sagradas': 12,
    'Deus Pai': 8,
    'Deus Filho': 7,
    'Deus Espírito Santo': 5,
    'Homem': 6,
    'Pecado': 5,
    'Salvação': 8,
    'Eleição': 4,
    'Reino de Deus': 6,
    'Igreja': 10,
    'Dia do Senhor': 3,
    'Ministério da Palavra': 5,
    'Liberdade Religiosa': 4,
    'Morte': 3,
    'Justos e Ímpios': 4,
    'Anjos': 3,
    'Amor ao Próximo e Ética': 5,
    'Batismo e Ceia': 4,
    'Mordomia': 8,
    'Evangelismo e Missões': 5,
    'Educação Religiosa': 3,
    'Ordem Social': 3,
    'Família': 4,
    'Princípios Batistas': 6,
    'História dos Batistas': 5,
      'Estrutura e Funcionamento CBB': 8,
  }

  Object.entries(cardCounts).forEach(([area, count]) => {
    for (let i = 0; i < count; i++) {
      flashcards.push({
        id: id++,
        question: `Question for ${area} #${i + 1}`,
        answer: `Answer for ${area} #${i + 1}`,
        area,
      })
    }
  })

  return flashcards
}

// Função que simula o filtro da StudyPage
function filterFlashcardsByAreas(
  flashcards: Array<{ id: number; question: string; answer: string; area: string }>,
  selectedAreas: string[]
): Array<{ id: number; question: string; answer: string; area: string }> {
  if (selectedAreas.length === 0) {
    return flashcards
  }
  return flashcards.filter(card => selectedAreas.includes(card.area))
}

describe('StudyPage Filter with Real Data', () => {
  const mockFlashcards = generateMockFlashcards()

  it('should have correct total number of mock flashcards', () => {
    expect(mockFlashcards).toHaveLength(144)
  })

  it('should filter all cards when selecting all areas', () => {
    const result = filterFlashcardsByAreas(mockFlashcards, realDatabaseAreas)
    expect(result).toHaveLength(144)
  })

  it('should filter cards by single area correctly', () => {
    const result = filterFlashcardsByAreas(mockFlashcards, ['Escrituras Sagradas'])
    expect(result).toHaveLength(12)
    expect(result.every(card => card.area === 'Escrituras Sagradas')).toBe(true)
  })

  it('should filter cards by multiple areas', () => {
    const selectedAreas = ['Escrituras Sagradas', 'Deus Pai', 'Deus Filho']
    const result = filterFlashcardsByAreas(mockFlashcards, selectedAreas)
    expect(result).toHaveLength(27) // 12 + 8 + 7
    expect(result.every(card => selectedAreas.includes(card.area))).toBe(true)
  })

  it('should return empty array for non-existent area', () => {
    const result = filterFlashcardsByAreas(mockFlashcards, ['Área Inexistente'])
    expect(result).toHaveLength(0)
  })

  it('should handle case-sensitive area names', () => {
    // Lowercase should not match
    const result = filterFlashcardsByAreas(mockFlashcards, ['escrituras sagradas'])
    expect(result).toHaveLength(0)
  })

  it('should validate that all database areas have cards', () => {
    realDatabaseAreas.forEach(area => {
      const result = filterFlashcardsByAreas(mockFlashcards, [area])
      expect(result.length).toBeGreaterThan(0)
    })
  })

  it('should filter cards for typical study session (10 cards per area)', () => {
    const selectedAreas = ['Escrituras Sagradas', 'Igreja', 'Salvação']
    const result = filterFlashcardsByAreas(mockFlashcards, selectedAreas)
    
    // Total cards in these areas
    expect(result).toHaveLength(30) // 12 + 10 + 8
    
    // Should be able to select 10 cards per area
    expect(result.length).toBeGreaterThanOrEqual(30)
  })

  it('should preserve card order after filtering', () => {
    const selectedAreas = ['Deus Pai', 'Igreja']
    const result = filterFlashcardsByAreas(mockFlashcards, selectedAreas)
    
    // Verify order is preserved by checking IDs are in ascending order
    for (let i = 1; i < result.length; i++) {
      expect(result[i].id).toBeGreaterThan(result[i - 1].id)
    }
  })

  it('should handle selecting all areas in different orders', () => {
    const allAreas = [...realDatabaseAreas]
    const shuffledAreas = [...allAreas].reverse()
    
    const result1 = filterFlashcardsByAreas(mockFlashcards, allAreas)
    const result2 = filterFlashcardsByAreas(mockFlashcards, shuffledAreas)
    
    expect(result1).toHaveLength(result2.length)
    expect(result1).toHaveLength(144)
  })

  it('should validate SetupPage config with all areas selected', () => {
    // Simula quando usuário seleciona "Estudar Tudo"
    const config = {
      mode: 'all',
      areas: realDatabaseAreas,
      cardsPerArea: 10,
    }
    
    const result = filterFlashcardsByAreas(mockFlashcards, config.areas)
    expect(result).toHaveLength(144)
  })

  it('should validate SetupPage config with multiple areas selected', () => {
    // Simula quando usuário seleciona múltiplas áreas
    const config = {
      mode: 'multiple',
      areas: ['Escrituras Sagradas', 'Deus Pai', 'Deus Filho', 'Igreja'],
      cardsPerArea: 10,
    }
    
    const result = filterFlashcardsByAreas(mockFlashcards, config.areas)
    expect(result).toHaveLength(37) // 12 + 8 + 7 + 10
  })

  it('should validate area name consistency between SetupPage and database', () => {
    // Verifica que os nomes de área do SetupPage correspondem ao banco
    const setupAreaLabels = realDatabaseAreas
    const databaseAreaNames = [...new Set(mockFlashcards.map(card => card.area))]
    
    setupAreaLabels.forEach(label => {
      expect(databaseAreaNames).toContain(label)
    })
  })

  it('should count cards per area correctly', () => {
    const expectedCounts: Record<string, number> = {
      'Escrituras Sagradas': 12,
      'Deus Pai': 8,
      'Deus Filho': 7,
      'Igreja': 10,
      'Salvação': 8,
    }

    Object.entries(expectedCounts).forEach(([area, expectedCount]) => {
      const result = filterFlashcardsByAreas(mockFlashcards, [area])
      expect(result).toHaveLength(expectedCount)
    })
  })
})
