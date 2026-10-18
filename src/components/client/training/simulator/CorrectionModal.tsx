import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Zap } from 'lucide-react';

interface CorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userQuestion: string;
  originalAnswer: string;
  onSaveCorrection: (question: string, newAnswer: string) => Promise<boolean>;
}

export const CorrectionModal: React.FC<CorrectionModalProps> = ({
  isOpen,
  onClose,
  userQuestion,
  originalAnswer,
  onSaveCorrection
}) => {
  const [question, setQuestion] = useState(userQuestion);
  const [newAnswer, setNewAnswer] = useState(originalAnswer);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuestion(userQuestion);
    setNewAnswer(originalAnswer);
  }, [userQuestion, originalAnswer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;
    setLoading(true);
    const success = await onSaveCorrection(question.trim() || userQuestion, newAnswer.trim());
    setLoading(false);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#181717] border border-[#2e2b2b] w-full max-w-lg rounded-2xl p-5 shadow-2xl text-zinc-100 relative">
        <div className="flex items-center justify-between border-b border-[#282626] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Corregir Respuesta del Bot (1-Clic)</h3>
              <p className="text-[11px] text-zinc-400">
                Se guardará como Regla de Oro Nivel 2 ($0 costo, &lt;50ms) para futuros clientes.
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
              Pregunta detectada del cliente:
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full bg-[#111010] border border-[#2e2b2b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              ¿Qué debió responder exactamente el bot? (Tu corrección) *
            </label>
            <textarea
              required
              rows={4}
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Escribe la respuesta exacta que quieres que el bot aprenda..."
              className="w-full bg-[#111010] border border-[#2e2b2b] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
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
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{loading ? 'Guardando regla...' : 'Guardar y Corregir Bot'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
