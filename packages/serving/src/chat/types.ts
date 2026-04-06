export type ChatMode = 'auto' | 'fast' | 'smart' | 'agent';
export type ResolvedMode = 'fast' | 'smart' | 'agent';

export interface ChatRequest {
  message: string;
  projectId?: string;
  mode?: ChatMode;
  history?: ChatMessage[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SSEWriter {
  writeMeta(mode: ResolvedMode, model: string): void;
  writeToken(text: string): void;
  writeSources(sources: string[]): void;
  writeDone(): void;
  writeError(message: string): void;
}

export interface EngineInput {
  message: string;
  history: ChatMessage[];
  context: string;
  projectName?: string;
}
