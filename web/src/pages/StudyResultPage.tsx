import { useLocation, useNavigate } from 'react-router-dom'
import './StudyResultPage.css'

interface StudySession {
  id: string
  date: string
  totalCards: number
  correctCards: number
  areas: string[]
  duration: number
}

export default function StudyResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const session = location.state?.session as StudySession | undefined

  if (!session) {
    return (
      <div className="result-container">
        <div className="result-error">
          <h1>Erro ao carregar resultado</h1>
          <button onClick={() => navigate('/setup')}>Voltar para Setup</button>
        </div>
      </div>
    )
  }

  const percentage = Math.round((session.correctCards / session.totalCards) * 100)
  const isGood = percentage >= 70
  const isPerfect = percentage === 100

  return (
    <div className="result-container">
      <div className="result-card">
        {/* Header */}
        <div className={`result-header ${isPerfect ? 'perfect' : isGood ? 'good' : 'fair'}`}>
          <div className="result-emoji">
            {isPerfect ? '🎉' : isGood ? '👏' : '💪'}
          </div>
          <h1>
            {isPerfect
              ? 'Perfeito!'
              : isGood
                ? 'Muito Bom!'
                : 'Bom Trabalho!'}
          </h1>
        </div>

        {/* Score */}
        <div className="result-score">
          <div className="score-circle">
            <div className="score-percentage">{percentage}%</div>
          </div>
          <div className="score-details">
            <p className="score-label">Taxa de Acerto</p>
            <p className="score-cards">
              {session.correctCards} de {session.totalCards} cartões
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="result-stats">
          <div className="stat-item">
            <span className="stat-icon">✓</span>
            <div className="stat-content">
              <span className="stat-label">Acertos</span>
              <span className="stat-value">{session.correctCards}</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">✗</span>
            <div className="stat-content">
              <span className="stat-label">Erros</span>
              <span className="stat-value">{session.totalCards - session.correctCards}</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⏱️</span>
            <div className="stat-content">
              <span className="stat-label">Tempo</span>
              <span className="stat-value">{session.duration} min</span>
            </div>
          </div>
        </div>

        {/* Areas */}
        {session.areas.length > 0 && (
          <div className="result-areas">
            <h3>Áreas Estudadas</h3>
            <div className="areas-tags">
              {session.areas.map((area, index) => (
                <span key={index} className="area-tag">
                  {area.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Feedback */}
        <div className="result-feedback">
          {isPerfect && (
            <p>
              Parabéns! Você acertou todas as questões. Continue assim para manter seu
              desempenho excelente!
            </p>
          )}
          {isGood && !isPerfect && (
            <p>
              Ótimo desempenho! Você está indo bem. Revise os cartões que errou para melhorar
              ainda mais.
            </p>
          )}
          {!isGood && (
            <p>
              Bom começo! Revise os cartões que errou e tente novamente. A prática leva à
              perfeição!
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="result-actions">
          <button className="action-button secondary" onClick={() => navigate('/stats')}>
            Ver Estatísticas
          </button>
          <button className="action-button primary" onClick={() => navigate('/setup')}>
            Novo Simulado
          </button>
        </div>
      </div>
    </div>
  )
}
