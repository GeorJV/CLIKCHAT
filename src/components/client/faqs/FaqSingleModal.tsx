import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface FaqSingleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: string, answer: string, category: string) => Promise<boolean>;
}

export const FaqSingleModal: React.FC<FaqSingleModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  if (!isOpen) return null;

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const ok = await onSubmit(question.trim(), answer.trim(), category.trim());
    setIsSubmitting(false);
    if (ok) {
      setQuestion('');
      setAnswer('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#09151c] border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Agregar Pregunta Frecuente (Manual)</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Pregunta del Cliente
            </label>
            <input
              type="text"
              required
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Ej: ¿Cuáles son las formas de pago aceptadas?"
              className="w-full bg-[#050e14] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Respuesta Oficial del Negocio (RAG Nivel 2)
            </label>
            <textarea
              required
              rows={3}
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Ej: Aceptamos Sinpe Móvil al 8888-8888, tarjetas de crédito y transferencias bancarias directas."
              className="w-full bg-[#050e14] border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Categoría
            </label>
            <input
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="Ej: pagos, envios, horarios, general"
              className="w-full bg-[#050e14] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !question.trim() || !answer.trim()}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando en D1...' : 'Guardar Pregunta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
