import { useState } from 'react'
import './PDFViewer.css'

interface PDFViewerProps {
  pdfUrl: string
  title: string
  onClose?: () => void
}

export default function PDFViewer({ pdfUrl, title, onClose }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleIframeError = () => {
    setError('Erro ao carregar o PDF. Tente fazer download ou abrir em uma nova aba.')
    setIsLoading(false)
  }

  return (
    <div className="pdf-viewer-overlay">
      <div className="pdf-viewer-container">
        <div className="pdf-viewer-header">
          <h2>{title}</h2>
          <div className="pdf-viewer-actions">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pdf-viewer-button download-btn"
              title="Baixar PDF"
            >
              📥 Baixar
            </a>
            {onClose && (
              <button
                onClick={onClose}
                className="pdf-viewer-button close-btn"
                title="Fechar"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="pdf-viewer-loading">
            <div className="spinner"></div>
            <p>Carregando PDF...</p>
          </div>
        )}

        {error && (
          <div className="pdf-viewer-error">
            <p>{error}</p>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="pdf-viewer-link">
              Abrir PDF em uma nova aba
            </a>
          </div>
        )}

        <iframe
          src={`${pdfUrl}#toolbar=0`}
          className="pdf-viewer-iframe"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          title={`Visualizador de PDF: ${title}`}
        />
      </div>
    </div>
  )
}
