import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WebSocketHub } from '../ws/hub.js';
import type { WSContext } from 'hono/ws';

function makeMockWs(): WSContext {
  return {
    send: vi.fn(),
    close: vi.fn(),
    raw: undefined,
    binaryType: 'arraybuffer',
    readyState: 1,
    url: null,
    protocol: null,
    extensions: null,
  } as unknown as WSContext;
}

describe('WebSocketHub', () => {
  let hub: WebSocketHub;

  beforeEach(() => {
    hub = new WebSocketHub();
  });

  describe('addClient / removeClient', () => {
    it('adds a client and increases count', () => {
      const ws = makeMockWs();
      hub.addClient('client-1', ws, 'user-1');
      expect(hub.getClientCount()).toBe(1);
    });

    it('removes a client and decreases count', () => {
      const ws = makeMockWs();
      hub.addClient('client-1', ws, 'user-1');
      hub.removeClient('client-1');
      expect(hub.getClientCount()).toBe(0);
    });

    it('removing a non-existent client is a no-op', () => {
      expect(() => hub.removeClient('ghost')).not.toThrow();
      expect(hub.getClientCount()).toBe(0);
    });
  });

  describe('subscribe / unsubscribe', () => {
    it('subscribe adds a projectId to a client', () => {
      const ws = makeMockWs();
      hub.addClient('client-1', ws, 'user-1');
      hub.subscribe('client-1', 'proj-a');

      // Verify via broadcast: event for proj-a should reach client-1
      hub.broadcast({ projectId: 'proj-a', type: 'test' });
      expect(ws.send).toHaveBeenCalledOnce();
    });

    it('unsubscribe removes a projectId from a client', () => {
      const ws = makeMockWs();
      hub.addClient('client-1', ws, 'user-1');
      hub.subscribe('client-1', 'proj-a');
      hub.unsubscribe('client-1', 'proj-a');

      hub.broadcast({ projectId: 'proj-a', type: 'test' });
      expect(ws.send).not.toHaveBeenCalled();
    });

    it('subscribe on unknown clientId is a no-op', () => {
      expect(() => hub.subscribe('ghost', 'proj-a')).not.toThrow();
    });
  });

  describe('broadcast', () => {
    it('broadcasts to all clients when event has no projectId', () => {
      const ws1 = makeMockWs();
      const ws2 = makeMockWs();
      hub.addClient('client-1', ws1, 'user-1');
      hub.addClient('client-2', ws2, 'user-2');

      hub.broadcast({ type: 'global.event' });

      expect(ws1.send).toHaveBeenCalledOnce();
      expect(ws2.send).toHaveBeenCalledOnce();
    });

    it('broadcasts only to subscribed clients when event has projectId', () => {
      const ws1 = makeMockWs();
      const ws2 = makeMockWs();
      hub.addClient('client-1', ws1, 'user-1');
      hub.addClient('client-2', ws2, 'user-2');
      hub.subscribe('client-1', 'proj-x');
      // client-2 is not subscribed to proj-x

      hub.broadcast({ projectId: 'proj-x', type: 'scan.done' });

      expect(ws1.send).toHaveBeenCalledOnce();
      expect(ws2.send).not.toHaveBeenCalled();
    });

    it('sends the JSON-serialised event payload', () => {
      const ws = makeMockWs();
      hub.addClient('client-1', ws, 'user-1');
      const event = { type: 'ping', data: 42 };

      hub.broadcast(event);

      expect(ws.send).toHaveBeenCalledWith(JSON.stringify(event));
    });

    it('does not throw when a client send() throws', () => {
      const ws = makeMockWs();
      (ws.send as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('WebSocket closed');
      });
      hub.addClient('client-1', ws, 'user-1');

      expect(() => hub.broadcast({ type: 'test' })).not.toThrow();
    });

    it('broadcasts to multiple subscribed clients for the same project', () => {
      const ws1 = makeMockWs();
      const ws2 = makeMockWs();
      const ws3 = makeMockWs();
      hub.addClient('c1', ws1, 'u1');
      hub.addClient('c2', ws2, 'u2');
      hub.addClient('c3', ws3, 'u3');
      hub.subscribe('c1', 'proj-y');
      hub.subscribe('c2', 'proj-y');
      // c3 not subscribed

      hub.broadcast({ projectId: 'proj-y', type: 'update' });

      expect(ws1.send).toHaveBeenCalledOnce();
      expect(ws2.send).toHaveBeenCalledOnce();
      expect(ws3.send).not.toHaveBeenCalled();
    });
  });

  describe('getClientCount', () => {
    it('returns 0 for empty hub', () => {
      expect(hub.getClientCount()).toBe(0);
    });

    it('reflects current number of connected clients', () => {
      hub.addClient('c1', makeMockWs(), 'u1');
      hub.addClient('c2', makeMockWs(), 'u2');
      expect(hub.getClientCount()).toBe(2);
      hub.removeClient('c1');
      expect(hub.getClientCount()).toBe(1);
    });
  });
});
