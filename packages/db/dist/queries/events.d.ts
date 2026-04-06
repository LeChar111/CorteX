import { events } from '../schema.js';
import type { Database } from '../connection.js';
export type NewEvent = typeof events.$inferInsert;
export type Event = typeof events.$inferSelect;
export declare function insertEvent(db: Database, data: Pick<NewEvent, 'type' | 'projectId' | 'repoId' | 'userId' | 'payload'>): Promise<Event>;
export interface ListEventsOptions {
    projectId?: string;
    type?: string;
    limit?: number;
    offset?: number;
}
export declare function listEvents(db: Database, options?: ListEventsOptions): Promise<Event[]>;
//# sourceMappingURL=events.d.ts.map