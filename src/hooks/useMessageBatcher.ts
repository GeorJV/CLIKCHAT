import { useRef, useCallback } from 'react';
import { ProductChatMessage } from '../types/productChat';

interface UseMessageBatcherOptions {
  debounceMs?: number;
  deliveryDelayMs?: number;
  onDeliverUserMessage: (msg: ProductChatMessage) => void;
  onTriggerBotReply: (batchedTexts: string[]) => void;
  onSetLoading: (loading: boolean) => void;
}

export function useMessageBatcher({
  debounceMs = 7000,
  deliveryDelayMs = 350,
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

    // Deliver user message to UI synchronized with paper plane landing
    setTimeout(() => {
      const userMsg: ProductChatMessage = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sessionId: 'sess',
        tenantId: 'tenant',
        sender: 'user',
        content: trimmed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onDeliverUserMessage(userMsg);
    }, deliveryDelayMs);

    // Courtesy debounce window allowing user to send follow-up messages
    botDebounceTimerRef.current = setTimeout(() => {
      const batchToProcess = [...pendingBatchRef.current];
      pendingBatchRef.current = [];

      if (batchToProcess.length > 0) {
        onSetLoading(true);
        setTimeout(() => {
          onTriggerBotReply(batchToProcess);
          onSetLoading(false);
        }, 700);
      }
    }, debounceMs);
  }, [debounceMs, deliveryDelayMs, onDeliverUserMessage, onTriggerBotReply, onSetLoading]);

  const clearBatch = useCallback(() => {
    if (botDebounceTimerRef.current) {
      clearTimeout(botDebounceTimerRef.current);
      botDebounceTimerRef.current = null;
    }
    pendingBatchRef.current = [];
  }, []);

  return { sendMessage, clearBatch };
}
