import { useState } from 'react'
import '../styles/WordImporter.css'

interface ImportedCard {
  question: string
  answer: string
  area: string
  enabled: boolean
}

interface ImportProgress {
  status: 'idle' | 'uploading' | 'parsing' | 'success' | 'error'
  message: string
  cardsFound: number
  cardsProcessed: number
}

export default function WordImporter({ onImport }: { onImport: (cards: ImportedCard[]) => void }) {
  const [progress, setProgress] = useState<ImportProgress>({
    status: 'idle',
    message: '',
    cardsFound: 0,
    cardsProcessed: 0,
  })
  const [isDragging, setIsDragging] = useState(false)

  const parseWordContent = (text: string): ImportedCard[] => {
    const cards: ImportedCard[] = []
    const lines = text.split('\n').map(line => line.trim()).filter(line => line)

    let currentArea = 'Geral'
    let currentQuestion = ''
    let currentAnswer = ''
    let isQuestion = false
    let isAnswer = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Detectar área teológica (linhas em maiúsculas ou com padrão A, B, C, etc)
      if (line.match(/^[A-Z][\s\-]|^[A-Z]{2,}[\s\-]/) && !line.startsWith('Pergunta') && !line.startsWith('Resposta')) {
        currentArea = line
        continue
      }

      // Detectar pergunta
      if (line.startsWith('Pergunta:')) {
        // Salvar pergunta anterior se existir
        if (currentQuestion && currentAnswer) {
          cards.push({
            question: currentQuestion.trim(),
            answer: currentAnswer.trim(),
            area: currentArea,
            enabled: true,
          })
        }
        currentQuestion = line.replace('Pergunta:', '').trim()
        currentAnswer = ''
        isQuestion = true
        isAnswer = false
        continue
      }

      // Detectar resposta
      if (line.startsWith('Resposta:')) {
        currentAnswer = line.replace('Resposta:', '').trim()
        isQuestion = false
        isAnswer = true
        continue
      }

      // Acumular texto da pergunta ou resposta
      if (isQuestion && !isAnswer) {
        currentQuestion += ' ' + line
      } else if (isAnswer) {
        currentAnswer += ' ' + line
      }
    }

    // Salvar último card
    if (currentQuestion && currentAnswer) {
      cards.push({
        question: currentQuestion.trim(),
        answer: currentAnswer.trim(),
        area: currentArea,
        enabled: true,
      })
    }

    return cards
  }

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith('.docx')) {
      setProgress({
        status: 'error',
        message: 'Por favor, selecione um arquivo .docx válido',
        cardsFound: 0,
        cardsProcessed: 0,
      })
      return
    }

    setProgress({
      status: 'uploading',
      message: 'Carregando arquivo...',
      cardsFound: 0,
      cardsProcessed: 0,
    })

    try {
      // Usar mammoth para extrair texto do Word
      const arrayBuffer = await file.arrayBuffer()
      
      // Dynamic import para evitar erro se mammoth não estiver disponível no build
      const mammoth = await import('mammoth' as any)
      
      setProgress({
        status: 'parsing',
        message: 'Analisando conteúdo...',
        cardsFound: 0,
        cardsProcessed: 0,
      })

      const result = await mammoth.extractRawText({ arrayBuffer })
      const cards = parseWordContent(result.value)

      setProgress({
        status: 'success',
        message: `${cards.length} cards encontrados e importados com sucesso!`,
        cardsFound: cards.length,
        cardsProcessed: cards.length,
      })

      onImport(cards)

      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        setProgress({
          status: 'idle',
          message: '',
          cardsFound: 0,
          cardsProcessed: 0,
        })
      }, 3000)
    } catch (error) {
      console.error('Erro ao processar arquivo:', error)
      setProgress({
        status: 'error',
        message: `Erro ao processar arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        cardsFound: 0,
        cardsProcessed: 0,
      })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  return (
    <div className="word-importer">
      <h3>Importar Cards do Word</h3>
      
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="drop-zone-content">
          <div className="drop-zone-icon">📄</div>
          <p className="drop-zone-text">
            Arraste um arquivo .docx aqui ou clique para selecionar
          </p>
          <input
            type="file"
            accept=".docx"
            onChange={handleInputChange}
            className="file-input"
            disabled={progress.status === 'uploading' || progress.status === 'parsing'}
          />
        </div>
      </div>

      {progress.status !== 'idle' && (
        <div className={`progress-message ${progress.status}`}>
          {progress.status === 'uploading' && <div className="spinner"></div>}
          {progress.status === 'parsing' && <div className="spinner"></div>}
          
          <div className="message-content">
            <p>{progress.message}</p>
            {progress.cardsFound > 0 && (
              <p className="cards-info">
                {progress.cardsProcessed} de {progress.cardsFound} cards processados
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
