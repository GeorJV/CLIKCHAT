import React from 'react';
import { BookOpen, Plus, UploadCloud, Zap } from 'lucide-react';

interface FaqsHeaderProps {
  totalFaqs: number;
  onOpenSingleModal: () => void;
  onOpenFileModal: () => void;
}

export const FaqsHeader: React.FC<FaqsHeaderProps> = ({
  totalFaqs,
  onOpenSingleModal,
  onOpenFileModal
}) => {
  return (
    <div className="onyx-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
      <div>
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Preguntas Frecuentes (FAQ / RAG Nivel 2)</span>
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {totalFaqs} {totalFaqs === 1 ? 'FAQ' : 'FAQs'}
          </span>
        </div>

        <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
          Respuestas oficiales indexadas en Cloudflare D1 con Early Stopping (&ge; 0.65). Respuestas instantáneas a costo $0 sin tocar el LLM.
        </p>

        <div className="flex items-center gap-2 mt-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="w-3 h-3" /> Early Stopping &ge; 0.65
          </span>
          <span className="text-[10px] text-slate-500">
            Admite subida pregunta por pregunta o extracción masiva desde archivos.
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenFileModal}
          className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>📁 Cargar Archivo (TXT, DOCX, PDF)</span>
        </button>

        <button
          type="button"
          onClick={onOpenSingleModal}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nueva FAQ</span>
        </button>
      </div>
    </div>
  );
};
