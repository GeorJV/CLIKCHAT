import React, { useState, useMemo } from 'react';
import { FAQ } from '../../../types';
import { Globe, Filter, Trash2, HelpCircle, FileText, Bot, Sparkles } from 'lucide-react';

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
    <div className="space-y-4">
      {/* Raycast / Linear Command Bar */}
      <div className="flex items-center gap-3 p-2.5 sm:px-4 bg-[#191817] border border-[#2E2B2B] rounded-2xl shadow-xl focus-within:border-zinc-600 transition">
        <Globe className="w-4 h-4 text-zinc-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por pregunta, respuesta o tema..."
          className="bg-transparent flex-1 text-xs text-white placeholder:text-zinc-500 focus:outline-none"
        />
        <div className="flex items-center gap-2 shrink-0">
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="keycap text-[10px] px-1.5 py-0.5 rounded text-zinc-400 hover:text-white"
            >
              Esc
            </button>
          )}
          <span className="w-px h-4 bg-[#2E2B2B]" />
          <Filter className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-200 cursor-pointer" />
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
              activeCategory === cat
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-black'
                : 'bg-[#181717] text-zinc-400 hover:text-white border border-[#282626]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Header (Like in reference mockup) */}
      <div className="flex items-center justify-between px-1 pt-1">
        <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Resultados FAQ</h4>
        <span className="text-[11px] font-medium text-zinc-500">{filteredFaqs.length} total de preguntas</span>
      </div>

      {/* 2-Column Grid of Sleek Onyx Cards */}
      {filteredFaqs.length === 0 ? (
        <div className="p-8 text-center onyx-card rounded-2xl space-y-2">
          <HelpCircle className="w-8 h-8 text-zinc-600 mx-auto" />
          <p className="text-xs font-bold text-zinc-300">No se encontraron preguntas frecuentes</p>
          <p className="text-[11px] text-zinc-500">Agrega una pregunta manual o sube un archivo .txt, .docx o .pdf arriba.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredFaqs.map(faq => {
            const isFile = faq.source?.startsWith('archivo');
            const isHitl = faq.source === 'hitl_audit';

            return (
              <div
                key={faq.id}
                className="onyx-card rounded-xl p-3.5 sm:p-4 flex flex-col justify-between gap-3 transition group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-bold text-xs text-white leading-snug group-hover:text-emerald-300 transition line-clamp-2">
                      {faq.question}
                    </h5>
                    <button
                      onClick={() => {
                        if (window.confirm('¿Deseas eliminar esta pregunta frecuente?')) onDeleteFaq(faq.id);
                      }}
                      className="text-zinc-600 hover:text-rose-400 p-1 transition shrink-0 cursor-pointer"
                      title="Eliminar FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-[10px]">
                  <span className="px-2 py-0.5 rounded font-mono font-medium bg-white/[0.04] border border-white/[0.07] text-zinc-400">
                    {faq.category || 'general'}
                  </span>

                  {isFile ? (
                    <span className="px-2 py-0.5 rounded font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5" /> Archivo
                    </span>
                  ) : isHitl ? (
                    <span className="px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <Bot className="w-2.5 h-2.5" /> Auto HITL
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Manual
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
