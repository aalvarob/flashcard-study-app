import { useState, useEffect } from 'react'
import { trpc } from '../lib/trpc-client'

export type FlashcardArea =
  | 'Escrituras Sagradas'
  | 'Deus Pai'
  | 'Deus Filho'
  | 'Deus Espírito Santo'
  | 'Homem'
  | 'Pecado'
  | 'Salvação'
  | 'Eleição'
  | 'Reino de Deus'
  | 'Igreja'
  | 'Dia do Senhor'
  | 'Ministério da Palavra'
  | 'Liberdade Religiosa'
  | 'Morte'
  | 'Justos e Ímpios'
  | 'Anjos'
  | 'Amor ao Próximo e Ética'
  | 'Batismo e Ceia'
  | 'Mordomia'
  | 'Evangelismo e Missões'
  | 'Educação Religiosa'
  | 'Ordem Social'
  | 'Família'
  | 'Princípios Batistas'
  | 'História dos Batistas'
  | 'Estrutura e Funcionamento CBB'

export interface FlashcardData {
  id: number
  question: string
  answer: string
  area: FlashcardArea
  createdAt?: string
  updatedAt?: string
}

interface UseFlashcardsResult {
  flashcards: FlashcardData[]
  loading: boolean
  error: string | null
}

/**
 * Hook para carregar flashcards do banco de dados via API tRPC
 * Substitui o carregamento de dados locais
 */
export function useFlashcardsFromAPI(): UseFlashcardsResult {
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Usar tRPC para carregar dados
  const flashcardsQuery = trpc.flashcards.list.useQuery()

  useEffect(() => {
    console.log('[useFlashcardsFromAPI] Query state:', {
      isLoading: flashcardsQuery.isLoading,
      error: flashcardsQuery.error,
      dataLength: flashcardsQuery.data ? (flashcardsQuery.data as any[]).length : 0,
    })

    if (flashcardsQuery.isLoading) {
      console.log('[useFlashcardsFromAPI] Carregando...')
      setLoading(true)
      setError(null)
    } else if (flashcardsQuery.error) {
      console.error('[useFlashcardsFromAPI] Erro na query:', flashcardsQuery.error)
      setError(`Erro ao carregar flashcards da API: ${flashcardsQuery.error.message}`)
      setLoading(false)
      // Fallback: tentar carregar do localStorage
      const savedCards = localStorage.getItem('flashcards_backup')
      if (savedCards) {
        try {
          const parsed = JSON.parse(savedCards)
          console.log('[useFlashcardsFromAPI] Usando backup:', parsed.length, 'cards')
          setFlashcards(parsed)
        } catch (err) {
          console.error('[useFlashcardsFromAPI] Erro ao parsear backup:', err)
          setFlashcards([])
        }
      }
    } else if (flashcardsQuery.data) {
      const cards = (flashcardsQuery.data as unknown as FlashcardData[])
      console.log('[useFlashcardsFromAPI] Sucesso:', cards.length, 'cards')
      setFlashcards(cards)
      setLoading(false)
      setError(null)
      localStorage.setItem('flashcards_backup', JSON.stringify(cards))
    } else {
      console.log('[useFlashcardsFromAPI] Sem dados')
      setLoading(false)
    }
  }, [flashcardsQuery.data, flashcardsQuery.isLoading, flashcardsQuery.error])

  return {
    flashcards,
    loading,
    error,
  }
}
