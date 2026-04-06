import pg from 'pg';

type NotificationHandler = (payload: Record<string, unknown>) => void;

export class PgListener {
  private client: pg.Client;
  private handlers: NotificationHandler[] = [];
  private connected = false;

  constructor(connectionString: string) {
    this.client = new pg.Client({ connectionString });
  }

  onNotify(handler: NotificationHandler): void {
    this.handlers.push(handler);
  }

  async start(): Promise<void> {
    await this.client.connect();
    this.connected = true;
    await this.client.query('LISTEN cortex_events');

    this.client.on('notification', (msg) => {
      if (msg.channel === 'cortex_events' && msg.payload) {
        try {
          const payload = JSON.parse(msg.payload) as Record<string, unknown>;
          for (const handler of this.handlers) {
            handler(payload);
          }
        } catch (err) {
          console.error('Failed to parse pg_notify payload:', err);
        }
      }
    });

    console.log('PgListener: listening on cortex_events');
  }

  async stop(): Promise<void> {
    if (this.connected) {
      await this.client.end();
      this.connected = false;
    }
  }
}
