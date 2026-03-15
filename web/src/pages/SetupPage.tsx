import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FLASHCARDS_DATA, type FlashcardArea } from '../../../data/flashcards'
import './SetupPage.css'

const AREAS: { id: FlashcardArea; label: string }[] = [
  { id: 'escrituras_sagradas', label: 'Escrituras Sagradas' },
  { id: 'deus_pai', label: 'Deus Pai' },
  { id: 'deus_filho', label: 'Deus Filho' },
  { id: 'deus_espirito_santo', label: 'Deus Espírito Santo' },
  { id: 'homem', label: 'Homem' },
  { id: 'pecado', label: 'Pecado' },
  { id: 'salvacao', label: 'Salvação' },
  { id: 'eleicao', label: 'Eleição' },
  { id: 'reino_de_deus', label: 'Reino de Deus' },
  { id: 'igreja', label: 'Igreja' },
  { id: 'dia_do_senhor', label: 'Dia do Senhor' },
  { id: 'ministerio_da_palavra', label: 'Ministério da Palavra' },
  { id: 'liberdade_religiosa', label: 'Liberdade Religiosa' },
  { id: 'morte', label: 'Morte' },
  { id: 'justos_e_impios', label: 'Justos e Ímpios' },
  { id: 'anjos', label: 'Anjos' },
  { id: 'amor_ao_proximo_e_etica', label: 'Amor ao Próximo e Ética' },
  { id: 'batismo_e_ceia', label: 'Batismo e Ceia' },
  { id: 'mordomia', label: 'Mordomia' },
  { id: 'evangelismo_e_missoes', label: 'Evangelismo e Missões' },
  { id: 'educacao_religiosa', label: 'Educação Religiosa' },
  { id: 'ordem_social', label: 'Ordem Social' },
  { id: 'familia', label: 'Família' },
  { id: 'principios_batistas', label: 'Princípios Batistas' },
  { id: 'historia_dos_batistas', label: 'História dos Batistas' },
  { id: 'estrutura_e_funcionamento_cbb', label: 'Estrutura e Funcionamento CBB' },
]

type SelectionMode = 'all' | 'multiple'

