import { useOfflineMode } from '../hooks/useOfflineMode'
import './OfflineIndicator.css'

export function OfflineIndicator() {
  const { isOnline, syncQueue } = useOfflineMode()

  if (isOnline && syncQueue.length === 0) {
    return null
  }

  return (
    <div className={`offline-indicator ${isOnline ? 'syncing' : 'offline'}`}>
      <div className="indicator-content">
        <span className="indicator-icon">
          {isOnline ? '🔄' : '📡'}
        </span>
        <span className="indicator-text">
          {isOnline ? (
            <>
              Sincronizando {syncQueue.length} item{syncQueue.length !== 1 ? 's' : ''}...
            </>
          ) : (
            <>
              Modo offline • {syncQueue.length} item{syncQueue.length !== 1 ? 's' : ''} pendente{syncQueue.length !== 1 ? 's' : ''}
            </>
          )}
        </span>
      </div>
    </div>
  )
}
