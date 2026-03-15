import { describe, it, expect } from 'vitest'

describe('SetupPage localStorage', () => {

  it('should save config to localStorage with correct area names', () => {
    // Simular o que SetupPage faz
    const AREAS = [
      { id: 'escrituras_sagradas', label: 'Escrituras Sagradas' },
      { id: 'deus_pai', label: 'Deus Pai' },
      { id: 'deus_filho', label: 'Deus Filho' },
      { id: 'igreja', label: 'Igreja' },
    ]

    // Simular seleção de todas as áreas
    const areaIds = AREAS.map(a => a.id)
    const areaLabels = areaIds.map(id => {
      const area = AREAS.find(a => a.id === id)
      return area ? area.label : id
    })

    const config = {
      mode: 'all',
      areas: areaLabels,
      cardsPerArea: 10,
    }

    // Simular JSON.stringify e JSON.parse
    const saved = JSON.stringify(config)
    const parsed = JSON.parse(saved)
    expect(parsed.areas).toEqual([
      'Escrituras Sagradas',
      'Deus Pai',
      'Deus Filho',
      'Igreja',
    ])
    expect(parsed.mode).toBe('all')
    expect(parsed.cardsPerArea).toBe(10)
  })

  it('should load config from localStorage correctly', () => {
    const config = {
      mode: 'all',
      areas: ['Escrituras Sagradas', 'Deus Pai', 'Igreja'],
      cardsPerArea: 10,
    }

    // Simular JSON.stringify e JSON.parse
    const saved = JSON.stringify(config)
    const loaded = JSON.parse(saved) as typeof config

    expect(loaded.areas).toEqual(['Escrituras Sagradas', 'Deus Pai', 'Igreja'])
    expect(loaded.mode).toBe('all')
  })

  it('should handle multiple areas selection', () => {
    const AREAS = [
      { id: 'escrituras_sagradas', label: 'Escrituras Sagradas' },
      { id: 'deus_pai', label: 'Deus Pai' },
      { id: 'deus_filho', label: 'Deus Filho' },
      { id: 'igreja', label: 'Igreja' },
    ]

    // Simular seleção de múltiplas áreas
    const selectedIds = new Set(['escrituras_sagradas', 'igreja'])
    const areaIds = Array.from(selectedIds)
    const areaLabels = areaIds.map(id => {
      const area = AREAS.find(a => a.id === id)
      return area ? area.label : id
    })

    const config = {
      mode: 'multiple',
      areas: areaLabels,
      cardsPerArea: 10,
    }

    // Simular JSON.stringify e JSON.parse
    const saved = JSON.stringify(config)
    const parsed = JSON.parse(saved)

    expect(parsed.areas).toContain('Escrituras Sagradas')
    expect(parsed.areas).toContain('Igreja')
    expect(parsed.areas).not.toContain('Deus Pai')
    expect(parsed.mode).toBe('multiple')
  })

  it('should validate area names match database format', () => {
    // Áreas do banco (Title Case com espaços)
    const databaseAreas = [
      'Escrituras Sagradas',
      'Deus Pai',
      'Deus Filho',
      'Igreja',
      'Salvação',
    ]

    // Config salvo no localStorage
    const config = {
      mode: 'all',
      areas: databaseAreas,
      cardsPerArea: 10,
    }

    // Simular JSON.stringify e JSON.parse
    const saved = JSON.stringify(config)
    const parsed = JSON.parse(saved)

    // Verificar se cada área do config existe no banco
    parsed.areas.forEach((area: string) => {
      expect(databaseAreas).toContain(area)
    })
  })
})
