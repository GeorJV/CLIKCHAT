import React, { useState, useEffect } from 'react';
import { FAQ } from '../../../types';
import { X, Sparkles, Save } from 'lucide-react';

interface VoceroFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  faq: FAQ | null;
  onSave: (question: string, answer: string, category: string, id?: string) => Promise<boolean>;
}

export const VoceroFaqModal: React.FC<VoceroFaqModalProps> = ({
  isOpen,
  onClose,
  faq,
  onSave,
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (faq) {
      setQuestion(faq.question);
      setAnswer(faq.answer);
      setCategory(faq.category || 'general');
    } else {
      setQuestion('');
      setAnswer('');
      setCategory('general');
    }
  }, [faq, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim() || isSaving) return;
    setIsSaving(true);
    const ok = await onSave(question.trim(), answer.trim(), category.trim(), faq?.id);
    setIsSaving(false);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 font-sans">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#e2e8f0]">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#0d5bff]" />
            <h3 className="text-sm font-bold text-[#0a1730]">
              {faq ? 'Editar Pregunta Frecuente (RAG)' : 'Nueva Pregunta Frecuente (RAG)'}
            </h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-[#8391aa] hover:bg-[#f1f5f9] hover:text-[#0a1730]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0a1730] uppercase mb-1">Pregunta del Cliente</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ej: ¿Cuáles son las formas de pago aceptadas?"
              className="w-full rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3.5 py-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0a1730] uppercase mb-1">Respuesta Oficial del Negocio (RAG)</label>
            <textarea
              rows={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Ej: Aceptamos transferencias SINPE Móvil, tarjetas Visa/Mastercard y efectivo al momento de la entrega."
              className="w-full rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3.5 py-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0a1730] uppercase mb-1">Categoría</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="pagos, envios, horarios, garantia"
              className="w-full rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3.5 py-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#d8e2f0] text-xs font-bold text-[#42506b] hover:bg-[#f8fafc]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving || !question.trim() || !answer.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0d5bff] hover:bg-[#0047e1] text-xs font-bold text-white shadow-xs disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isSaving ? 'Guardando...' : 'Guardar en Memoria RAG'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
