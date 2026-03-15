import { useState, useEffect, useCallback } from 'react'

export interface OfflineSyncQueue {
  id: string
  type: 'create' | 'update' | 'delete'
  endpoint: string
  data: unknown
  timestamp: number
  retries: number
}

interface UseOfflineModeResult {
  isOnline: boolean
  syncQueue: OfflineSyncQueue[]
  addToQueue: (item: Omit<OfflineSyncQueue, 'id' | 'timestamp' | 'retries'>) => void
  clearQueue: () => void
  syncPendingItems: () => Promise<void>
}

/**
 * Hook para gerenciar modo offline e sincronização de dados
 * Detecta conexão com internet e mantém fila de operações offline
 */
export function useOfflineMode(): UseOfflineModeResult {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [syncQueue, setSyncQueue] = useState<OfflineSyncQueue[]>([])

  // Detectar mudanças de conexão
  useEffect(() => {
    const handleOnline = () => {
      console.log('Conexão restaurada')
      setIsOnline(true)
      // Sincronizar automaticamente quando reconectar
      syncPendingItems()
    }

    const handleOffline = () => {
      console.log('Modo offline ativado')
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Carregar fila do localStorage ao montar
  useEffect(() => {
    const saved = localStorage.getItem('syncQueue')
    if (saved) {
      try {
        setSyncQueue(JSON.parse(saved))
      } catch (err) {
        console.error('Erro ao carregar fila de sincronização:', err)
      }
    }
  }, [])

  // Salvar fila no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('syncQueue', JSON.stringify(syncQueue))
  }, [syncQueue])

  const addToQueue = useCallback((item: Omit<OfflineSyncQueue, 'id' | 'timestamp' | 'retries'>) => {
    const newItem: OfflineSyncQueue = {
      ...item,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      retries: 0,
    }
    setSyncQueue(prev => [...prev, newItem])
    console.log('Item adicionado à fila de sincronização:', newItem)
  }, [])

  const clearQueue = useCallback(() => {
    setSyncQueue([])
    localStorage.removeItem('syncQueue')
  }, [])

  const syncPendingItems = useCallback(async () => {
    if (syncQueue.length === 0) return

    console.log(`Sincronizando ${syncQueue.length} itens...`)
    const failedItems: OfflineSyncQueue[] = []

    for (const item of syncQueue) {
      try {
        const response = await fetch(`/api/trpc/${item.endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data),
          credentials: 'include',
        })

        if (!response.ok) {
          failedItems.push({
            ...item,
            retries: item.retries + 1,
          })
        } else {
          console.log(`✓ Item sincronizado: ${item.id}`)
        }
      } catch (err) {
        console.error(`Erro ao sincronizar ${item.id}:`, err)
        failedItems.push({
          ...item,
          retries: item.retries + 1,
        })
      }
    }

    // Manter apenas itens que falharam (máximo 3 tentativas)
    setSyncQueue(failedItems.filter(item => item.retries < 3))

    if (failedItems.length === 0) {
      console.log('✓ Todos os itens foram sincronizados com sucesso!')
    } else {
      console.warn(`⚠ ${failedItems.length} itens ainda não foram sincronizados`)
    }
  }, [syncQueue])

  return {
    isOnline,
    syncQueue,
    addToQueue,
    clearQueue,
    syncPendingItems,
  }
}
