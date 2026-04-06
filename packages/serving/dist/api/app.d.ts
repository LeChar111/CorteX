import { Hono } from 'hono';
import type { WebSocketHub } from '../ws/hub.js';
import type { NodeWebSocket } from '@hono/node-ws';
interface AppOptions {
    apiKeys: string[];
    hub?: WebSocketHub;
}
export type AppWithWs = Hono & {
    injectWebSocket: NodeWebSocket['injectWebSocket'];
};
export declare function createApp({ apiKeys, hub }: AppOptions): AppWithWs;
export {};
//# sourceMappingURL=app.d.ts.map