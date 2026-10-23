import React, { useState } from 'react';
import { FAQ, UnresolvedQuery } from '../../../types';
import { BookOpen, HelpCircle, Plus, Search, Trash2, Edit2, ShieldCheck } from 'lucide-react';
import { VoceroFaqModal } from './VoceroFaqModal';
import { VoceroUnresolvedQueriesList } from './VoceroUnresolvedQueriesList';

interface VoceroFaqRagViewProps {
  faqs: FAQ[];
  unresolved: UnresolvedQuery[];
  onCreateFaq: (question: string, answer: string, category?: string) => Promise<boolean>;
  onUpdateFaq?: (id: string, newAnswer: string) => Promise<boolean>;
  onDeleteFaq: (id: string) => Promise<boolean>;
  onResolveQuery: (queryId: string, answer: string, category?: string) => Promise<boolean>;
}

export const VoceroFaqRagView: React.FC<VoceroFaqRagViewProps> = ({
  faqs,
  unresolved,
  onCreateFaq,
  onUpdateFaq,
  onDeleteFaq,
  onResolveQuery,
}) => {
  const [subTab, setSubTab] = useState<'faqs' | 'unresolved'>('faqs');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  const pendingCount = unresolved.filter(u => u.status === 'pending').length;
  const filteredFaqs = faqs.filter(f =>
    f.question.toLowerCase().includes(search.toLowerCase()) ||
    f.answer.toLowerCase().includes(search.toLowerCase()) ||
    (f.category && f.category.toLowerCase().includes(search.toLowerCase()))
  );

  const handleOpenCreate = () => { setEditingFaq(null); setIsModalOpen(true); };
  const handleOpenEdit = (f: FAQ) => { setEditingFaq(f); setIsModalOpen(true); };
  const handleSaveModal = async (q: string, a: string, cat: string, id?: string) => {
    return id && onUpdateFaq ? await onUpdateFaq(id, a) : await onCreateFaq(q, a, cat);
  };

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] font-sans overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-4 sm:px-6 shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="h-4 w-4 text-[#0d5bff] shrink-0" />
          <h2 className="text-base sm:text-[17px] font-bold tracking-tight text-[#0a1730] truncate">
            FAQ IQ — Memoria RAG & Aprendizaje
          </h2>
          <span className="vocero-kicker ml-1 hidden sm:inline">Aprendizaje Supervisado</span>
        </div>

        <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setSubTab('faqs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              subTab === 'faqs' ? 'bg-white text-[#0d5bff] shadow-xs' : 'text-[#62728d] hover:text-[#0a1730]'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Preguntas Frecuentes</span>
            <span className="ml-1 rounded-full bg-[#e8edf6] px-1.5 py-0.2 text-[10px] text-[#42506b] font-bold">{faqs.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('unresolved')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              subTab === 'unresolved' ? 'bg-white text-[#0d5bff] shadow-xs' : 'text-[#62728d] hover:text-[#0a1730]'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Consultas Pendientes (HITL)</span>
            <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${pendingCount > 0 ? 'bg-rose-500 text-white' : 'bg-[#e8edf6] text-[#42506b]'}`}>
              {pendingCount}
            </span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl w-full mx-auto space-y-4">
        {subTab === 'unresolved' ? (
          <VoceroUnresolvedQueriesList unresolved={unresolved} onResolve={onResolveQuery} />
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#e2e8f0] shadow-xs">
              <div className="relative flex-1 max-w-md">
                <Search className="h-3.5 w-3.5 text-[#8391aa] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar en la memoria RAG..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#d8e2f0] bg-[#f8fafc] text-xs text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleOpenCreate}
                className="flex items-center gap-1.5 rounded-xl bg-[#0d5bff] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0047e1] transition cursor-pointer shrink-0 shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Nueva Pregunta Frecuente (RAG)</span>
              </button>
            </div>

            {filteredFaqs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#d8e2f0] bg-white p-12 text-center">
                <HelpCircle className="h-8 w-8 text-[#8391aa] mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-[#0a1730]">No hay preguntas frecuentes registradas</p>
                <p className="text-[11px] text-[#8391aa] max-w-sm mx-auto mt-1 mb-3">
                  Agrega preguntas y respuestas oficiales para que la IA responda al instante en milisegundos con costo $0 de tokens.
                </p>
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0d5bff] px-4 py-2 text-xs font-bold text-white hover:bg-[#0047e1] cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Agregar Primera FAQ</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs flex flex-col justify-between hover:border-[#b8cced] transition">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0d5bff] border border-blue-100 uppercase">
                          {faq.category || 'general'}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(faq)}
                            className="p-1 text-[#8391aa] hover:text-[#0d5bff] rounded-md transition"
                            title="Editar FAQ"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteFaq(faq.id)}
                            className="p-1 text-[#8391aa] hover:text-rose-600 rounded-md transition"
                            title="Eliminar FAQ"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-xs font-bold text-[#0a1730] mb-1">"{faq.question}"</h4>
                      <p className="text-xs text-[#62728d] leading-relaxed line-clamp-3">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <VoceroFaqModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        faq={editingFaq}
        onSave={handleSaveModal}
      />
    </div>
  );
};
