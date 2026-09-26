import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage } from '../types';
import { UseChatRAGOptions, RAGResponsePayload } from '../types/chat';
import { adaptTemporalText } from '../utils/temporalGreeting';

export function useChatRAG({ tenant, tenantSlug, onSelectProduct, onTriggerFallback }: UseChatRAGOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const storageKey = `clik_sess_${tenantSlug || 'geosoft'}`;
  const [sessionId, setSessionId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) return saved;
      const created = 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
      sessionStorage.setItem(storageKey, created);
      return created;
    }
    return 'sess_' + Date.now().toString(36);
  });

  const pendingBatchRef = useRef<string[]>([]);
  const botDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Carga el historial previo desde Cloudflare D1 si la sesión ya existía
  useEffect(() => {
    let isMounted = true;
    async function loadSessionHistory() {
      try {
        const res = await fetch(`/api/chat/messages/${encodeURIComponent(sessionId)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.messages && data.messages.length > 0) {
            setMessages(data.messages);
            return;
          }
        }
      } catch (e) {}

      if (isMounted && tenant && messages.length === 0) {
        setMessages([{
          id: 'welcome-msg', sender: 'assistant',
          message: adaptTemporalText(tenant.welcome_message || '¡Hola! Bienvenido a nuestra tienda.'),
          levelLabel: 'Saludo Oficial', created_at: new Date().toISOString()
        }]);
      }
    }

    loadSessionHistory();
    return () => { isMounted = false; };
  }, [sessionId, tenant]);

  const processBatchReply = useCallback(async (batch: string[]) => {
    const batchedText = batch.join('\n').trim();
    if (!batchedText) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSlug: tenant?.slug || tenantSlug,
          tenantId: tenant?.id,
          sessionId,
          message: batchedText,
          clientHour: new Date().getHours(),
          clientTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
        })
      });
      if (!response.ok) throw new Error('Error en el servicio de chat');
      const data: RAGResponsePayload = await response.json();
      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(), sender: 'assistant',
        message: data.answer || 'He recibido tu mensaje.',
        rag_level_used: data.level, levelLabel: data.levelLabel,
        confidence: data.confidence, stoppedEarly: data.stoppedEarly,
        products: data.products, isFallback: data.isFallback,
        created_at: new Date().toISOString()
      };
      setMessages((prev) => [...prev, botMsg]);
      if (data.products && data.products.length > 0 && onSelectProduct) onSelectProduct(data.products[0]);
      if ((data.isFallback || data.requiresLeadInfo) && onTriggerFallback) setTimeout(() => onTriggerFallback(), 500);
    } catch (err) {
      console.error('Error enviando mensaje RAG:', err);
      setMessages((prev) => [...prev, {
        id: 'err_' + Date.now(), sender: 'assistant',
        message: 'Hubo un inconveniente momentáneo de conexión. Por favor reintenta.',
        created_at: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [tenant, tenantSlug, sessionId, onSelectProduct, onTriggerFallback]);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    pendingBatchRef.current.push(trimmed);
    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
      sender: 'user', message: trimmed, created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    if (botDebounceTimerRef.current) clearTimeout(botDebounceTimerRef.current);
    const delaySec = tenant?.response_delay_sec !== undefined && tenant?.response_delay_sec !== null
      ? Number(tenant.response_delay_sec)
      : 1;
    const debounceMs = Math.max(delaySec * 1000, 400);
    botDebounceTimerRef.current = setTimeout(() => {
      const batchToProcess = [...pendingBatchRef.current];
      pendingBatchRef.current = [];
      if (batchToProcess.length > 0) processBatchReply(batchToProcess);
    }, debounceMs);
  }, [tenant, processBatchReply]);

  const resetChat = useCallback(() => {
    if (botDebounceTimerRef.current) clearTimeout(botDebounceTimerRef.current);
    pendingBatchRef.current = [];
    const newSessionId = 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
    if (typeof window !== 'undefined') sessionStorage.setItem(storageKey, newSessionId);
    setSessionId(newSessionId);
    if (tenant) {
      setMessages([{
        id: 'welcome-' + Date.now(), sender: 'assistant',
        message: tenant.welcome_message || '¡Hola! ¿En qué puedo asesorarte hoy?',
        levelLabel: 'Saludo Oficial', created_at: new Date().toISOString()
      }]);
    }
  }, [storageKey, tenant]);

  return { messages, isLoading, sessionId, sendMessage, resetChat };
}
