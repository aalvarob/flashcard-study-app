import { useState, useMemo } from 'react'
import '../styles/ImportPreview.css'

interface Card {
  id?: string
  question: string
  answer: string
  area: string
  enabled?: boolean
}

interface PreviewCard extends Card {
  status: 'new' | 'duplicate' | 'similar'
  isDuplicate: boolean
  duplicateId?: string
  similarity?: number
}

interface ImportPreviewProps {
  importedCards: Card[]
  existingCards: Card[]
  onConfirm: (cardsToImport: Card[]) => void
  onCancel: () => void
}

// Função para calcular similaridade entre duas strings (Levenshtein distance)
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim()
  const s2 = str2.toLowerCase().trim()

  if (s1 === s2) return 1

  const longer = s1.length > s2.length ? s1 : s2
  const shorter = s1.length > s2.length ? s2 : s1

  if (longer.length === 0) return 1

  const editDistance = getEditDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

function getEditDistance(s1: string, s2: string): number {
  const costs = []
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j
      } else if (j > 0) {
        let newValue = costs[j - 1]
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
        }
        costs[j - 1] = lastValue
        lastValue = newValue
      }
    }
    if (i > 0) costs[s2.length] = lastValue
  }
  return costs[s2.length]
}

export default function ImportPreview({
  importedCards,
  existingCards,
  onConfirm,
  onCancel,
}: ImportPreviewProps) {
  const [selectedCards, setSelectedCards] = useState<Set<number>>(
    new Set(importedCards.map((_, i) => i))
  )

  const previewCards: PreviewCard[] = useMemo(() => {
    return importedCards.map((card, index) => {
      // Verificar duplicatas exatas
      const exactDuplicate = existingCards.find(
        (existing) =>
          existing.question.toLowerCase().trim() ===
            card.question.toLowerCase().trim() &&
          existing.answer.toLowerCase().trim() === card.answer.toLowerCase().trim()
      )

      if (exactDuplicate) {
        return {
          ...card,
          status: 'duplicate',
          isDuplicate: true,
          duplicateId: exactDuplicate.id,
        }
      }

      // Verificar duplicatas similares (>85% de similaridade)
      const similarCards = existingCards
        .map((existing) => ({
          card: existing,
          similarity: Math.max(
            calculateSimilarity(card.question, existing.question),
            calculateSimilarity(card.answer, existing.answer)
          ),
        }))
        .filter((item) => item.similarity > 0.85)

      if (similarCards.length > 0) {
        return {
          ...card,
          status: 'similar',
          isDuplicate: false,
          similarity: similarCards[0].similarity,
        }
      }

      return {
        ...card,
        status: 'new',
        isDuplicate: false,
      }
    })
  }, [importedCards, existingCards])

  const stats = useMemo(() => {
    return {
      total: previewCards.length,
      new: previewCards.filter((c) => c.status === 'new').length,
      duplicate: previewCards.filter((c) => c.status === 'duplicate').length,
      similar: previewCards.filter((c) => c.status === 'similar').length,
      selected: selectedCards.size,
    }
  }, [previewCards, selectedCards])

  const handleSelectAll = () => {
    if (selectedCards.size === previewCards.length) {
      setSelectedCards(new Set())
    } else {
      setSelectedCards(new Set(previewCards.map((_, i) => i)))
    }
  }

  const handleToggleCard = (index: number) => {
    const newSelected = new Set(selectedCards)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedCards(newSelected)
  }

  const handleConfirm = () => {
    const cardsToImport = Array.from(selectedCards)
      .sort((a, b) => a - b)
      .map((index) => importedCards[index])

    onConfirm(cardsToImport)
  }

  return (
    <div className="import-preview-overlay">
      <div className="import-preview-modal">
        <div className="preview-header">
          <h2>Validação de Importação</h2>
          <button className="close-btn" onClick={onCancel}>
            ✕
          </button>
        </div>

        <div className="preview-stats">
          <div className="stat-item">
            <span className="stat-label">Total</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item new">
            <span className="stat-label">Novos</span>
            <span className="stat-value">{stats.new}</span>
          </div>
          <div className="stat-item duplicate">
            <span className="stat-label">Duplicados</span>
            <span className="stat-value">{stats.duplicate}</span>
          </div>
          <div className="stat-item similar">
            <span className="stat-label">Similares</span>
            <span className="stat-value">{stats.similar}</span>
          </div>
        </div>

        <div className="preview-content">
          <div className="preview-toolbar">
            <label className="select-all-checkbox">
              <input
                type="checkbox"
                checked={selectedCards.size === previewCards.length}
                onChange={handleSelectAll}
              />
              <span>Selecionar todos ({selectedCards.size}/{previewCards.length})</span>
            </label>
          </div>

          <div className="preview-list">
            {previewCards.map((card, index) => (
              <div
                key={index}
                className={`preview-card ${card.status} ${
                  selectedCards.has(index) ? 'selected' : ''
                }`}
              >
                <div className="card-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCards.has(index)}
                    onChange={() => handleToggleCard(index)}
                    disabled={card.isDuplicate}
                  />
                </div>

                <div className="card-content">
                  <div className="card-status-badge">
                    {card.status === 'new' && <span className="badge new">Novo</span>}
                    {card.status === 'duplicate' && (
                      <span className="badge duplicate">Duplicado</span>
                    )}
                    {card.status === 'similar' && (
                      <span className="badge similar">
                        Similar ({Math.round((card.similarity || 0) * 100)}%)
                      </span>
                    )}
                  </div>

                  <div className="card-area">{card.area}</div>

                  <div className="card-question">
                    <strong>P:</strong> {card.question}
                  </div>

                  <div className="card-answer">
                    <strong>R:</strong> {card.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="preview-footer">
          <div className="footer-info">
            <p>
              {stats.selected} de {stats.total} cards serão importados
            </p>
            {stats.duplicate > 0 && (
              <p className="warning">
                ⚠️ {stats.duplicate} card(s) duplicado(s) serão ignorado(s)
              </p>
            )}
            {stats.similar > 0 && (
              <p className="info">
                ℹ️ {stats.similar} card(s) similar(es) detectado(s) - revise antes de importar
              </p>
            )}
          </div>

          <div className="footer-actions">
            <button className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              onClick={handleConfirm}
              disabled={selectedCards.size === 0}
            >
              Importar ({selectedCards.size})
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
