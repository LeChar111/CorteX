import pg from 'pg';
export class PgListener {
    client;
    handlers = [];
    connected = false;
    constructor(connectionString) {
        this.client = new pg.Client({ connectionString });
    }
    onNotify(handler) {
        this.handlers.push(handler);
    }
    async start() {
        await this.client.connect();
        this.connected = true;
        await this.client.query('LISTEN cortex_events');
        this.client.on('notification', (msg) => {
            if (msg.channel === 'cortex_events' && msg.payload) {
                try {
                    const payload = JSON.parse(msg.payload);
                    for (const handler of this.handlers) {
                        handler(payload);
                    }
                }
                catch (err) {
                    console.error('Failed to parse pg_notify payload:', err);
                }
            }
        });
        console.log('PgListener: listening on cortex_events');
    }
    async stop() {
        if (this.connected) {
            await this.client.end();
            this.connected = false;
        }
    }
}
//# sourceMappingURL=pg-listener.js.map