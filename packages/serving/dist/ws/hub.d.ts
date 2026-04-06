import type { WSContext } from 'hono/ws';
export declare class WebSocketHub {
    private clients;
    addClient(clientId: string, ws: WSContext, userId: string): void;
    removeClient(clientId: string): void;
    subscribe(clientId: string, projectId: string): void;
    unsubscribe(clientId: string, projectId: string): void;
    broadcast(event: Record<string, unknown>): void;
    getClientCount(): number;
}
//# sourceMappingURL=hub.d.ts.map