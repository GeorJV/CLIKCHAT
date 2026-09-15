import React, { useState } from 'react';
import { ChevronDown, Pencil, Check, X, Trash2, FileText, Bot, Sparkles, Loader2 } from 'lucide-react';
import { FAQ } from '../../../types';

interface FaqAccordionItemProps {
  faq: FAQ;
  defaultOpen?: boolean;
  onDelete: (id: string) => void;
  onUpdateAnswer?: (id: string, newAnswer: string) => Promise<boolean>;
}

export const FaqAccordionItem: React.FC<FaqAccordionItemProps> = ({
  faq,
  defaultOpen = false,
  onDelete,
  onUpdateAnswer
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAnswer, setEditedAnswer] = useState(faq.answer);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isFile = faq.source?.startsWith('archivo');
  const isHitl = faq.source === 'hitl_audit';

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editedAnswer.trim() || !onUpdateAnswer) return;
    setIsSaving(true);
    try {
      const ok = await onUpdateAnswer(faq.id, editedAnswer.trim());
      if (ok) {
        setIsEditing(false);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`onyx-card rounded-xl border transition-all duration-200 overflow-hidden ${
      isOpen ? 'border-emerald-500/30 bg-[#161515]' : 'border-[#282626] bg-[#141313] hover:border-[#383535]'
    }`}>
      {/* Encabezado del Acordeón */}
      <div onClick={() => setIsOpen(p => !p)} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
          <h5 className="font-bold text-xs sm:text-sm text-white leading-snug truncate">{faq.question}</h5>
        </div>

        <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded font-mono text-[10px] bg-white/[0.04] border border-white/[0.07] text-zinc-400">
            {faq.category || 'general'}
          </span>
          {isFile ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
              <FileText className="w-2.5 h-2.5" /> <span className="hidden md:inline">Archivo</span>
            </span>
          ) : isHitl ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Bot className="w-2.5 h-2.5" /> <span className="hidden md:inline">Auto HITL</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" /> <span className="hidden md:inline">Manual</span>
            </span>
          )}
          <button onClick={() => { if (window.confirm('¿Deseas eliminar esta FAQ?')) onDelete(faq.id); }} className="text-zinc-500 hover:text-rose-400 p-1 transition cursor-pointer" title="Eliminar FAQ">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cuerpo del Acordeón: Respuesta & Edición */}
      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-white/[0.06] space-y-3">
          {isEditing ? (
            <div className="space-y-2.5 pt-2">
              <label className="text-[11px] font-bold text-emerald-400 block">Editar Respuesta del Bot:</label>
              <textarea
                value={editedAnswer}
                onChange={e => setEditedAnswer(e.target.value)}
                rows={3}
                className="w-full bg-[#100f0f] border border-[#383535] focus:border-emerald-500 rounded-xl p-3 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition leading-relaxed resize-y"
                placeholder="Escribe la respuesta que dará el bot..."
                autoFocus
              />
              <div className="flex items-center justify-end gap-2">
                <button type="button" onClick={() => { setEditedAnswer(faq.answer); setIsEditing(false); }} disabled={isSaving} className="px-3 py-1.5 rounded-lg border border-[#2e2b2b] text-zinc-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer">
                  <X className="w-3 h-3" /> Cancelar
                </button>
                <button type="button" onClick={handleSave} disabled={isSaving || !editedAnswer.trim()} className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition cursor-pointer disabled:opacity-50">
                  {isSaving ? <><Loader2 className="w-3 h-3 animate-spin" /> Guardando...</> : <><Check className="w-3.5 h-3.5" /> Guardar</>}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="bg-[#100f0f] border border-[#232121] rounded-xl p-3 sm:p-3.5 text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                {faq.answer}
              </div>
              <div className="flex items-center justify-between pt-1">
                {savedSuccess ? (
                  <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                    <Check className="w-3.5 h-3.5" /> ¡Respuesta actualizada y guardada!
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-500 font-mono">Categoría: {faq.category || 'general'}</span>
                )}
                {onUpdateAnswer && (
                  <button type="button" onClick={() => { setEditedAnswer(faq.answer); setIsEditing(true); }} className="px-2.5 py-1 rounded-lg bg-[#1f1e1e] hover:bg-[#2a2828] border border-[#333131] hover:border-zinc-500 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer">
                    <Pencil className="w-3 h-3 text-emerald-400" /> Editar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
