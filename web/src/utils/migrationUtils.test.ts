import { describe, it, expect } from 'vitest'
import {
  migrateCardsAreas,
  isOldArea,
  getNewArea,
  getOldAreas,
  getNewAreas,
} from './migrationUtils'

describe('Migration Utils - Migração de Áreas', () => {
  it('deve migrar cards com áreas antigas para novas áreas teológicas', () => {
    const cards = [
      {
        id: '1',
        question: 'Pergunta 1',
        answer: 'Resposta 1',
        area: 'Direito Constitucional',
      },
      {
        id: '2',
        question: 'Pergunta 2',
        answer: 'Resposta 2',
        area: 'Direito Civil',
      },
    ]

    const migratedCards = migrateCardsAreas(cards)

    expect(migratedCards[0].area).toBe('Escrituras Sagradas')
    expect(migratedCards[1].area).toBe('Deus Filho')
  })

  it('deve manter cards com áreas que não estão no mapeamento', () => {
    const cards = [
      {
        id: '1',
        question: 'Pergunta 1',
        answer: 'Resposta 1',
        area: 'Área Desconhecida',
      },
    ]

    const migratedCards = migrateCardsAreas(cards)

    expect(migratedCards[0].area).toBe('Área Desconhecida')
  })

  it('deve identificar áreas antigas corretamente', () => {
    expect(isOldArea('Direito Constitucional')).toBe(true)
    expect(isOldArea('Direito Civil')).toBe(true)
    expect(isOldArea('Deus Pai')).toBe(false)
    expect(isOldArea('Área Desconhecida')).toBe(false)
  })

  it('deve retornar a nova área para uma área antiga', () => {
    expect(getNewArea('Direito Constitucional')).toBe('Escrituras Sagradas')
    expect(getNewArea('Direito Civil')).toBe('Deus Filho')
    expect(getNewArea('Direito de Família')).toBe('Justos e Ímpios')
  })

  it('deve retornar a área original se não encontrada no mapeamento', () => {
    expect(getNewArea('Área Desconhecida')).toBe('Área Desconhecida')
  })

  it('deve retornar todas as áreas antigas', () => {
    const oldAreas = getOldAreas()

    expect(oldAreas).toContain('Direito Constitucional')
    expect(oldAreas).toContain('Direito Civil')
    expect(oldAreas).toContain('Direito Penal')
    expect(oldAreas.length).toBeGreaterThan(0)
  })

  it('deve retornar todas as novas áreas teológicas', () => {
    const newAreas = getNewAreas()

    expect(newAreas).toContain('Escrituras Sagradas')
    expect(newAreas).toContain('Deus Pai')
    expect(newAreas).toContain('Deus Filho')
    expect(newAreas).toContain('Deus Espírito Santo')
    expect(newAreas.length).toBeGreaterThan(0)
  })

  it('deve migrar múltiplos cards mantendo IDs e conteúdo', () => {
    const cards = [
      {
        id: '1',
        question: 'Pergunta 1',
        answer: 'Resposta 1',
        area: 'Direito Constitucional',
      },
      {
        id: '2',
        question: 'Pergunta 2',
        answer: 'Resposta 2',
        area: 'Direito Administrativo',
      },
      {
        id: '3',
        question: 'Pergunta 3',
        answer: 'Resposta 3',
        area: 'Direito Penal',
      },
    ]

    const migratedCards = migrateCardsAreas(cards)

    expect(migratedCards.length).toBe(3)
    expect(migratedCards[0].id).toBe('1')
    expect(migratedCards[0].question).toBe('Pergunta 1')
    expect(migratedCards[1].id).toBe('2')
    expect(migratedCards[2].area).toBe('Homem')
  })

  it('deve retornar array vazio para cards vazio', () => {
    const cards: any[] = []
    const migratedCards = migrateCardsAreas(cards)

    expect(migratedCards.length).toBe(0)
  })

  it('deve não modificar o array original', () => {
    const cards = [
      {
        id: '1',
        question: 'Pergunta 1',
        answer: 'Resposta 1',
        area: 'Direito Constitucional',
      },
    ]

    const originalArea = cards[0].area
    migrateCardsAreas(cards)

    expect(cards[0].area).toBe(originalArea)
  })
})
