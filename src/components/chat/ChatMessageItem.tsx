import React from 'react';
import { ChatMessage, Product } from '../../types';
import { Sparkles, HelpCircle } from 'lucide-react';
import { ChatAudioPlayerBubble } from './audio/ChatAudioPlayerBubble';

interface ChatMessageItemProps {
  msg: ChatMessage;
  onSelectProduct: (p: Product) => void;
  onOpenLeadModal: () => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  msg,
  onSelectProduct,
  onOpenLeadModal
}) => {
  const isUser = msg.sender === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`w-fit rounded-2xl leading-relaxed transition-all shadow-sm ${msg.isAudio ? 'px-2 py-0.5' : 'max-w-[86%] sm:max-w-[78%] p-3 text-xs'} ${
          isUser
            ? 'bg-[#D79F4C]/50 backdrop-blur-md text-white rounded-2xl border border-[#D79F4C]/30'
            : 'bg-slate-800 text-slate-100 rounded-2xl border border-slate-700/70 shadow-lg shadow-black/60'
        }`}
      >
        {/* RAG Level Indicator Badge */}
        {!isUser && msg.levelLabel && (
          <div className="flex items-center space-x-1 mb-1.5 pb-1 border-b border-slate-700/50">
            <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
            <span className="text-[10px] font-bold text-indigo-300 truncate">
              {msg.levelLabel}
            </span>
            {msg.stoppedEarly && (
              <span className="ml-auto text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                Verificado
              </span>
            )}
          </div>
        )}

        {/* Audio Message or Text Message */}
        {msg.isAudio ? (
          <ChatAudioPlayerBubble
            audioUrl={msg.audioUrl}
            duration={msg.audioDuration}
            timestamp={new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            isUser={isUser}
          />
        ) : (
          <p className="whitespace-pre-line select-text font-normal">{msg.message}</p>
        )}

        {/* Product Recommendations from RAG L3 */}
        {!isUser && msg.products && msg.products.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-slate-700/70 space-y-2">
            {msg.products.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="flex items-center space-x-2.5 p-1.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-indigo-500/50 cursor-pointer transition"
              >
                <img
                  src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                  alt={p.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-white truncate">{p.name}</p>
                  <p className="text-[10px] text-indigo-400 font-semibold">${p.price} {p.currency}</p>
                </div>
                <span className="text-[10px] text-indigo-300 bg-indigo-500/20 px-2 py-1 rounded-md font-bold">
                  Ver HD
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Fallback button if query was unresolved */}
        {!isUser && msg.isFallback && (
          <button
            onClick={onOpenLeadModal}
            className="mt-2.5 w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-[11px] font-bold transition flex items-center justify-center space-x-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>Activar Notificación Push & Contacto</span>
          </button>
        )}
      </div>

      {/* Timestamp */}
      {!msg.isAudio && (
        <span className="text-[10px] text-slate-500 mt-1 px-1">
          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  );
};
