import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { ChatMicButton } from './audio/ChatMicButton';

interface ChatInputBarProps {
  onSendMessage: (text: string) => void;
  onInputFocus?: () => void;
  isLoading: boolean;
  placeholder?: string;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  onInputFocus,
  isLoading,
  placeholder = 'Escribe tu mensaje o consulta comercial...'
}) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!inputValue && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [inputValue]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-3 py-1.5 bg-slate-900 border-t border-slate-800 flex items-end space-x-2">
      <textarea
        ref={textareaRef}
        rows={1}
        value={inputValue}
        onChange={handleTextChange}
        onFocus={onInputFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        className="flex-1 text-xs px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-60 resize-none leading-snug min-h-[24px] max-h-[100px] overflow-y-auto"
      />

      {inputValue.trim() ? (
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition active:scale-95 shadow-md shadow-indigo-600/30 shrink-0 mb-0.5"
          aria-label="Enviar mensaje"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      ) : (
        <ChatMicButton
          disabled={isLoading}
          onTranscription={(text) => onSendMessage(text)}
        />
      )}
    </div>
  );
};
