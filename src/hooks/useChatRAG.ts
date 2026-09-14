import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, Product } from '../types';
import { UseChatRAGOptions, RAGResponsePayload } from '../types/chat';

export function useChatRAG({
  tenant,
  tenantSlug,
  onSelectProduct,
  onTriggerFallback
}: UseChatRAGOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => 'sess_' + Math.random().toString(36).substring(2, 9));

  // Initialize welcome message once tenant is loaded
  useEffect(() => {
    if (tenant && messages.length === 0) {
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'assistant',
          message: tenant.welcome_message || '¡Hola! Bienvenido a nuestra tienda.',
          levelLabel: 'Saludo Oficial',
          created_at: new Date().toISOString()
        }
      ]);
    }
  }, [tenant, messages.length]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      message: trimmed,
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSlug: tenant?.slug || tenantSlug,
          tenantId: tenant?.id,
          sessionId,
          message: trimmed
        })
      });

      if (!response.ok) throw new Error('Error en el servicio de chat');

      const data: RAGResponsePayload = await response.json();

      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        sender: 'assistant',
        message: data.answer || 'He recibido tu mensaje.',
        rag_level_used: data.level,
        levelLabel: data.levelLabel,
        confidence: data.confidence,
        stoppedEarly: data.stoppedEarly,
        products: data.products,
        isFallback: data.isFallback,
        created_at: new Date().toISOString()
      };

      setMessages((prev) => [...prev, botMsg]);

      // If Level 3 returned products, update showcase
      if (data.products && data.products.length > 0 && onSelectProduct) {
        onSelectProduct(data.products[0]);
      }

      // If Fallback HITL was triggered, notify UI
      if ((data.isFallback || data.requiresLeadInfo) && onTriggerFallback) {
        setTimeout(() => onTriggerFallback(), 500);
      }
    } catch (err) {
      console.error('Error enviando mensaje RAG:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          sender: 'assistant',
          message: 'Hubo un inconveniente momentáneo de conexión. Por favor reintenta.',
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, tenant, tenantSlug, sessionId, onSelectProduct, onTriggerFallback]);

  const resetChat = useCallback(() => {
    setSessionId('sess_' + Math.random().toString(36).substring(2, 9));
    if (tenant) {
      setMessages([
        {
          id: 'welcome-' + Date.now(),
          sender: 'assistant',
          message: tenant.welcome_message || '¡Hola! ¿En qué puedo asesorarte hoy?',
          levelLabel: 'Saludo Oficial',
          created_at: new Date().toISOString()
        }
      ]);
    }
  }, [tenant]);

  return {
    messages,
    isLoading,
    sessionId,
    sendMessage,
    resetChat
  };
}
