import { useState } from 'react'
import '../styles/AreaManager.css'

interface AreaManagerProps {
  areas: string[]
  cards?: Array<{ area: string }>
  onAreasChange: (areas: string[]) => void
}

export default function AreaManager({ areas, cards, onAreasChange }: AreaManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newArea, setNewArea] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleAddArea = () => {
    const trimmedArea = newArea.trim()

    if (!trimmedArea) {
      setErrorMessage('Digite o nome da área')
      return
    }

    if (areas.includes(trimmedArea)) {
      setErrorMessage('Esta área já existe')
      return
    }

    if (trimmedArea.length < 3) {
      setErrorMessage('O nome deve ter pelo menos 3 caracteres')
      return
    }

    const updatedAreas = [...areas, trimmedArea].sort()
    onAreasChange(updatedAreas)
    setNewArea('')
    setErrorMessage('')
  }

  const handleDeleteArea = (index: number) => {
    if (confirm(`Tem certeza que deseja deletar "${areas[index]}"?`)) {
      const updatedAreas = areas.filter((_, i) => i !== index)
      onAreasChange(updatedAreas)
    }
  }

  const handleEditArea = (index: number) => {
    setEditingIndex(index)
    setEditingValue(areas[index])
    setErrorMessage('')
  }

  const handleSaveEdit = (index: number) => {
    const trimmedValue = editingValue.trim()

    if (!trimmedValue) {
      setErrorMessage('Digite o nome da área')
      return
    }

    if (trimmedValue !== areas[index] && areas.includes(trimmedValue)) {
      setErrorMessage('Esta área já existe')
      return
    }

    if (trimmedValue.length < 3) {
      setErrorMessage('O nome deve ter pelo menos 3 caracteres')
      return
    }

    const updatedAreas = [...areas]
    updatedAreas[index] = trimmedValue
    updatedAreas.sort()
    onAreasChange(updatedAreas)
    setEditingIndex(null)
    setEditingValue('')
    setErrorMessage('')
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditingValue('')
    setErrorMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  // Calcular o número de áreas únicas a partir dos cards
  const uniqueAreasCount = cards ? new Set(cards.map(c => c.area)).size : areas.length

  return (
    <div className="area-manager">
      <button
        className="area-manager-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="toggle-icon">⚙️</span>
        Gerenciar Áreas ({uniqueAreasCount})
      </button>

      {isOpen && (
        <div className="area-manager-panel">
          <div className="panel-header">
            <h3>Gerenciar Áreas Teológicas</h3>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="panel-content">
            {/* Add New Area Section */}
            <div className="add-area-section">
              <h4>Adicionar Nova Área</h4>
              <div className="input-group">
                <input
                  type="text"
                  value={newArea}
                  onChange={(e) => {
                    setNewArea(e.target.value)
                    setErrorMessage('')
                  }}
                  onKeyPress={(e) => handleKeyPress(e, handleAddArea)}
                  placeholder="Digite o nome da área..."
                  className="area-input"
                />
                <button
                  className="btn btn-primary"
                  onClick={handleAddArea}
                >
                  Adicionar
                </button>
              </div>
              {errorMessage && (
                <p className="error-message">{errorMessage}</p>
              )}
            </div>

            {/* Areas List Section */}
            <div className="areas-list-section">
              <h4>Áreas Existentes ({uniqueAreasCount})</h4>
              <div className="areas-list">
                {areas.length === 0 ? (
                  <p className="empty-message">Nenhuma área criada ainda</p>
                ) : (
                  areas.map((area, index) => (
                    <div key={index} className="area-item">
                      {editingIndex === index ? (
                        <div className="area-edit">
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => {
                              setEditingValue(e.target.value)
                              setErrorMessage('')
                            }}
                            onKeyPress={(e) =>
                              handleKeyPress(e, () => handleSaveEdit(index))
                            }
                            autoFocus
                            className="area-edit-input"
                          />
                          <button
                            className="btn-icon save"
                            onClick={() => handleSaveEdit(index)}
                            title="Salvar"
                          >
                            ✓
                          </button>
                          <button
                            className="btn-icon cancel"
                            onClick={handleCancelEdit}
                            title="Cancelar"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="area-name">{area}</span>
                          <div className="area-actions">
                            <button
                              className="btn-icon edit"
                              onClick={() => handleEditArea(index)}
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button
                              className="btn-icon delete"
                              onClick={() => handleDeleteArea(index)}
                              title="Deletar"
                            >
                              🗑️
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="info-section">
              <p className="info-text">
                💡 Dica: As áreas são ordenadas alfabeticamente. Use nomes descritivos
                e únicos para melhor organização dos cards.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
