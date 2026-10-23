import React, { useEffect, useRef, useCallback } from 'react';
import { ChatMessage, Product } from '../../types';
import { ChatMessageItem } from './ChatMessageItem';
import { Loader2 } from 'lucide-react';

interface ChatMessagesListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSelectProduct: (p: Product) => void;
  onOpenLeadModal: () => void;
  onSendMessage?: (text: string) => void;
}

export const ChatMessagesList: React.FC<ChatMessagesListProps> = ({
  messages,
  isLoading,
  onSelectProduct,
  onOpenLeadModal,
  onSendMessage
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (!containerRef.current) return;
    const target = containerRef.current.scrollHeight;
    containerRef.current.scrollTo({
      top: target,
      behavior
    });
  }, []);

  // Auto-scroll robusto estilo WhatsApp al cambiar mensajes, carga o prompts
  useEffect(() => {
    scrollToBottom('smooth');
    const t1 = setTimeout(() => scrollToBottom('smooth'), 60);
    const t2 = setTimeout(() => scrollToBottom('smooth'), 180);
    const t3 = setTimeout(() => scrollToBottom('auto'), 320);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [messages, isLoading, scrollToBottom]);

  // Listener para evento custom disparado al elegir preguntas rápidas
  useEffect(() => {
    const handleScrollEvent = () => {
      scrollToBottom('smooth');
      setTimeout(() => scrollToBottom('smooth'), 100);
      setTimeout(() => scrollToBottom('auto'), 250);
    };

    window.addEventListener('clikchat:scroll-bottom', handleScrollEvent);
    return () => window.removeEventListener('clikchat:scroll-bottom', handleScrollEvent);
  }, [scrollToBottom]);

  // MutationObserver para detectar expansión de burbujas dinámicas o imágenes
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new MutationObserver(() => {
      // Si el usuario está cerca del final, mantenerlo en el fondo
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 300;
      if (isNearBottom) {
        scrollToBottom('smooth');
      }
    });

    observer.observe(el, { childList: true, subtree: true, attributes: false });
    return () => observer.disconnect();
  }, [scrollToBottom]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-3 sm:px-4 pt-3.5 pb-8 space-y-3 min-h-0 overscroll-contain select-text"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {messages.map((msg) => (
        <ChatMessageItem
          key={msg.id}
          msg={msg}
          onSelectProduct={onSelectProduct}
          onOpenLeadModal={onOpenLeadModal}
          onSendMessage={onSendMessage}
        />
      ))}

      {isLoading && (
        <div className="flex items-center space-x-2 text-slate-400 text-xs py-1.5 px-1 animate-fade-in">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400 shrink-0" />
          <span className="text-[11px] font-medium text-slate-300">Consultando catálogo y verificando respuesta...</span>
        </div>
      )}

      <div ref={messagesEndRef} className="h-3 shrink-0" />
    </div>
  );
};
