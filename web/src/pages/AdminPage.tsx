import { useState, useEffect } from 'react'
import WordImporter from '../components/WordImporter'
import AreaManager from '../components/AreaManager'
import { migrateCardsAreas } from '../utils/migrationUtils'
import './AdminPage.css'

// Nota: Esta página de admin funciona sem autenticação para facilitar gerenciamento local de cards
// Em produção, adicionar verificação de permissão de admin

interface Card {
  id: string
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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ question: '', answer: '', area: areas[0] || AREAS[0] })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArea, setSelectedArea] = useState<string>('')

  useEffect(() => {
    // Load cards from localStorage
    let savedCards = JSON.parse(localStorage.getItem('flashcards') || '[]')
    
    // Verificar se eh necessario migrar areas
    const needsMigration = savedCards.some((card: Card) => {
      return card.area && !AREAS.includes(card.area) && card.area.includes('Direito')
    })
    
    if (needsMigration) {
      savedCards = migrateCardsAreas(savedCards)
      localStorage.setItem('flashcards', JSON.stringify(savedCards))
    }
    
    setCards(savedCards)
    // Load areas from localStorage
    const savedAreas = JSON.parse(localStorage.getItem('areas') || 'null')
    if (savedAreas) {
      setAreas(savedAreas)
    }
  }, [])

  function saveCards(updatedCards: Card[]) {
    setCards(updatedCards)
    localStorage.setItem('flashcards', JSON.stringify(updatedCards))
  }

  function handleAreasChange(newAreas: string[]) {
    setAreas(newAreas)
    localStorage.setItem('areas', JSON.stringify(newAreas))
    // Atualizar formData se a área atual foi deletada
    if (!newAreas.includes(formData.area)) {
      setFormData({ ...formData, area: newAreas[0] || AREAS[0] })
    }
  }

  function handleAddCard() {
    if (!formData.question.trim() || !formData.answer.trim()) {
      alert('Pergunta e resposta são obrigatórias')
      return
    }

    if (editingId) {
      // Update existing card
      const updatedCards = cards.map((card) =>
        card.id === editingId ? { ...card, ...formData } : card
      )
      saveCards(updatedCards)
      setEditingId(null)
    } else {
      // Add new card
      const newCard: Card = {
        id: Date.now().toString(),
        ...formData,
      }
      saveCards([...cards, newCard])
    }

    setFormData({ question: '', answer: '', area: AREAS[0] })
  }

  function handleEditCard(card: Card) {
    setFormData({ question: card.question, answer: card.answer, area: card.area })
    setEditingId(card.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDeleteCard(id: string) {
    if (confirm('Tem certeza que deseja deletar este card?')) {
      const updatedCards = cards.filter((card) => card.id !== id)
      saveCards(updatedCards)
    }
  }

  function handleCancel() {
    setFormData({ question: '', answer: '', area: AREAS[0] })
    setEditingId(null)
  }

  function handleImportCards(importedCards: Array<{ question: string; answer: string; area: string }>) {
    const newCards = importedCards.map((card) => ({
      id: Date.now().toString() + Math.random(),
      question: card.question,
      answer: card.answer,
      area: card.area,
    }))
    saveCards([...cards, ...newCards])
    alert(`${newCards.length} cards importados com sucesso!`)
  }

  // Filter cards
  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesArea = !selectedArea || card.area === selectedArea
    return matchesSearch && matchesArea
  })

  return (
    <div className="admin-container">
      <AreaManager areas={areas} onAreasChange={handleAreasChange} />
      <WordImporter onImport={handleImportCards} />
      <div className="admin-content">
        {/* Form Section */}
        <section className="admin-form-section">
          <h2>{editingId ? 'Editar Card' : 'Criar Novo Card'}</h2>

          <div className="form-group">
            <label htmlFor="area">Área</label>
            <select
              id="area"
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

          <div className="form-group">
            <label htmlFor="question">Pergunta</label>
            <textarea
              id="question"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Digite a pergunta..."
              className="form-input textarea"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="answer">Resposta</label>
            <textarea
              id="answer"
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Digite a resposta..."
              className="form-input textarea"
              rows={4}
            />
          </div>

          <div className="form-buttons">
            <button className="btn btn-primary" onClick={handleAddCard}>
              {editingId ? 'Atualizar Card' : 'Criar Card'}
            </button>
            {editingId && (
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancelar
              </button>
            )}
          </div>
        </section>

        {/* Cards List Section */}
        <section className="admin-list-section">
          <h2>Cards ({filteredCards.length})</h2>

          <div className="filter-section">
            <input
              type="text"
              placeholder="Buscar por pergunta ou resposta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="form-input"
            >
              <option value="">Todas as áreas</option>
              {AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div className="cards-list">
            {filteredCards.length === 0 ? (
              <div className="empty-state">
                <p>Nenhum card encontrado</p>
              </div>
            ) : (
              filteredCards.map((card) => (
                <div key={card.id} className="card-item">
                  <div className="card-header">
                    <span className="card-area">{card.area}</span>
                    <div className="card-actions">
                      <button
                        className="btn-icon edit"
                        onClick={() => handleEditCard(card)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDeleteCard(card.id)}
                        title="Deletar"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="card-question">
                    <strong>P:</strong> {card.question}
                  </div>
                  <div className="card-answer">
                    <strong>R:</strong> {card.answer}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
