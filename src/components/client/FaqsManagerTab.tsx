import React, { useState } from 'react';
import { FAQ } from '../../types';
import { HelpCircle, Plus, Trash2, Sparkles, CheckCircle } from 'lucide-react';

interface FaqsManagerTabProps {
  faqs: FAQ[];
  onCreateFaq: (question: string, answer: string, category?: string) => Promise<boolean>;
  onDeleteFaq: (id: string) => Promise<boolean>;
}

export const FaqsManagerTab: React.FC<FaqsManagerTabProps> = ({ faqs, onCreateFaq, onDeleteFaq }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const ok = await onCreateFaq(question, answer, category);
    if (ok) {
      setQuestion('');
      setAnswer('');
      setShowAddForm(false);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span>Banco de Preguntas Frecuentes (RAG Nivel 2)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Respuestas oficiales con Early Stopping (&ge; 0.65). Si el cliente pregunta esto, el bot responde de inmediato sin alucinar.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Cerrar Formulario' : 'Nueva FAQ'}</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Agregar Pregunta Frecuente Oficial
          </h4>
          <div>
            <label className="block text-xs text-slate-300 mb-1 font-medium">Pregunta del Cliente</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ej: ¿Cuáles son las formas de pago?"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1 font-medium">Respuesta Oficial del Negocio</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Ej: Aceptamos transferencias, tarjetas de crédito y efectivo..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 min-h-[60px]"
            />
          </div>
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Categoría (ej. pagos, envios)"
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white w-44"
            />
            <button
              type="submit"
              disabled={!question.trim() || !answer.trim() || isSubmitting}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando en D1...' : 'Guardar FAQ'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-white">{faq.question}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {faq.category || 'general'}
                </span>
                {faq.source === 'hitl_audit' ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Auto-Aprendida HITL
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Manual
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
            </div>
            <button
              onClick={() => onDeleteFaq(faq.id)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0"
              title="Eliminar FAQ"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