export default function SetupPage() {
  const navigate = useNavigate()
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('all')
  const [selectedAreas, setSelectedAreas] = useState<Set<FlashcardArea>>(new Set())
  const [cardsPerArea, setCardsPerArea] = useState(10)
  
  // Limpar localStorage antigo ao carregar a página
  useEffect(() => {
    const stored = localStorage.getItem('studyConfig')
    if (stored) {
      try {
        const config = JSON.parse(stored)
        console.log('[SetupPage] Config anterior no localStorage:', config)
        // Se as áreas estão em snake_case, limpar para forçar novo setup
        if (config.areas && config.areas.some((area: string) => area.includes('_'))) {
          console.log('[SetupPage] Limpando config antigo com IDs em snake_case')
          localStorage.removeItem('studyConfig')
        }
      } catch (e) {
        console.error('[SetupPage] Erro ao ler config anterior:', e)
      }
    }
  }, [])

  const cardsByArea = useMemo(() => {
    const counts: Record<FlashcardArea, number> = {} as Record<FlashcardArea, number>
    AREAS.forEach(area => {
      counts[area.id] = FLASHCARDS_DATA.filter(card => card.area === area.id).length
    })
    return counts
  }, [])

  const totalAvailableCards = useMemo(() => {
    if (selectionMode === 'all') {
      return FLASHCARDS_DATA.length
    }
    return Array.from(selectedAreas).reduce((sum, area) => sum + cardsByArea[area], 0)
  }, [selectionMode, selectedAreas, cardsByArea])

  function toggleArea(areaId: FlashcardArea) {
    const newSelected = new Set(selectedAreas)
    if (newSelected.has(areaId)) {
      newSelected.delete(areaId)
    } else {
      newSelected.add(areaId)
    }
    setSelectedAreas(newSelected)
  }

  function toggleAllAreas() {
    if (selectedAreas.size === AREAS.length) {
      setSelectedAreas(new Set())
    } else {
      setSelectedAreas(new Set(AREAS.map(a => a.id)))
    }
  }

  function handleStartStudy() {
    // Mapear IDs para labels (nomes reais das áreas)
    const areaIds = selectionMode === 'all' ? AREAS.map(a => a.id) : Array.from(selectedAreas)
    console.log('[SetupPage] areaIds:', areaIds)
    console.log('[SetupPage] AREAS:', AREAS)
    
    const areaLabels = areaIds.map(id => {
      const area = AREAS.find(a => a.id === id)
      console.log(`[SetupPage] Mapeando ID "${id}" para label "${area ? area.label : 'NOT FOUND'}"` )
      return area ? area.label : id
    })
    
    const config = {
      mode: selectionMode,
      areas: areaLabels, // Salvar com nomes reais (Title Case), não IDs
      cardsPerArea,
    }
    console.log('[SetupPage] areaLabels mapeados:', areaLabels)
    console.log('[SetupPage] Salvando config com áreas:', config.areas)
    console.log('[SetupPage] Config completo:', config)
    localStorage.setItem('studyConfig', JSON.stringify(config))
    navigate('/study')
  }

  const isValid = selectionMode === 'all' || selectedAreas.size > 0

  return (
    <div className="setup-container">
      <div className="setup-header">
        <h1>Configurar Simulado</h1>
        <p>Escolha as áreas e a quantidade de cartões para estudar</p>
      </div>

      <div className="setup-content">
        {/* Selection Mode */}
        <div className="setup-section">
          <h2>Modo de Seleção</h2>
          <div className="mode-buttons">
            <button
              className={`mode-button ${selectionMode === 'all' ? 'active' : ''}`}
              onClick={() => {
                setSelectionMode('all')
                setSelectedAreas(new Set())
              }}
            >
              Todas as Áreas
            </button>
            <button
              className={`mode-button ${selectionMode === 'multiple' ? 'active' : ''}`}
              onClick={() => setSelectionMode('multiple')}
            >
              Escolher Áreas
            </button>
          </div>
        </div>

        {/* Areas Selection */}
        {selectionMode === 'multiple' && (
          <div className="setup-section">
            <div className="section-header">
              <h2>Selecione as Áreas</h2>
              <button
                className="select-all-button"
                onClick={toggleAllAreas}
              >
                {selectedAreas.size === AREAS.length ? 'Desselecionar Tudo' : 'Selecionar Tudo'}
              </button>
            </div>
            <div className="areas-grid">
              {AREAS.map(area => (
                <label key={area.id} className="area-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedAreas.has(area.id)}
                    onChange={() => toggleArea(area.id)}
                  />
                  <span className="area-label">
                    {area.label}
                    <span className="area-count">({cardsByArea[area.id]} cartões)</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Cards Per Area */}
        <div className="setup-section">
          <h2>Quantidade de Cartões por Área</h2>
          <div className="cards-input-group">
            <input
              type="range"
              min="1"
              max="50"
              value={cardsPerArea}
              onChange={(e) => setCardsPerArea(parseInt(e.target.value))}
              className="cards-slider"
            />
            <div className="cards-display">
              <input
                type="number"
                min="1"
                max="50"
                value={cardsPerArea}
                onChange={(e) => setCardsPerArea(Math.max(1, parseInt(e.target.value) || 1))}
                className="cards-input"
              />
              <span className="cards-label">cartões por área</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="setup-summary">
          <div className="summary-item">
            <span className="summary-label">Modo:</span>
            <span className="summary-value">
              {selectionMode === 'all' ? 'Todas as Áreas' : `${selectedAreas.size} área(s) selecionada(s)`}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Cartões Disponíveis:</span>
            <span className="summary-value">{totalAvailableCards}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Cartões a Estudar:</span>
            <span className="summary-value">
              {selectionMode === 'all'
                ? Math.min(cardsPerArea * AREAS.length, totalAvailableCards)
                : Math.min(cardsPerArea * selectedAreas.size, totalAvailableCards)}
            </span>
          </div>
        </div>

        {/* Start Button */}
        <button
          className="start-button"
          onClick={handleStartStudy}
          disabled={!isValid}
        >
          Começar a Estudar
        </button>
      </div>
    </div>
  )
}
