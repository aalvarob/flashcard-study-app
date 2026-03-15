import { useEffect, useRef, useCallback, useState } from 'react';

export interface FlashcardEvent {
  type: 'create' | 'update' | 'delete' | 'sync' | 'connected';
  flashcard?: {
    id: string | number;
    question: string;
    answer: string;
    area: string;
  };
  id?: string | number;
  timestamp: number;
  error?: string;
}

type EventHandler = (event: FlashcardEvent) => void;

export function useWebSocket(onEvent?: EventHandler) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handlersRef = useRef<Set<EventHandler>>(new Set());

  const getWebSocketUrl = useCallback(() => {
    // Determine the WebSocket URL based on the current environment
    if (typeof window === 'undefined') return null;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/api/ws`;
  }, []);

  const connect = useCallback(() => {
    const wsUrl = getWebSocketUrl();
    if (!wsUrl) return;

    try {
      console.log('[useWebSocket] Connecting to', wsUrl);
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('[useWebSocket] Connected');
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const data: FlashcardEvent = JSON.parse(event.data);
          console.log('[useWebSocket] Received:', data.type);

          // Call all registered handlers
          handlersRef.current.forEach((handler) => {
            try {
              handler(data);
            } catch (err) {
              console.error('[useWebSocket] Handler error:', err);
            }
          });

          // Call the onEvent callback if provided
          if (onEvent) {
            onEvent(data);
          }
        } catch (err) {
          console.error('[useWebSocket] Parse error:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('[useWebSocket] Error:', event);
        setError('WebSocket connection error');
      };

      ws.onclose = () => {
        console.log('[useWebSocket] Disconnected');
        setIsConnected(false);
        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          connect();
        }, 3000);
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('[useWebSocket] Connection error:', err);
      setError(String(err));
    }
  }, [getWebSocketUrl, onEvent]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const send = useCallback((event: FlashcardEvent) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(event));
    } else {
      console.warn('[useWebSocket] WebSocket not connected');
    }
  }, []);

  const subscribe = useCallback((handler: EventHandler) => {
    handlersRef.current.add(handler);
    return () => {
      handlersRef.current.delete(handler);
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    error,
    send,
    subscribe,
    disconnect,
    connect,
  };
}
