import React, { useEffect, useRef } from 'react';
import { ChatMessage, Product } from '../../types';
import { ChatMessageItem } from './ChatMessageItem';
import { Loader2 } from 'lucide-react';

interface ChatMessagesListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSelectProduct: (p: Product) => void;
  onOpenLeadModal: () => void;
}

export const ChatMessagesList: React.FC<ChatMessagesListProps> = ({
  messages,
  isLoading,
  onSelectProduct,
  onOpenLeadModal
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 min-h-0">
      {messages.map((msg) => (
        <ChatMessageItem
          key={msg.id}
          msg={msg}
          onSelectProduct={onSelectProduct}
          onOpenLeadModal={onOpenLeadModal}
        />
      ))}

      {isLoading && (
        <div className="flex items-center space-x-2 text-slate-400 text-xs py-1">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          <span>Consultando catálogo y verificando información...</span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
