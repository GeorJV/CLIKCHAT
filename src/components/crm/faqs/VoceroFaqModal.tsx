import React, { useState, useEffect, useRef } from 'react';
import { FAQ } from '../../../types';
import { X, BookOpen, Save, Plus, CheckCircle2 } from 'lucide-react';
import { useVoceroMode } from '../../../hooks/useVoceroMode';

interface VoceroFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  faq: FAQ | null;
  onSave: (question: string, answer: string, category: string, id?: string) => Promise<boolean>;
}

export const VoceroFaqModal: React.FC<VoceroFaqModalProps> = ({ isOpen, onClose, faq, onSave }) => {
  const { isVoceroMode } = useVoceroMode();
  const [question, setQuestion] = useState(''), [answer, setAnswer] = useState(''), [category, setCategory] = useState('general');
  const [isSaving, setIsSaving] = useState(false), [hasSaved, setHasSaved] = useState(false), [saveCount, setSaveCount] = useState(0);
  const [slideState, setSlideState] = useState<'idle' | 'slide-out' | 'slide-in-prep'>('idle');
  const questionInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuestion(faq?.question || '');
    setAnswer(faq?.answer || '');
    setCategory(faq?.category || 'general');
    setHasSaved(false); setSaveCount(0); setSlideState('idle');
  }, [faq, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim() || isSaving) return;
    setIsSaving(true);
    const ok = await onSave(question.trim(), answer.trim(), category.trim(), faq?.id);
    setIsSaving(false);
    if (ok) faq ? onClose() : (setHasSaved(true), setSaveCount((p) => p + 1));
  };

  const handleAddAnother = () => {
    setSlideState('slide-out');
    setTimeout(() => {
      setQuestion(''); setAnswer(''); setHasSaved(false); setSlideState('slide-in-prep');
      setTimeout(() => { setSlideState('idle'); questionInputRef.current?.focus(); }, 40);
    }, 220);
  };

  const inputCls = isVoceroMode
    ? 'w-full rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3.5 py-2 text-xs text-[#0a1730] placeholder-[#8391aa] focus:border-[#0d5bff] focus:bg-white focus:outline-none transition'
    : 'w-full rounded-xl border border-[#2c2a2a] bg-[#121111] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-emerald-500 focus:bg-[#151414] focus:outline-none transition';

  const labelCls = isVoceroMode ? 'text-[#0a1730]' : 'text-zinc-300';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 font-sans">
      <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl overflow-hidden transition-colors ${
        isVoceroMode ? 'bg-white border border-[#e2e8f0]' : 'bg-[#181717] border border-[#282626] text-white'
      }`}>
        <div className={`flex items-center justify-between pb-3 mb-4 border-b ${isVoceroMode ? 'border-[#f1f5f9]' : 'border-[#262424]'}`}>
          <div className="flex items-center gap-2">
            <BookOpen className={`h-4 w-4 ${isVoceroMode ? 'text-[#0d5bff]' : 'text-emerald-400'}`} />
            <h3 className={`text-sm font-bold ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>
              {faq ? 'Editar Pregunta Frecuente (RAG)' : 'Nueva Pregunta Frecuente (RAG)'}
            </h3>
          </div>
          <button type="button" onClick={onClose} className={`rounded-lg p-1 transition cursor-pointer ${
            isVoceroMode ? 'text-[#8391aa] hover:bg-[#f1f5f9] hover:text-[#0a1730]' : 'text-zinc-400 hover:bg-[#242222] hover:text-white'
          }`}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={`space-y-4 transition-all ${
            slideState === 'slide-out' ? 'opacity-0 -translate-x-12 scale-[0.98] duration-200 ease-in'
              : slideState === 'slide-in-prep' ? 'opacity-0 translate-x-12 scale-[0.98] duration-0'
              : 'opacity-100 translate-x-0 scale-100 duration-250 ease-out'
          }`}>
            <div>
              <label className={`block text-xs font-bold uppercase mb-1 ${labelCls}`}>Pregunta del Cliente</label>
              <input
                ref={questionInputRef} type="text" value={question}
                onChange={(e) => { setQuestion(e.target.value); if (hasSaved) setHasSaved(false); }}
                placeholder="Ej: ¿Cuáles son las formas de pago aceptadas?" className={inputCls} required
              />
            </div>
            <div>
              <label className={`block text-xs font-bold uppercase mb-1 ${labelCls}`}>Respuesta Oficial del Negocio (RAG)</label>
              <textarea
                rows={4} value={answer}
                onChange={(e) => { setAnswer(e.target.value); if (hasSaved) setHasSaved(false); }}
                placeholder="Ej: Aceptamos transferencias SINPE Móvil, tarjetas Visa/Mastercard y efectivo al momento de la entrega."
                className={`${inputCls} resize-none leading-relaxed`} required
              />
            </div>
            <div>
              <label className={`block text-xs font-bold uppercase mb-1 ${labelCls}`}>Categoría</label>
              <input
                type="text" value={category} onChange={(e) => setCategory(e.target.value)}
                placeholder="pagos, envios, horarios, garantia" className={inputCls}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between pt-3 border-t ${isVoceroMode ? 'border-[#f1f5f9]' : 'border-[#262424]'}`}>
            <div>
              {hasSaved && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Guardada en memoria</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button" onClick={onClose}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isVoceroMode ? 'border border-[#d8e2f0] text-[#42506b] hover:bg-[#f8fafc]' : 'border border-[#2c2a2a] text-zinc-300 hover:bg-[#222020]'
                }`}
              >
                {saveCount > 0 ? 'Listo / Cerrar' : 'Cancelar'}
              </button>

              {!hasSaved ? (
                <button
                  type="submit" disabled={isSaving || !question.trim() || !answer.trim()}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs disabled:opacity-50 transition cursor-pointer active:scale-95 ${
                    isVoceroMode ? 'bg-[#0d5bff] hover:bg-[#0047e1]' : 'bg-emerald-600 hover:bg-emerald-500'
                  }`}
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{isSaving ? 'Guardando...' : 'Guardar en memoria'}</span>
                </button>
              ) : (
                <button
                  type="button" onClick={handleAddAnother}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition cursor-pointer active:scale-95 animate-fade-in"
                >
                  <Plus className="h-4 w-4" />
                  <span>Agregar otra pregunta</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
