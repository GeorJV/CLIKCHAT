import React, { useState } from 'react';
import { UnresolvedQuery } from '../../types';
import { MessageSquare, Send, Sparkles, CheckCircle2, User, Phone, Clock } from 'lucide-react';

interface UnresolvedQueriesTabProps {
  unresolved: UnresolvedQuery[];
  onResolve: (queryId: string, answer: string, category?: string) => Promise<boolean>;
}

export const UnresolvedQueriesTab: React.FC<UnresolvedQueriesTabProps> = ({ unresolved, onResolve }) => {
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [category, setCategory] = useState('consultas_resueltas');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendResponse = async (queryId: string) => {
    if (!answerText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const ok = await onResolve(queryId, answerText, category);
    if (ok) { setResolvingId(null); setAnswerText(''); }
    setIsSubmitting(false);
  };

  const pending = unresolved.filter(u => u.status === 'pending');
  const resolved = unresolved.filter(u => u.status === 'resolved');

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span>Consultas Pendientes (Human-in-the-Loop)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Preguntas de clientes no catalogadas. Al responderlas, el bot se auto-entrena al instante.</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
          {pending.length} por atender
        </span>
      </div>

      {pending.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
          <h4 className="text-sm font-bold text-white">¡Bandeja al día!</h4>
          <p className="text-xs text-slate-400 mt-1">No tienes consultas pendientes. Tu bot está respondiendo con las FAQs y catálogo.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((q) => (
            <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{new Date(q.created_at).toLocaleString()}</span>
                  {q.user_lead_info?.name && <span className="font-semibold text-slate-300 ml-2"><User className="w-3 h-3 inline" /> {q.user_lead_info.name}</span>}
                  {q.user_lead_info?.phone && <span className="text-slate-300 ml-2"><Phone className="w-3 h-3 inline" /> {q.user_lead_info.phone}</span>}
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">Pendiente</span>
              </div>
              <div className="mt-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                <p className="text-xs text-slate-400 font-semibold mb-1">Pregunta del Cliente:</p>
                <p className="text-sm text-white font-medium">"{q.user_question}"</p>
              </div>
              {resolvingId === q.id ? (
                <div className="mt-4 space-y-3 bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-300 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Tu Respuesta Oficial:</span>
                    <button onClick={() => setResolvingId(null)} className="text-slate-400 hover:text-white">Cancelar</button>
                  </div>
                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Escribe la respuesta que aprenderá el bot..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 min-h-[65px]"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Categoría"
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white w-36"
                    />
                    <button
                      onClick={() => handleSendResponse(q.id)}
                      disabled={!answerText.trim() || isSubmitting}
                      className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Guardando...' : 'Enviar y Auto-Entrenar'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => { setResolvingId(q.id); setAnswerText(''); }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Responder esta Duda</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {resolved.length > 0 && (
        <div className="pt-4 border-t border-slate-800/80">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Historial de Consultas Resueltas</h4>
          <div className="space-y-2">
            {resolved.slice(0, 4).map(r => (
              <div key={r.id} className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3 text-xs flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-200">"{r.user_question}"</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Resp: {r.human_answer || r.resolution_answer}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 whitespace-nowrap ml-2">? Bot Auto-Entrenado</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
