import { useEffect, useRef, useState, useCallback } from 'react';
export function useWebSocket(url) {
    const wsRef = useRef(null);
    const [connected, setConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState(null);
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
            }
            catch { /* ignore */ }
        };
        return () => {
            wsRef.current = null;
            ws.close();
        };
    }, [url]);
    const subscribe = useCallback((projectId) => {
        wsRef.current?.send(JSON.stringify({ type: 'subscribe', projectId }));
    }, []);
    return { connected, lastMessage, subscribe };
}
