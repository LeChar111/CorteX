type NotificationHandler = (payload: Record<string, unknown>) => void;
export declare class PgListener {
    private client;
    private handlers;
    private connected;
    constructor(connectionString: string);
    onNotify(handler: NotificationHandler): void;
    start(): Promise<void>;
    stop(): Promise<void>;
}
export {};
//# sourceMappingURL=pg-listener.d.ts.map