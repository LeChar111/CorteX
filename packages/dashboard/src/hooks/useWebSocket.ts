import { useEffect, useRef, useState, useCallback } from 'react';

interface WSMessage {
  type: string;
  [key: string]: unknown;
}

export function useWebSocket(url: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => {
      setConnected(false);
      // Auto-reconnect after 3s
      setTimeout(() => {
        if (wsRef.current === ws) {
          wsRef.current = new WebSocket(url);
        }
      }, 3000);
    };
    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        setLastMessage(data);
      } catch { /* ignore */ }
    };

    return () => {
      wsRef.current = null;
      ws.close();
    };
  }, [url]);

  const subscribe = useCallback((projectId: string) => {
    wsRef.current?.send(JSON.stringify({ type: 'subscribe', projectId }));
  }, []);

  return { connected, lastMessage, subscribe };
}
