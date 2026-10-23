import React, { useState, useRef } from 'react';
import { X, BookOpen, Save, Plus, CheckCircle2 } from 'lucide-react';
import { FaqCategorySelector } from './FaqCategorySelector';

interface FaqSingleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: string, answer: string, category: string) => Promise<boolean>;
  existingCategories?: string[];
}

export const FaqSingleModal: React.FC<FaqSingleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingCategories
}) => {
  if (!isOpen) return null;

  const [question, setQuestion] = useState(''), [answer, setAnswer] = useState(''), [category, setCategory] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false), [hasSaved, setHasSaved] = useState(false), [saveCount, setSaveCount] = useState(0);
  const [slideState, setSlideState] = useState<'idle' | 'slide-out' | 'slide-in-prep'>('idle');
  const questionInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const ok = await onSubmit(question.trim(), answer.trim(), category.trim());
      setIsSubmitting(false);
      if (ok !== false) {
        setHasSaved(true);
        setSaveCount((p) => p + 1);
      }
    } catch (err) {
      console.error('Error saving FAQ:', err);
      setIsSubmitting(false);
    }
  };

  const handleAddAnother = () => {
    setSlideState('slide-out');
    setTimeout(() => {
      setQuestion(''); setAnswer(''); setHasSaved(false); setSlideState('slide-in-prep');
      setTimeout(() => { setSlideState('idle'); questionInputRef.current?.focus(); }, 40);
    }, 220);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="bg-[#161515] border border-[#282626] w-full max-w-lg rounded-xl shadow-2xl p-4 sm:p-5 space-y-3.5 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#282626]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Agregar Pregunta Frecuente</span>
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-[#222020] transition-colors cursor-pointer" aria-label="Cerrar">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className={`space-y-3 transition-all ${
            slideState === 'slide-out' ? 'opacity-0 -translate-x-12 scale-[0.98] duration-200 ease-in'
              : slideState === 'slide-in-prep' ? 'opacity-0 translate-x-12 scale-[0.98] duration-0'
              : 'opacity-100 translate-x-0 scale-100 duration-250 ease-out'
          }`}>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 mb-1">Pregunta del Cliente *</label>
              <input
                ref={questionInputRef} type="text" required value={question}
                onChange={e => { setQuestion(e.target.value); if (hasSaved) setHasSaved(false); }}
                placeholder="Ej: ¿Cuáles son las formas de pago aceptadas?"
                className="w-full bg-[#121111] border border-[#282626] rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 mb-1">Respuesta Oficial del Negocio (RAG Nivel 2) *</label>
              <textarea
                required rows={3} value={answer}
                onChange={e => { setAnswer(e.target.value); if (hasSaved) setHasSaved(false); }}
                placeholder="Ej: Aceptamos Sinpe Móvil al 8888-8888, tarjetas de crédito y transferencias bancarias directas."
                className="w-full bg-[#121111] border border-[#282626] rounded-lg p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 leading-relaxed resize-none"
              />
            </div>

            <FaqCategorySelector value={category} onChange={setCategory} existingCategories={existingCategories} />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#282626]">
            <div>
              {hasSaved && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 animate-fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Guardada en memoria</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button" onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg bg-[#222020] hover:bg-[#2c2929] border border-[#333030] text-xs font-semibold text-zinc-300 transition cursor-pointer"
              >
                {saveCount > 0 ? 'Listo / Cerrar' : 'Cancelar'}
              </button>

              {!hasSaved ? (
                <button
                  type="submit" disabled={isSubmitting || !question.trim() || !answer.trim()}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition disabled:opacity-50 flex items-center gap-1.5 shadow cursor-pointer active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Guardando...' : 'Guardar en memoria'}</span>
                </button>
              ) : (
                <button
                  type="button" onClick={handleAddAnother}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition flex items-center gap-1.5 shadow cursor-pointer active:scale-95 animate-fade-in"
                >
                  <Plus className="w-3.5 h-3.5" />
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
