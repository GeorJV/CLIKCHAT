import { useRef, useCallback } from 'react';
import { ProductChatMessage } from '../types/productChat';

interface UseMessageBatcherOptions {
  debounceMs?: number;
  deliveryDelayMs?: number;
  onDeliverUserMessage: (msg: ProductChatMessage) => void;
  onTriggerBotReply: (batchedTexts: string[]) => void | Promise<void>;
  onSetLoading?: (loading: boolean) => void;
}

export function useMessageBatcher({
  debounceMs = 800,
  deliveryDelayMs = 0,
  onDeliverUserMessage,
  onTriggerBotReply,
  onSetLoading,
}: UseMessageBatcherOptions) {
  const pendingBatchRef = useRef<string[]>([]);
  const botDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    pendingBatchRef.current.push(trimmed);

    if (botDebounceTimerRef.current) {
      clearTimeout(botDebounceTimerRef.current);
      botDebounceTimerRef.current = null;
    }

    const userMsg: ProductChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sessionId: 'sess',
      tenantId: 'tenant',
      sender: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (deliveryDelayMs > 0) {
      setTimeout(() => onDeliverUserMessage(userMsg), deliveryDelayMs);
    } else {
      onDeliverUserMessage(userMsg);
    }

    // Mostrar feedback de carga/escritura inmediatamente al usuario
    onSetLoading?.(true);

    botDebounceTimerRef.current = setTimeout(async () => {
      const batchToProcess = [...pendingBatchRef.current];
      pendingBatchRef.current = [];

      if (batchToProcess.length > 0) {
        try {
          await onTriggerBotReply(batchToProcess);
        } finally {
          onSetLoading?.(false);
        }
      } else {
        onSetLoading?.(false);
      }
    }, Math.max(debounceMs, 300));
  }, [debounceMs, deliveryDelayMs, onDeliverUserMessage, onTriggerBotReply, onSetLoading]);

  // Procesa consulta de voz en el bot sin agregar mensaje de texto duplicado del usuario
  const sendVoiceQuery = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    onSetLoading?.(true);
    try {
      await onTriggerBotReply([trimmed]);
    } finally {
      onSetLoading?.(false);
    }
  }, [onTriggerBotReply, onSetLoading]);

  const clearBatch = useCallback(() => {
    if (botDebounceTimerRef.current) {
      clearTimeout(botDebounceTimerRef.current);
      botDebounceTimerRef.current = null;
    }
    pendingBatchRef.current = [];
  }, []);

  return { sendMessage, sendVoiceQuery, clearBatch };
}
