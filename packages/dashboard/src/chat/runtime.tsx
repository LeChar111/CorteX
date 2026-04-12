import { useCallback, useRef, type ReactNode } from 'react';
import { AssistantRuntimeProvider } from '@assistant-ui/react';
import { useDataStreamRuntime } from '@assistant-ui/react-data-stream';

export type ChatMode = 'auto' | 'fast' | 'smart' | 'agent';

const API_KEY = 'dev-key-1';
const API_BASE =
  typeof window !== 'undefined' && window.location.port === '5173'
    ? `${window.location.protocol}//${window.location.hostname}:3100`
    : '';

interface CortexRuntimeProviderProps {
  children: ReactNode;
  projectId?: string;
  mode: ChatMode;
  onMeta?: (meta: { mode?: string; model?: string }) => void;
  onError?: (message: string) => void;
}

export function CortexRuntimeProvider({
  children,
  projectId,
  mode,
  onMeta,
  onError,
}: CortexRuntimeProviderProps) {
  // Keep latest values in refs so the runtime (memoized internally) always
  // reads current selections without being recreated on every change.
  const projectIdRef = useRef(projectId);
  const modeRef = useRef(mode);
  projectIdRef.current = projectId;
  modeRef.current = mode;

  const handleData = useCallback(
    (part: { name: string; data: unknown }) => {
      if (part.name === 'meta' && onMeta) {
        onMeta(part.data as { mode?: string; model?: string });
      } else if (part.name === 'error' && onError) {
        const msg = (part.data as { message?: string })?.message ?? 'Unknown error';
        onError(msg);
      }
    },
    [onMeta, onError],
  );

  const runtime = useDataStreamRuntime({
    api: `${API_BASE}/api/chat`,
    protocol: 'data-stream',
    headers: { 'X-API-Key': API_KEY },
    body: async () => ({
      projectId: projectIdRef.current || undefined,
      mode: modeRef.current,
    }),
    onData: handleData,
    onError: (err) => onError?.(err.message),
  });

  return <AssistantRuntimeProvider runtime={runtime}>{children}</AssistantRuntimeProvider>;
}
