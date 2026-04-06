export class WebSocketHub {
    clients = new Map();
    addClient(clientId, ws, userId) {
        this.clients.set(clientId, { ws, userId, subscribedProjects: new Set() });
    }
    removeClient(clientId) {
        this.clients.delete(clientId);
    }
    subscribe(clientId, projectId) {
        this.clients.get(clientId)?.subscribedProjects.add(projectId);
    }
    unsubscribe(clientId, projectId) {
        this.clients.get(clientId)?.subscribedProjects.delete(projectId);
    }
    broadcast(event) {
        const projectId = event.projectId;
        for (const client of this.clients.values()) {
            // If event has projectId, only send to subscribed clients
            // If no projectId, send to all
            if (!projectId || client.subscribedProjects.has(projectId)) {
                try {
                    client.ws.send(JSON.stringify(event));
                }
                catch {
                    // Client may have disconnected
                }
            }
        }
    }
    getClientCount() {
        return this.clients.size;
    }
}
//# sourceMappingURL=hub.js.map