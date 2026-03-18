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
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [showImporter, setShowImporter] = useState(false)
  const [showAreaManager, setShowAreaManager] = useState(false)
  const [cardToChangeArea, setCardToChangeArea] = useState<Card | null>(null)
  const [newArea, setNewArea] = useState<string>('')

  // Toast notifications
  const toast = useToast()

  // WebSocket connection for real-time sync (disabled until backend is ready)
  const isConnected = false
  const send = () => {} // Dummy function

  // Load flashcards from localStorage
  useEffect(() => {
    try {
      const savedCards = JSON.parse(localStorage.getItem('flashcards') || '[]')
      setCards(savedCards)
      // Carregar áreas dinamicamente a partir dos cards
      const uniqueAreas = Array.from(new Set(savedCards.map((c: Card) => c.area))).sort()
      setAreas(uniqueAreas.length > 0 ? uniqueAreas : AREAS)
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar flashcards:', error)
      setCards([])
      setLoading(false)
    }
  }, [])

  function handleAddCard() {
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.showError('Pergunta e resposta são obrigatórias')
      return
    }

    if (editingId) {
      // Update existing card
      const updatedCards = cards.map(c => 
        c.id === editingId 
          ? { ...c, question: formData.question, answer: formData.answer, area: formData.area }
          : c
      )
      setCards(updatedCards)
      localStorage.setItem('flashcards', JSON.stringify(updatedCards))
      toast.showSuccess('Card atualizado com sucesso!')
      setEditingId(null)
      setFormData({ question: '', answer: '', area: AREAS[0] })
    } else {
      // Create new card
      const newCard: Card = {
        id: Math.max(...cards.map(c => c.id), 0) + 1,
        question: formData.question,
        answer: formData.answer,
        area: formData.area,
      }
      const updatedCards = [...cards, newCard]
      setCards(updatedCards)
      localStorage.setItem('flashcards', JSON.stringify(updatedCards))
      toast.showSuccess('Card criado com sucesso!')
      setFormData({ question: '', answer: '', area: AREAS[0] })
      setCurrentPage(1)
    }
  }

  function handleEditCard(card: Card) {
    setFormData({ question: card.question, answer: card.answer, area: card.area })
    setEditingId(card.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDeleteCard(id: number) {
    if (confirm('Tem certeza que deseja deletar este card?')) {
      const updatedCards = cards.filter(c => c.id !== id)
      setCards(updatedCards)
      localStorage.setItem('flashcards', JSON.stringify(updatedCards))
      toast.showSuccess('Card deletado com sucesso!')
    }
  }

  function handleCancel() {
    setFormData({ question: '', answer: '', area: AREAS[0] })
    setEditingId(null)
  }

  function handleChangeArea(card: Card) {
    setCardToChangeArea(card)
    setNewArea(card.area)
  }

  function handleConfirmChangeArea() {
    if (!cardToChangeArea || !newArea) return

    const updatedCards = cards.map(c =>
      c.id === cardToChangeArea.id
        ? { ...c, area: newArea }
        : c
    )
    setCards(updatedCards)
    localStorage.setItem('flashcards', JSON.stringify(updatedCards))
    toast.showSuccess('Área alterada com sucesso!')
    setCardToChangeArea(null)
    setNewArea('')
  }

  function handleCancelChangeArea() {
    setCardToChangeArea(null)
    setNewArea('')
  }

  function handleImportCards(importedCards: Array<{ question: string; answer: string; area: string }>) {
    const newCards = importedCards.map((card, index) => ({
      id: Math.max(...cards.map(c => c.id), 0) + index + 1,
      question: card.question,
      answer: card.answer,
      area: card.area,
    }))
    const updatedCards = [...cards, ...newCards]
    setCards(updatedCards)
    localStorage.setItem('flashcards', JSON.stringify(updatedCards))
    // Atualizar a lista de áreas com as novas áreas importadas
    const newAreas = Array.from(new Set([...areas, ...importedCards.map(c => c.area)]))
    setAreas(newAreas)
    toast.showSuccess(`${importedCards.length} cards importados com sucesso!`)
    setShowImporter(false)
  }

  function handleAreasChange(newAreas: string[]) {
    setAreas(newAreas)
    if (!newAreas.includes(formData.area)) {
      setFormData({ ...formData, area: newAreas[0] || AREAS[0] })
    }
  }

  // Highlight search term in text
  function highlightSearchTerm(text: string, term: string) {
    if (!term) return text
    const regex = new RegExp(`(${term})`, 'gi')
    const parts = text.split(regex)
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="search-highlight">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    )
  }

  // Filter cards
  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesArea = !selectedArea || card.area === selectedArea
    return matchesSearch && matchesArea
  })

  // Pagination
  const totalPages = Math.ceil(filteredCards.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCards = filteredCards.slice(startIndex, startIndex + itemsPerPage)

  // Statistics
  const cardsByArea = areas.map((area) => ({
    area,
    count: cards.filter((c) => c.area === area).length,
  }))

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando flashcards...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div className="header-content">
          <h1>Gerenciamento de Flashcards</h1>
          <p className="header-subtitle">Crie, edite e organize seus cards teológicos</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-number">{cards.length}</span>
            <span className="stat-label">Total de Cards</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{new Set(cards.map(c => c.area)).size}</span>
            <span className="stat-label">Áreas</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{selectedArea ? cardsByArea.find(c => c.area === selectedArea)?.count || 0 : filteredCards.length}</span>
            <span className="stat-label">Filtrados</span>
          </div>
        </div>
      </div>

      {/* Connection Status - Hidden until WebSocket is fully implemented */}
      {/* {isConnected && (
        <div className="status-banner status-connected">
          <span className="status-icon">✓</span>
          <span>Sincronização em tempo real ativa</span>
        </div>
      )}
      {!isConnected && (
        <div className="status-banner status-disconnected">
          <span className="status-icon">⚠</span>
          <span>Desconectado - mudanças serão sincronizadas quando conectar</span>
        </div>
      )} */}

      <div className="admin-container">
        {/* Left Panel - Form */}
        <div className="admin-left-panel">
          {/* Form Card */}
          <div className="form-card">
            <div className="form-header">
              <h2>{editingId ? '✏️ Editar Card' : '➕ Novo Card'}</h2>
              {editingId && <span className="editing-badge">Editando</span>}
            </div>

            <div className="form-group">
              <label>Pergunta</label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Digite a pergunta..."
                rows={4}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Resposta</label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Digite a resposta..."
                rows={4}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Área Teológica</label>
              <select
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="form-input"
              >
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button 
                onClick={handleAddCard} 
                className="btn btn-primary"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingId ? '💾 Atualizar' : '➕ Adicionar'}
              </button>
              {editingId && (
                <button onClick={handleCancel} className="btn btn-secondary">
                  ✕ Cancelar
                </button>
              )}
            </div>
          </div>

          {/* Tools */}
          <div className="tools-section">
            <button 
              onClick={() => setShowImporter(!showImporter)}
              className="tool-button"
            >
              <span className="tool-icon">📄</span>
              <span>Importar do Word</span>
            </button>
            <button 
              onClick={() => setShowAreaManager(!showAreaManager)}
              className="tool-button"
            >
              <span className="tool-icon">🏷️</span>
              <span>Gerenciar Áreas</span>
            </button>
          </div>

          {/* Word Importer */}
          {showImporter && (
            <div className="expandable-section">
              <h3>Importar Flashcards do Word</h3>
              <WordImporter onImport={handleImportCards} />
            </div>
          )}

          {/* Area Manager */}
          {showAreaManager && (
            <div className="expandable-section">
              <h3>Gerenciar Áreas Teológicas</h3>
              <AreaManager areas={areas} cards={cards} onAreasChange={handleAreasChange} />
            </div>
          )}
        </div>

        {/* Right Panel - Cards List */}
        <div className="admin-right-panel">
          <div className="cards-header">
            <h2>📚 Seus Flashcards</h2>
            <span className="cards-count">{filteredCards.length} card(s)</span>
          </div>

          {/* Filters */}
          <div className="filters-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="🔍 Buscar pergunta ou resposta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="filter-select"
            >
              <option value="">Todas as áreas ({cards.length})</option>
              {cardsByArea.map((item) => (
                <option key={item.area} value={item.area}>
                  {item.area} ({item.count})
                </option>
              ))}
            </select>
          </div>

          {/* Cards List */}
          <div className="cards-list">
            {paginatedCards.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>Nenhum card encontrado</p>
                <small>Crie um novo card ou ajuste seus filtros</small>
              </div>
            ) : (
              paginatedCards.map((card) => (
                <div key={card.id} className="card-item">
                  <div className="card-header">
                    <span className="card-area-badge">{card.area}</span>
                    <span className="card-id">#{card.id}</span>
                  </div>
                  <div className="card-content">
                    <div className="card-question">
                      <strong>❓ Pergunta:</strong>
                      <p>{highlightSearchTerm(card.question, searchTerm)}</p>
                    </div>
                    <div className="card-answer">
                      <strong>✓ Resposta:</strong>
                      <p>{highlightSearchTerm(card.answer, searchTerm)}</p>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      onClick={() => handleEditCard(card)}
                      className="btn-action btn-edit"
                      disabled={updateMutation.isPending}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleChangeArea(card)}
                      className="btn-action btn-change-area"
                      disabled={updateMutation.isPending}
                      title="Trocar área"
                    >
                      🏷️
                    </button>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="btn-action btn-delete"
                      disabled={deleteMutation.isPending}
                      title="Deletar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                ← Anterior
              </button>
              <span className="pagination-info">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Próxima →
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span>❌</span> {error}
        </div>
      )}

      {cardToChangeArea && (
        <div className="modal-overlay" onClick={handleCancelChangeArea}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Trocar Area do Card</h2>
              <button className="modal-close" onClick={handleCancelChangeArea}>x</button>
            </div>
            <div className="modal-body">
              <p className="modal-info">
                <strong>Pergunta:</strong> {cardToChangeArea.question}
              </p>
              <p className="modal-info">
                <strong>Area Atual:</strong> {cardToChangeArea.area}
              </p>
              <div className="modal-select-wrapper">
                <label htmlFor="area-select">Selecione a nova area:</label>
                <select
                  id="area-select"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="modal-select"
                >
                  <option value="">-- Escolha uma area --</option>
                  {areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={handleCancelChangeArea}
                className="modal-btn modal-btn-cancel"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmChangeArea}
                className="modal-btn modal-btn-confirm"
                disabled={!newArea || newArea === cardToChangeArea.area || updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Salvando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
