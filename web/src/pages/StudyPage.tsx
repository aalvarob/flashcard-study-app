import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FLASHCARDS_DATA, type FlashcardArea } from '../../../data/flashcards'
import './StudyPage.css'

interface StudyConfig {
  mode: 'all' | 'multiple'
  areas: FlashcardArea[]
  cardsPerArea: number
}

interface Card {
  id: string
  question: string
  answer: string
  area: FlashcardArea
  isCorrect: boolean | null
}

export default function StudyPage() {
  const navigate = useNavigate()
  const [config, setConfig] = useState<StudyConfig | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [startTime, setStartTime] = useState(new Date())

  // Carregar configuração do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('studyConfig')
    if (saved) {
      const parsedConfig = JSON.parse(saved) as StudyConfig
      setConfig(parsedConfig)
      initializeCards(parsedConfig)
    } else {
      navigate('/setup')
    }
  }, [navigate])

  function initializeCards(config: StudyConfig) {
    let filtered = FLASHCARDS_DATA.filter(card => config.areas.includes(card.area))

    // Distribuir cards por área
    if (config.mode === 'all') {
      const cardsPerArea = config.cardsPerArea
      const selectedCards: typeof FLASHCARDS_DATA = []
      const areaMap: Record<string, typeof FLASHCARDS_DATA> = {}

      // Agrupar cards por área
      filtered.forEach(card => {
        if (!areaMap[card.area]) {
          areaMap[card.area] = []
        }
        areaMap[card.area].push(card)
      })

      // Selecionar cards de cada área
      let totalSelected = 0
      Object.values(areaMap).forEach(areaCards => {
        const toSelect = Math.min(cardsPerArea, areaCards.length)
        selectedCards.push(...areaCards.slice(0, toSelect))
        totalSelected += toSelect
      })

      filtered = selectedCards.slice(0, cardsPerArea * config.areas.length)
    } else {
      // Modo múltiplo: cardsPerArea por área selecionada
      const selectedCards: typeof FLASHCARDS_DATA = []
      const areaMap: Record<string, typeof FLASHCARDS_DATA> = {}

      filtered.forEach(card => {
        if (!areaMap[card.area]) {
          areaMap[card.area] = []
        }
        areaMap[card.area].push(card)
      })

      config.areas.forEach(area => {
        if (areaMap[area]) {
          const toSelect = Math.min(config.cardsPerArea, areaMap[area].length)
          selectedCards.push(...areaMap[area].slice(0, toSelect))
        }
      })

      filtered = selectedCards
    }

    // Embaralhar cards
    filtered = filtered.sort(() => Math.random() - 0.5)

    // Converter para Card com estado
    const cardObjects: Card[] = filtered.map(card => ({
      ...card,
      isCorrect: null,
    }))

    setCards(cardObjects)
    setCurrentIndex(0)
    setIsFlipped(false)
    setStartTime(new Date())
  }

  function handleCorrect() {
    const newCards = [...cards]
    newCards[currentIndex].isCorrect = true
    setCards(newCards)
    goToNext()
  }

  function handleIncorrect() {
    const newCards = [...cards]
    newCards[currentIndex].isCorrect = false
    setCards(newCards)
    goToNext()
  }

  function goToNext() {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    } else {
      finishStudy()
    }
  }

  function goToPrevious() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  function finishStudy() {
    const correctCards = cards.filter(c => c.isCorrect === true).length
    const totalCards = cards.length
    const duration = Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60)

    const session = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      totalCards,
      correctCards,
      areas: config?.areas || [],
      duration,
    }

    // Salvar sessão
    const sessions = JSON.parse(localStorage.getItem('studySessions') || '[]')
    sessions.push(session)
    localStorage.setItem('studySessions', JSON.stringify(sessions))

    // Ir para resultado
    navigate('/study-result', { state: { session } })
  }

  if (!config || cards.length === 0) {
    return <div className="loading">Carregando...</div>
  }

  const currentCard = cards[currentIndex]
  const progress = ((currentIndex + 1) / cards.length) * 100
  const correctCount = cards.filter(c => c.isCorrect === true).length
  const incorrectCount = cards.filter(c => c.isCorrect === false).length

  return (
    <div className="study-container">
      {/* Header */}
      <div className="study-header">
        <button className="back-button" onClick={() => navigate('/setup')}>
          ← Voltar
        </button>
        <div className="study-progress">
          <span className="progress-text">
            {currentIndex + 1} de {cards.length}
          </span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="study-stats">
          <span className="stat correct">✓ {correctCount}</span>
          <span className="stat incorrect">✗ {incorrectCount}</span>
        </div>
      </div>

      {/* Card */}
      <div className="study-content">
        <div
          className={`flashcard ${isFlipped ? 'flipped' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <div className="card-area">{currentCard.area.replace(/_/g, ' ')}</div>
              <div className="card-question">{currentCard.question}</div>
              <div className="card-hint">Clique para ver a resposta</div>
            </div>
            <div className="flashcard-back">
              <div className="card-answer">{currentCard.answer}</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="study-controls">
          <button
            className="control-button prev"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
          >
            ← Anterior
          </button>
          <div className="response-buttons">
            <button className="response-button incorrect" onClick={handleIncorrect}>
              Errei
            </button>
            <button className="response-button correct" onClick={handleCorrect}>
              Acertei
            </button>
          </div>
          <button
            className="control-button next"
            onClick={goToNext}
            disabled={currentIndex === cards.length - 1}
          >
            Próximo →
          </button>
        </div>

        {/* Finish Button */}
        {currentIndex === cards.length - 1 && (
          <button className="finish-button" onClick={finishStudy}>
            Finalizar Simulado
          </button>
        )}
      </div>
    </div>
  )
}
