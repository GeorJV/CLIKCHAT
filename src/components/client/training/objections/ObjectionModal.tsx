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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#161515] border border-[#2d2a2a] w-full max-w-lg rounded-2xl p-5 shadow-2xl relative text-zinc-100">
        <div className="flex items-center justify-between border-b border-[#282626] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {editingFaq ? 'Editar Regla de Objeción' : 'Nueva Regla de Objeción (Nivel 2)'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                Respuesta exacta con $0 costo de IA y menos de 50ms de latencia.
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              ¿Qué pregunta u objeción tiene el cliente? *
            </label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ej: ¿Hacen envíos hoy? o ¿Aceptan Sinpe Móvil?"
              className="w-full bg-[#111010] border border-[#2e2b2b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Respuesta exacta del bot (Regla de Oro) *
            </label>
            <textarea
              required
              rows={3}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Ej: Sí, si ordenas antes de las 3:00 PM enviamos hoy mismo por mensajería privada..."
              className="w-full bg-[#111010] border border-[#2e2b2b] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Categoría
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ej: Pagos, Envíos, Citas, Políticas"
              className="w-full bg-[#111010] border border-[#2e2b2b] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#262424]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 transition disabled:opacity-50"
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
