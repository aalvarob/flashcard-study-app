import { useState, useEffect } from 'react'
import WordImporter from '../components/WordImporter'
import AreaManager from '../components/AreaManager'
import { migrateCardsAreas } from '../utils/migrationUtils'
import { trpc } from '../lib/trpc-client'
import { useWebSocket, type FlashcardEvent } from '../hooks/useWebSocket'
import { useToast } from '../components/ToastContainer'
import './AdminPage.css'

interface Card {
  id: number
  question: string
  answer: string
  area: string
}

const AREAS = [
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

export default function AdminPage() {
  const [areas, setAreas] = useState<string[]>(AREAS)
  const [cards, setCards] = useState<Card[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ question: '', answer: '', area: areas[0] || AREAS[0] })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArea, setSelectedArea] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Toast notifications
  const toast = useToast()

  // WebSocket connection for real-time sync
  const { isConnected, send } = useWebSocket((event: FlashcardEvent) => {
    // Handle incoming WebSocket events from other clients
    if (event.type === 'create' && event.flashcard) {
      setCards(prev => {
        const cardId = typeof event.flashcard!.id === 'string' ? parseInt(event.flashcard!.id) : event.flashcard!.id
        const exists = prev.some(c => c.id === cardId)
        if (!exists) {
          const { id: _, ...rest } = event.flashcard!
          toast.showInfo(`Novo card criado: ${rest.question?.substring(0, 50)}...`)
          return [...prev, { id: cardId as number, ...rest }]
        }
        return prev
      })
    } else if (event.type === 'update' && event.flashcard) {
      const cardId = typeof event.flashcard!.id === 'string' ? parseInt(event.flashcard!.id) : event.flashcard!.id
      const { id: _, ...rest } = event.flashcard!
      toast.showInfo(`Card atualizado: ${rest.question?.substring(0, 50)}...`)
      setCards(prev => prev.map(c => c.id === cardId ? { ...c, ...rest } : c))
    } else if (event.type === 'delete' && event.id) {
      toast.showWarning(`Card deletado`)
      setCards(prev => prev.filter(c => c.id !== event.id))
    }
  })

  // tRPC queries and mutations
  const flashcardsQuery = trpc.flashcards.list.useQuery()
  const createMutation = trpc.flashcards.create.useMutation()
  const updateMutation = trpc.flashcards.update.useMutation()
  const deleteMutation = trpc.flashcards.delete.useMutation()

  // Load flashcards from API
  useEffect(() => {
    if (flashcardsQuery.data) {
      setCards(flashcardsQuery.data as Card[])
      setLoading(false)
    } else if (flashcardsQuery.isLoading) {
      setLoading(true)
    } else if (flashcardsQuery.error) {
      setError('Erro ao carregar flashcards')
      setLoading(false)
      // Fallback to localStorage
      const savedCards = JSON.parse(localStorage.getItem('flashcards') || '[]')
      setCards(savedCards)
    }
  }, [flashcardsQuery.data, flashcardsQuery.isLoading, flashcardsQuery.error])

  function handleAddCard() {
    if (!formData.question.trim() || !formData.answer.trim()) {
      alert('Pergunta e resposta são obrigatórias')
      return
    }

    if (editingId) {
      // Update existing card
      updateMutation.mutate(
        {
          id: editingId,
          question: formData.question,
          answer: formData.answer,
          area: formData.area,
        },
        {
          onSuccess: () => {
            // Broadcast update event via WebSocket
            send({
              type: 'update',
              flashcard: { id: editingId, ...formData },
              timestamp: Date.now(),
            })
            toast.showSuccess('Card atualizado com sucesso!')
            flashcardsQuery.refetch()
            setEditingId(null)
            setFormData({ question: '', answer: '', area: AREAS[0] })
          },
          onError: () => {
            toast.showError('Erro ao atualizar card')
          },
        }
      )
    } else {
      // Create new card
      createMutation.mutate(
        {
          question: formData.question,
          answer: formData.answer,
          area: formData.area,
        },
        {
          onSuccess: () => {
            // Broadcast create event via WebSocket
            send({
              type: 'create',
              flashcard: { id: Date.now(), ...formData },
              timestamp: Date.now(),
            })
            toast.showSuccess('Card criado com sucesso!')
            flashcardsQuery.refetch()
            setFormData({ question: '', answer: '', area: AREAS[0] })
          },
          onError: () => {
            toast.showError('Erro ao criar card')
          },
        }
      )
    }
  }

  function handleEditCard(card: Card) {
    setFormData({ question: card.question, answer: card.answer, area: card.area })
    setEditingId(card.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDeleteCard(id: number) {
    if (confirm('Tem certeza que deseja deletar este card?')) {
      deleteMutation.mutate(
        { id },
        {
          onSuccess: () => {
            // Broadcast delete event via WebSocket
            send({
              type: 'delete',
              id,
              timestamp: Date.now(),
            })
            toast.showSuccess('Card deletado com sucesso!')
            flashcardsQuery.refetch()
          },
          onError: () => {
            toast.showError('Erro ao deletar card')
          },
        }
      )
    }
  }

  function handleCancel() {
    setFormData({ question: '', answer: '', area: AREAS[0] })
    setEditingId(null)
  }

  function handleImportCards(importedCards: Array<{ question: string; answer: string; area: string }>) {
    let successCount = 0
    importedCards.forEach((card) => {
      createMutation.mutate(
        {
          question: card.question,
          answer: card.answer,
          area: card.area,
        },
        {
          onSuccess: () => {
            successCount++
            // Broadcast create event via WebSocket
            send({
              type: 'create',
              flashcard: { id: Date.now() + successCount, ...card },
              timestamp: Date.now(),
            })
            if (successCount === importedCards.length) {
              flashcardsQuery.refetch()
              alert(`${successCount} cards importados com sucesso!`)
            }
          },
        }
      )
    })
  }

  function handleAreasChange(newAreas: string[]) {
    setAreas(newAreas)
    if (!newAreas.includes(formData.area)) {
      setFormData({ ...formData, area: newAreas[0] || AREAS[0] })
    }
  }

  // Filter cards
  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesArea = !selectedArea || card.area === selectedArea
    return matchesSearch && matchesArea
  })

  if (loading) {
    return (
      <div className="admin-page">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Carregando flashcards...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      {/* Connection Status */}
      {isConnected && (
        <div style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '0.75rem',
          textAlign: 'center',
          marginBottom: '1rem',
          borderRadius: '4px',
          fontSize: '0.9rem'
        }}>
          ✓ Sincronização em tempo real ativa
        </div>
      )}
      {!isConnected && (
        <div style={{
          backgroundColor: '#FFC107',
          color: '#333',
          padding: '0.75rem',
          textAlign: 'center',
          marginBottom: '1rem',
          borderRadius: '4px',
          fontSize: '0.9rem'
        }}>
          ⚠ Desconectado - mudanças serão sincronizadas quando conectar
        </div>
      )}

      <div className="admin-container">
        {/* Form Section */}
        <div className="admin-form-section">
          <h2>{editingId ? 'Editar Card' : 'Novo Card'}</h2>

          <div className="form-group">
            <label>Pergunta</label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Digite a pergunta..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Resposta</label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Digite a resposta..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Área Teológica</label>
            <select
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            >
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button onClick={handleAddCard} className="btn-primary" disabled={createMutation.isPending || updateMutation.isPending}>
              {editingId ? 'Atualizar' : 'Adicionar'}
            </button>
            {editingId && (
              <button onClick={handleCancel} className="btn-secondary">
                Cancelar
              </button>
            )}
          </div>

          {/* Word Importer */}
          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e0e0e0' }}>
            <h3>Importar do Word</h3>
            <WordImporter onImport={handleImportCards} />
          </div>

          {/* Area Manager */}
          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e0e0e0' }}>
            <h3>Gerenciar Áreas</h3>
            <AreaManager areas={areas} onAreasChange={handleAreasChange} />
          </div>
        </div>

        {/* Cards List Section */}
        <div className="admin-cards-section">
          <h2>Cards ({filteredCards.length})</h2>

          <div className="admin-filters">
            <input
              type="text"
              placeholder="Buscar por pergunta ou resposta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="filter-select"
            >
              <option value="">Todas as áreas</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div className="cards-list">
            {filteredCards.length === 0 ? (
              <p className="no-cards">Nenhum card encontrado</p>
            ) : (
              filteredCards.map((card) => (
                <div key={card.id} className="card-item">
                  <div className="card-header">
                    <span className="card-area">{card.area}</span>
                  </div>
                  <div className="card-content">
                    <p className="card-question">
                      <strong>P:</strong> {card.question}
                    </p>
                    <p className="card-answer">
                      <strong>R:</strong> {card.answer}
                    </p>
                  </div>
                  <div className="card-actions">
                    <button
                      onClick={() => handleEditCard(card)}
                      className="btn-edit"
                      disabled={updateMutation.isPending}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="btn-delete"
                      disabled={deleteMutation.isPending}
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {error && (
        <div style={{ color: 'red', padding: '1rem', marginTop: '1rem' }}>
          {error}
        </div>
      )}
    </div>
  )
}
