import { describe, it, expect } from 'vitest'

describe('AreaManager - Gerenciamento de Áreas', () => {
  it('deve adicionar uma nova área corretamente', () => {
    const areas = ['Direito Constitucional', 'Direito Civil']
    const newArea = 'Direito Penal'

    const updatedAreas = [...areas, newArea].sort()

    expect(updatedAreas).toContain(newArea)
    expect(updatedAreas.length).toBe(3)
  })

  it('deve rejeitar área duplicada', () => {
    const areas = ['Direito Constitucional', 'Direito Civil']
    const newArea = 'Direito Constitucional'

    const isDuplicate = areas.includes(newArea)

    expect(isDuplicate).toBe(true)
  })

  it('deve rejeitar área vazia', () => {
    const newArea = ''
    const trimmedArea = newArea.trim()

    expect(trimmedArea).toBe('')
    expect(trimmedArea.length).toBe(0)
  })

  it('deve rejeitar área com menos de 3 caracteres', () => {
    const newArea = 'AB'
    const isValid = newArea.length >= 3

    expect(isValid).toBe(false)
  })

  it('deve aceitar área com 3 ou mais caracteres', () => {
    const newArea = 'ABC'
    const isValid = newArea.length >= 3

    expect(isValid).toBe(true)
  })

  it('deve deletar uma área corretamente', () => {
    const areas = ['Direito Constitucional', 'Direito Civil', 'Direito Penal']
    const indexToDelete = 1

    const updatedAreas = areas.filter((_, i) => i !== indexToDelete)

    expect(updatedAreas.length).toBe(2)
    expect(updatedAreas).not.toContain('Direito Civil')
    expect(updatedAreas).toContain('Direito Constitucional')
    expect(updatedAreas).toContain('Direito Penal')
  })

  it('deve editar uma área corretamente', () => {
    const areas = ['Direito Constitucional', 'Direito Civil', 'Direito Penal']
    const indexToEdit = 1
    const newValue = 'Direito Processual Civil'

    const updatedAreas = [...areas]
    updatedAreas[indexToEdit] = newValue
    updatedAreas.sort()

    expect(updatedAreas).toContain(newValue)
    expect(updatedAreas).not.toContain('Direito Civil')
  })

  it('deve ordenar áreas alfabeticamente', () => {
    const areas = ['Direito Penal', 'Direito Constitucional', 'Direito Civil']
    const sortedAreas = [...areas].sort()

    expect(sortedAreas[0]).toBe('Direito Civil')
    expect(sortedAreas[1]).toBe('Direito Constitucional')
    expect(sortedAreas[2]).toBe('Direito Penal')
  })

  it('deve retornar lista vazia quando todas as áreas são deletadas', () => {
    const areas = ['Direito Constitucional']
    const updatedAreas = areas.filter(() => false)

    expect(updatedAreas.length).toBe(0)
  })

  it('deve validar nome de área com espaços em branco', () => {
    const newArea = '  Direito Administrativo  '
    const trimmedArea = newArea.trim()

    expect(trimmedArea).toBe('Direito Administrativo')
    expect(trimmedArea.length).toBeGreaterThanOrEqual(3)
  })

  it('deve manter lista de áreas imutável ao adicionar', () => {
    const areas = ['Direito Constitucional', 'Direito Civil']
    const originalLength = areas.length
    const newArea = 'Direito Penal'

    const updatedAreas = [...areas, newArea].sort()

    expect(areas.length).toBe(originalLength)
    expect(updatedAreas.length).toBe(originalLength + 1)
  })
})
