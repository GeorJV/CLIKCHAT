import React, { useState, useMemo } from 'react';
import { FAQ } from '../../../types';
import { Search, Trash2, HelpCircle, FileText, Bot, Sparkles } from 'lucide-react';

interface FaqListProps {
  faqs: FAQ[];
  onDeleteFaq: (id: string) => Promise<boolean>;
}

export const FaqList: React.FC<FaqListProps> = ({ faqs, onDeleteFaq }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('todas');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    faqs.forEach(f => {
      if (f.category) cats.add(f.category.toLowerCase());
    });
    return ['todas', ...Array.from(cats)];
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter(f => {
      const matchCat = activeCategory === 'todas' || (f.category || 'general').toLowerCase() === activeCategory;
      const q = search.toLowerCase();
      const matchText = !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
      return matchCat && matchText;
    });
  }, [faqs, search, activeCategory]);

  return (
    <div className="space-y-3.5">
      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por pregunta o palabra clave..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
                activeCategory === cat
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs Cards List */}
      {filteredFaqs.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-2">
          <HelpCircle className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-xs font-bold text-slate-300">No se encontraron preguntas frecuentes</p>
          <p className="text-[11px] text-slate-500">Agrega una pregunta manual o sube un archivo .txt, .docx o .pdf arriba.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredFaqs.map(faq => {
            const isFile = faq.source?.startsWith('archivo');
            const isHitl = faq.source === 'hitl_audit';

            return (
              <div
                key={faq.id}
                className="bg-[#08151c] border border-slate-800/90 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-4 transition shadow-sm"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-white">{faq.question}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {faq.category || 'general'}
                    </span>

                    {isFile ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Archivo
                      </span>
                    ) : isHitl ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <Bot className="w-3 h-3" /> Auto-Aprendida HITL
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Manual
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm('¿Deseas eliminar esta pregunta frecuente?')) onDeleteFaq(faq.id);
                  }}
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0 cursor-pointer"
                  title="Eliminar FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
