import React, { useState, useMemo } from 'react';
import { User, Bot, ChevronDown, Edit3, Check, X, Clock } from 'lucide-react';
import { ChatMessage } from './conversationsDemo';

interface ConversationAccordionProps {
  messages: ChatMessage[];
  onUpdateAnswer?: (messageId: string, newAnswer: string) => void;
}

interface MessageExchange {
  id: string;
  userMessage?: ChatMessage;
  assistantMessage?: ChatMessage;
}

export const ConversationAccordion: React.FC<ConversationAccordionProps> = ({ messages, onUpdateAnswer }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [savedId, setSavedId] = useState<string | null>(null);

  const exchanges = useMemo(() => {
    const list: MessageExchange[] = [];
    let curr: MessageExchange | null = null;
    for (const m of messages) {
      if (m.sender === 'user') {
        if (curr) list.push(curr);
        curr = { id: `exch-${m.id}`, userMessage: m };
      } else {
        if (curr && !curr.assistantMessage) curr.assistantMessage = m;
        else {
          if (curr) list.push(curr);
          curr = { id: `exch-${m.id}`, assistantMessage: m };
        }
      }
    }
    if (curr) list.push(curr);
    return list;
  }, [messages]);

  const handleSave = (msgId: string) => {
    if (!editText.trim()) return;
    onUpdateAnswer?.(msgId, editText.trim());
    setSavedId(msgId);
    setTimeout(() => setSavedId(null), 2500);
    setEditingId(null);
  };

  return (
    <div className="space-y-2.5">
      {exchanges.map(ex => {
        const isOpen = expanded[ex.id] !== false;
        const ans = ex.assistantMessage;
        const q = ex.userMessage;
        const isEditing = ans && editingId === ans.id;

        return (
          <div key={ex.id} className="rounded-xl border border-[#282626] overflow-hidden bg-[#141313] transition">
            <div
              onClick={() => setExpanded(prev => ({ ...prev, [ex.id]: prev[ex.id] === undefined ? false : !prev[ex.id] }))}
              className="p-3 bg-[#181717] hover:bg-[#1f1e1e] flex items-center justify-between gap-3 cursor-pointer select-none transition"
            >
              <div className="flex items-center gap-2.5 truncate min-w-0">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <User className="w-3 h-3" />
                </div>
                <span className="text-xs font-semibold text-zinc-200 truncate">{q ? q.text : 'Mensaje del cliente'}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 text-zinc-500 text-[10px]">
                {q?.time && <span className="flex items-center gap-1 font-mono"><Clock className="w-2.5 h-2.5" />{q.time}</span>}
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {isOpen && (
              <div className="p-3.5 bg-[#121111] border-t border-[#262424] space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                    <Bot className="w-3.5 h-3.5" />
                    <span>Respuesta del Bot</span>
                  </div>
                  {ans && !isEditing && (
                    <div className="flex items-center gap-2">
                      {savedId === ans.id && (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                          <Check className="w-3 h-3" /> Guardado y actualizado
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => { setEditingId(ans.id); setEditText(ans.text); }}
                        className="px-2.5 py-1 rounded-lg bg-[#1f1e1e] hover:bg-[#282727] border border-[#2e2b2b] text-emerald-400 hover:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                        title="Editar respuesta"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Editar</span>
                      </button>
                    </div>
                  )}
                </div>

                {ans ? (
                  isEditing ? (
                    <div className="space-y-2 pt-1">
                      <textarea
                        autoFocus rows={3} value={editText} onChange={e => setEditText(e.target.value)}
                        className="w-full bg-[#0d0d0d] border border-emerald-500 rounded-lg p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none leading-relaxed resize-none"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg bg-[#1f1e1e] hover:bg-[#282727] text-zinc-400 hover:text-white text-xs font-semibold flex items-center gap-1 cursor-pointer">
                          <X className="w-3 h-3" /> Cancelar
                        </button>
                        <button type="button" onClick={() => handleSave(ans.id)} disabled={!editText.trim()} className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow cursor-pointer disabled:opacity-50">
                          <Check className="w-3 h-3" /> Guardar y Actualizar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap bg-[#161515] border border-[#242222] p-2.5 rounded-lg">{ans.text}</p>
                  )
                ) : (
                  <p className="text-xs text-zinc-500 italic py-1">En espera de respuesta del bot...</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
