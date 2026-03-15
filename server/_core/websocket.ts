import { WebSocketServer, WebSocket } from 'ws';
import { Server as HTTPServer } from 'http';

export interface FlashcardEvent {
  type: 'create' | 'update' | 'delete' | 'sync';
  flashcard?: {
    id: string | number;
    question: string;
    answer: string;
    area: string;
  };
  id?: string | number;
  timestamp: number;
}

class FlashcardWebSocketServer {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  constructor(server: HTTPServer) {
    this.wss = new WebSocketServer({ server, path: '/api/ws' });
    this.setupServer();
  }

  private setupServer() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('[WebSocket] Client connected');
      this.clients.add(ws);

      ws.on('message', (data: string) => {
        try {
          const event: FlashcardEvent = JSON.parse(data);
          this.handleMessage(ws, event);
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error);
          ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        console.log('[WebSocket] Client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error: Error) => {
        console.error('[WebSocket] Error:', error);
        this.clients.delete(ws);
      });

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connected',
        timestamp: Date.now(),
      }));
    });
  }

  private handleMessage(sender: WebSocket, event: FlashcardEvent) {
    console.log('[WebSocket] Received event:', event.type);

    // Broadcast to all connected clients
    this.broadcast(event, sender);
  }

  public broadcast(event: FlashcardEvent, excludeSender?: WebSocket) {
    const message = JSON.stringify(event);

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        // Send to all clients or exclude sender
        if (!excludeSender || client !== excludeSender) {
          client.send(message);
        }
      }
    });
  }

  public broadcastFlashcardEvent(event: FlashcardEvent) {
    this.broadcast(event);
  }

  public getClientCount(): number {
    return this.clients.size;
  }
}

export function setupWebSocketServer(server: HTTPServer): FlashcardWebSocketServer {
  return new FlashcardWebSocketServer(server);
}
