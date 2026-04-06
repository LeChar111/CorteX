import type { WSContext } from 'hono/ws';

interface ConnectedClient {
  ws: WSContext;
  userId: string;
  subscribedProjects: Set<string>;
}

export class WebSocketHub {
  private clients = new Map<string, ConnectedClient>();

  addClient(clientId: string, ws: WSContext, userId: string): void {
    this.clients.set(clientId, { ws, userId, subscribedProjects: new Set() });
  }

  removeClient(clientId: string): void {
    this.clients.delete(clientId);
  }

  subscribe(clientId: string, projectId: string): void {
    this.clients.get(clientId)?.subscribedProjects.add(projectId);
  }

  unsubscribe(clientId: string, projectId: string): void {
    this.clients.get(clientId)?.subscribedProjects.delete(projectId);
  }

  broadcast(event: Record<string, unknown>): void {
    const projectId = event.projectId as string | undefined;

    for (const client of this.clients.values()) {
      // If event has projectId, only send to subscribed clients
      // If no projectId, send to all
      if (!projectId || client.subscribedProjects.has(projectId)) {
        try {
          client.ws.send(JSON.stringify(event));
        } catch {
          // Client may have disconnected
        }
      }
    }
  }

  getClientCount(): number {
    return this.clients.size;
  }
}
