import React, { useState } from 'react';
import { UnresolvedQuery } from '../../../types';
import { MessageSquare, Send, BookOpen, CheckCircle2, User, Phone, Clock, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

interface VoceroUnresolvedQueriesListProps {
  unresolved: UnresolvedQuery[];
  onResolve: (queryId: string, answer: string, category?: string, question?: string) => Promise<boolean>;
}

export const VoceroUnresolvedQueriesList: React.FC<VoceroUnresolvedQueriesListProps> = ({
  unresolved,
  onResolve,
}) => {
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [questionTitle, setQuestionTitle] = useState('');
  const [category, setCategory] = useState('consultas_resueltas');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openContextId, setOpenContextId] = useState<string | null>(null);

  const pending = unresolved.filter(u => u.status === 'pending');

  const handleStartResolve = (q: UnresolvedQuery) => {
    setResolvingId(q.id);
    setAnswerText('');
    setQuestionTitle(q.user_question || '');
  };

  const handleSendResponse = async (queryId: string) => {
    if (!answerText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const ok = await onResolve(queryId, answerText.trim(), category.trim(), questionTitle.trim());
    if (ok) {
      setResolvingId(null);
      setAnswerText('');
      setQuestionTitle('');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4 font-sans">
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-white to-blue-50/40 border border-blue-200 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0d5bff] text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0a1730]">
              Garantía de Marca: Respuestas Transparentes & Auto-Entrenamiento RAG
            </h4>
            <p className="text-[11.5px] text-[#62728d] mt-0.5 leading-relaxed">
              Tu marca nunca queda comprometida con datos falsos. Cuando un cliente formula una pregunta que no está en el catálogo, la IA responde con cortesía sin inventar y la registra aquí con el contexto de la conversación. Al responderla, se guarda en FAQs oficiales y el bot aprende automáticamente.
            </p>
          </div>
        </div>
      </div>

      {pending.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white border border-[#e2e8f0] text-center shadow-xs">
          <CheckCircle2 className="h-9 w-9 text-emerald-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-[#0a1730]">¡Bandeja de Consultas al Día!</h4>
          <p className="text-xs text-[#62728d] mt-1">
            No hay consultas pendientes. El bot está respondiendo con el catálogo y las preguntas frecuentes oficiales.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((q) => {
            const hasChatContext = Array.isArray(q.user_lead_info?.chat_context) && q.user_lead_info.chat_context.length > 0;
            const isContextOpen = openContextId === q.id || resolvingId === q.id;

            return (
              <div key={q.id} className="p-4.5 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#62728d]">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#8391aa]" />
                    <span>{new Date(q.created_at).toLocaleString()}</span>
                    {q.user_lead_info?.name && <span className="font-semibold text-[#0a1730] ml-2"><User className="h-3 w-3 inline" /> {q.user_lead_info.name}</span>}
                    {q.user_lead_info?.phone && <span className="text-[#0a1730] ml-2"><Phone className="h-3 w-3 inline" /> {q.user_lead_info.phone}</span>}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Pendiente de Respuesta
                  </span>
                </div>

                <div className="mt-2.5 bg-[#f8fafc] p-3 rounded-xl border border-[#e8edf6]">
                  <p className="text-[11px] font-bold text-[#62728d] mb-0.5">Pregunta o tema consultado por el cliente:</p>
                  <p className="text-xs font-semibold text-[#0a1730]">"{q.user_question}"</p>
                </div>

                {hasChatContext && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => setOpenContextId(isContextOpen ? null : q.id)}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#0d5bff] hover:underline cursor-pointer"
                    >
                      <MessageSquare className="h-3 w-3" />
                      <span>{isContextOpen ? 'Ocultar conversación previa' : 'Ver qué venían hablando en el chat'}</span>
                      {isContextOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>

                    {isContextOpen && (
                      <div className="mt-1.5 p-2.5 rounded-xl bg-blue-50/40 border border-blue-100 text-xs space-y-1.5">
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#62728d]">Historial reciente del chat:</p>
                        <div className="space-y-1">
                          {q.user_lead_info.chat_context!.map((msg, idx) => (
                            <div key={idx} className="text-[11.5px] leading-relaxed">
                              <span className={`font-bold mr-1.5 ${msg.sender === 'Cliente' ? 'text-blue-700' : 'text-slate-600'}`}>
                                {msg.sender}:
                              </span>
                              <span className="text-[#0a1730]">{msg.text || msg.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {resolvingId === q.id ? (
                  <div className="mt-3 p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0a1730] flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-[#0d5bff]" /> Responder y Auto-Entrenar Bot:
                      </span>
                      <button type="button" onClick={() => setResolvingId(null)} className="text-xs text-[#62728d] hover:text-[#0a1730]">
                        Cancelar
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#62728d] mb-1">
                        Pregunta o FAQ que aprenderá el bot (puedes ajustarla):
                      </label>
                      <input
                        type="text"
                        value={questionTitle}
                        onChange={(e) => setQuestionTitle(e.target.value)}
                        placeholder="Ej: ¿Ofrecen planes de financiamiento o pago en cuotas para desarrollo web?"
                        className="w-full rounded-xl border border-[#d8e2f0] bg-white p-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#62728d] mb-1">
                        Respuesta oficial que dará el bot a partir de ahora:
                      </label>
                      <textarea
                        rows={3}
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        placeholder="Escribe la respuesta oficial con la que la IA responderá a todos los clientes futuros..."
                        className="w-full rounded-xl border border-[#d8e2f0] bg-white p-2.5 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Categoría"
                        className="rounded-lg border border-[#d8e2f0] bg-white px-2.5 py-1 text-xs text-[#0a1730] w-36"
                      />
                      <button
                        type="button"
                        disabled={!answerText.trim() || isSubmitting}
                        onClick={() => handleSendResponse(q.id)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs disabled:opacity-50 cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>{isSubmitting ? 'Guardando...' : 'Guardar en FAQs & Auto-Entrenar'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleStartResolve(q)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0d5bff] hover:bg-[#0047e1] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Responder y Auto-Entrenar Bot</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
