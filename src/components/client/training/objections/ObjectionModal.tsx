import React, { useState, useEffect } from 'react';
import { FAQ } from '../../../../types';
import { X, ShieldCheck, Zap } from 'lucide-react';

interface ObjectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: string, answer: string, category: string, id?: string) => Promise<boolean>;
  editingFaq?: FAQ | null;
  defaultCategory?: string;
}

export const ObjectionModal: React.FC<ObjectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingFaq,
  defaultCategory = 'Objeciones'
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingFaq) {
      setQuestion(editingFaq.question || '');
      setAnswer(editingFaq.answer || '');
      setCategory(editingFaq.category || defaultCategory);
    } else {
      setQuestion('');
      setAnswer('');
      setCategory(defaultCategory);
    }
  }, [editingFaq, isOpen, defaultCategory]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    setLoading(true);
    const success = await onSave(question.trim(), answer.trim(), category.trim(), editingFaq?.id);
    setLoading(false);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden flex flex-col">
        {/* Header - Limpio, sin bordes toscos */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#f8fafc]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0a1730]">
                {editingFaq ? 'Editar Regla de Objeción' : 'Nueva Regla de Objeción (Nivel 2)'}
              </h3>
              <p className="text-[11px] text-[#62728d]">
                Respuesta exacta con $0 costo de IA y menos de 50ms de latencia.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8391aa] hover:bg-[#e8edf6] hover:text-[#0a1730] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0a1730] mb-1.5">
              ¿Qué pregunta u objeción tiene el cliente? *
            </label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ej: ¿Cómo agendo una cita o reservación?"
              className="w-full bg-[#f8fafc] rounded-xl px-3.5 py-2.5 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:bg-white shadow-2xs transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0a1730] mb-1.5">
              Respuesta exacta del bot (Regla de Oro) *
            </label>
            <textarea
              required
              rows={3}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Ej: Puedes agendar tu cita directamente aquí con el bot indicando tu fecha y hora preferida..."
              className="w-full bg-[#f8fafc] rounded-xl p-3.5 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:bg-white resize-none shadow-2xs transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0a1730] mb-1.5">
              Categoría
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ej: Citas & Reservaciones, Pagos, Políticas"
              className="w-full bg-[#f8fafc] rounded-xl px-3.5 py-2 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:bg-white shadow-2xs transition"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#62728d] hover:text-[#0a1730] hover:bg-[#f1f5f9] transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{loading ? 'Guardando...' : 'Guardar Regla de Oro'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
