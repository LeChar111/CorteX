import { describe, it, expect, vi, beforeEach } from 'vitest';
import EventEmitter from 'node:events';
// Mock pg module before importing PgListener
vi.mock('pg', () => {
    const MockClient = vi.fn().mockImplementation(() => {
        const emitter = new EventEmitter();
        return {
            connect: vi.fn().mockResolvedValue(undefined),
            query: vi.fn().mockResolvedValue(undefined),
            end: vi.fn().mockResolvedValue(undefined),
            on: emitter.on.bind(emitter),
            emit: emitter.emit.bind(emitter),
        };
    });
    return { default: { Client: MockClient } };
});
import { PgListener } from '../ws/pg-listener.js';
import pg from 'pg';
describe('PgListener', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('registers handlers via onNotify', () => {
        const listener = new PgListener('postgres://localhost/test');
        const handler1 = vi.fn();
        const handler2 = vi.fn();
        listener.onNotify(handler1);
        listener.onNotify(handler2);
        // Access private handlers via type assertion to verify registration
        // We'll verify by checking they're called on notification below
        expect(handler1).not.toHaveBeenCalled();
        expect(handler2).not.toHaveBeenCalled();
    });
    it('connects and issues LISTEN on start', async () => {
        const listener = new PgListener('postgres://localhost/test');
        await listener.start();
        const ClientMock = pg.Client;
        const clientInstance = ClientMock.mock.results[0].value;
        expect(clientInstance.connect).toHaveBeenCalledOnce();
        expect(clientInstance.query).toHaveBeenCalledWith('LISTEN cortex_events');
    });
    it('calls all registered handlers with parsed payload on notification', async () => {
        const listener = new PgListener('postgres://localhost/test');
        const handler1 = vi.fn();
        const handler2 = vi.fn();
        listener.onNotify(handler1);
        listener.onNotify(handler2);
        await listener.start();
        const ClientMock = pg.Client;
        const clientInstance = ClientMock.mock.results[0].value;
        const payload = { eventType: 'scan.completed', projectId: 'proj-1' };
        clientInstance.emit('notification', {
            channel: 'cortex_events',
            payload: JSON.stringify(payload),
        });
        expect(handler1).toHaveBeenCalledWith(payload);
        expect(handler2).toHaveBeenCalledWith(payload);
    });
    it('ignores notifications from other channels', async () => {
        const listener = new PgListener('postgres://localhost/test');
        const handler = vi.fn();
        listener.onNotify(handler);
        await listener.start();
        const ClientMock = pg.Client;
        const clientInstance = ClientMock.mock.results[0].value;
        clientInstance.emit('notification', {
            channel: 'other_channel',
            payload: JSON.stringify({ foo: 'bar' }),
        });
        expect(handler).not.toHaveBeenCalled();
    });
    it('handles malformed JSON gracefully without throwing', async () => {
        const listener = new PgListener('postgres://localhost/test');
        const handler = vi.fn();
        listener.onNotify(handler);
        await listener.start();
        const ClientMock = pg.Client;
        const clientInstance = ClientMock.mock.results[0].value;
        // Should not throw
        expect(() => {
            clientInstance.emit('notification', {
                channel: 'cortex_events',
                payload: 'not valid json {{{',
            });
        }).not.toThrow();
        expect(handler).not.toHaveBeenCalled();
    });
    it('does not call stop client.end if not connected', async () => {
        const listener = new PgListener('postgres://localhost/test');
        // Never started
        await listener.stop();
        const ClientMock = pg.Client;
        const clientInstance = ClientMock.mock.results[0].value;
        expect(clientInstance.end).not.toHaveBeenCalled();
    });
    it('calls client.end on stop after start', async () => {
        const listener = new PgListener('postgres://localhost/test');
        await listener.start();
        await listener.stop();
        const ClientMock = pg.Client;
        const clientInstance = ClientMock.mock.results[0].value;
        expect(clientInstance.end).toHaveBeenCalledOnce();
    });
});
//# sourceMappingURL=pg-listener.test.js.map