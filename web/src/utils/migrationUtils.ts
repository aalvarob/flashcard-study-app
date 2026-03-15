/**
 * Utilitários para migração de áreas de cards
 * Mapeia áreas antigas (jurídicas) para novas áreas (teológicas)
 */

interface Card {
  id: string
  question: string
  answer: string
  area: string
}

// Mapeamento de áreas antigas para novas áreas teológicas
const AREA_MAPPING: { [key: string]: string } = {
  // Áreas jurídicas antigas mapeadas para áreas teológicas
  'Direito Constitucional': 'Escrituras Sagradas',
  'Direito Administrativo': 'Deus Pai',
  'Direito Civil': 'Deus Filho',
  'Direito Processual Civil': 'Deus Espírito Santo',
  'Direito Penal': 'Homem',
  'Direito Processual Penal': 'Pecado',
  'Direito Tributário': 'Salvação',
  'Direito Comercial': 'Eleição',
  'Direito do Trabalho': 'Reino de Deus',
  'Direito Previdenciário': 'Igreja',
  'Direito Ambiental': 'Dia do Senhor',
  'Direito Internacional': 'Ministério da Palavra',
  'Direito Eleitoral': 'Liberdade Religiosa',
  'Direito Notarial e Registral': 'Morte',
  'Direito de Família': 'Justos e Ímpios',
  'Direito das Sucessões': 'Anjos',
  'Direito Imobiliário': 'Amor ao Próximo e Ética',
  'Direito do Consumidor': 'Batismo e Ceia',
  'Direito Autoral': 'Mordomia',
  'Direito de Propriedade Intelectual': 'Evangelismo e Missões',
  'Direito Bancário': 'Educação Religiosa',
  'Direito Securitário': 'Ordem Social',
  'Direito Societário': 'Família',
  'Direito Contratual': 'Princípios Batistas',
  'Direito da Concorrência': 'História dos Batistas',
  'Direito Regulatório': 'Estrutura e Funcionamento CBB',
  'Direito Público': 'Escrituras Sagradas',
}

/**
 * Migra cards com áreas antigas para as novas áreas teológicas
 * @param cards - Array de cards a serem migrados
 * @returns Array de cards com áreas atualizadas
 */
export function migrateCardsAreas(cards: Card[]): Card[] {
  return cards.map((card) => {
    const newArea = AREA_MAPPING[card.area] || card.area
    return {
      ...card,
      area: newArea,
    }
  })
}

/**
 * Verifica se um card tem uma área antiga (jurídica)
 * @param area - Nome da área
 * @returns true se a área está no mapeamento
 */
export function isOldArea(area: string): boolean {
  return area in AREA_MAPPING
}

/**
 * Obtém a nova área teológica para uma área antiga
 * @param oldArea - Nome da área antiga
 * @returns Nome da nova área teológica ou a área original se não encontrada
 */
export function getNewArea(oldArea: string): string {
  return AREA_MAPPING[oldArea] || oldArea
}

/**
 * Retorna todas as áreas antigas
 * @returns Array com os nomes das áreas antigas
 */
export function getOldAreas(): string[] {
  return Object.keys(AREA_MAPPING)
}

/**
 * Retorna todas as novas áreas teológicas
 * @returns Array com os nomes das novas áreas
 */
export function getNewAreas(): string[] {
  return Array.from(new Set(Object.values(AREA_MAPPING)))
}
