import { useEffect, useRef, useState, useCallback } from 'react';

const WS_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8080';
const WS_URL  = `${WS_BASE}/ws`;

/**
 * useWebSocket — kết nối STOMP/WebSocket và subscribe topic.
 * Dùng SockJS + @stomp/stompjs.
 *
 * @param {string}   topic     — STOMP destination, e.g. '/topic/admin/orders'
 * @param {function} onMessage — callback(payload: object) khi nhận message
 * @param {boolean}  enabled   — bật/tắt kết nối (default true)
 */
export function useWebSocket(topic, onMessage, enabled = true) {
  const clientRef   = useRef(null);
  const callbackRef = useRef(onMessage);
  const [connected, setConnected] = useState(false);

  // Luôn dùng ref mới nhất để tránh stale closure
  useEffect(() => { callbackRef.current = onMessage; }, [onMessage]);

  useEffect(() => {
    if (!enabled) return;

    // Lazy-import để tránh crash nếu chưa cài package
    let destroyed = false;

    (async () => {
      try {
        const [{ Client }, SockJSModule] = await Promise.all([
          import('@stomp/stompjs'),
          import('sockjs-client'),
        ]);
        const SockJS = SockJSModule.default ?? SockJSModule;

        if (destroyed) return;

        const client = new Client({
          webSocketFactory: () => new SockJS(WS_URL),
          reconnectDelay: 5000,
          onConnect: () => {
            if (destroyed) return;
            setConnected(true);
            client.subscribe(topic, (msg) => {
              try { callbackRef.current(JSON.parse(msg.body)); }
              catch { /* ignore */ }
            });
          },
          onDisconnect: () => setConnected(false),
          onStompError:  () => setConnected(false),
        });

        client.activate();
        clientRef.current = client;
      } catch (err) {
        console.warn('WebSocket init failed (package missing?):', err.message);
      }
    })();

    return () => {
      destroyed = true;
      clientRef.current?.deactivate();
      clientRef.current = null;
      setConnected(false);
    };
  }, [topic, enabled]);

  return { connected };
}
