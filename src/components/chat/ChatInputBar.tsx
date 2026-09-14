import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';

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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={onInputFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-60"
      />

      <button
        onClick={handleSend}
        disabled={!inputValue.trim() || isLoading}
        className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition active:scale-95 shadow-md shadow-indigo-600/30"
        aria-label="Enviar mensaje"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
};
