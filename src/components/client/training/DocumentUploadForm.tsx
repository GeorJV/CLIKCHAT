import React from 'react';
import { FileText } from 'lucide-react';
import { useVoceroMode } from '../../../hooks/useVoceroMode';

interface DocumentUploadFormProps {
  title: string;
  setTitle: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({
  title, setTitle, category, setCategory, content, setContent, isSubmitting, onSubmit
}) => {
  const { isVoceroMode } = useVoceroMode();
  const inputCls = isVoceroMode
    ? 'w-full bg-[#f8fafc] rounded-xl px-3.5 py-2 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:bg-white shadow-2xs transition'
    : 'w-full bg-[#121111] border border-[#2c2a2a] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:bg-[#151414] shadow-2xs transition';

  return (
    <form onSubmit={onSubmit} className={`rounded-2xl p-5 space-y-3.5 ${
      isVoceroMode ? 'bg-white shadow-md' : 'bg-[#181717] border border-[#282626] shadow-xl'
    }`}>
      <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>
        <FileText className={`w-3.5 h-3.5 ${isVoceroMode ? 'text-[#0d5bff]' : 'text-emerald-400'}`} /> Ingestar Documento en Cloudflare D1
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={`block text-xs mb-1 font-bold ${isVoceroMode ? 'text-[#0a1730]' : 'text-zinc-300'}`}>Título del Documento</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Manual de Garantía Oficial 2026" className={inputCls} />
        </div>
        <div>
          <label className={`block text-xs mb-1 font-bold ${isVoceroMode ? 'text-[#0a1730]' : 'text-zinc-300'}`}>Categoría</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ej: garantias, politicas, guias" className={inputCls} />
        </div>
      </div>
      <div>
        <label className={`block text-xs mb-1 font-bold ${isVoceroMode ? 'text-[#0a1730]' : 'text-zinc-300'}`}>Texto Completo del Documento / Manual</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Pega aquí el texto completo del manual, términos o especificaciones..."
          className={`w-full rounded-xl p-3 text-xs min-h-[100px] shadow-2xs transition ${
            isVoceroMode
              ? 'bg-[#f8fafc] text-[#0a1730] placeholder-[#8391aa] focus:ring-2 focus:ring-[#0d5bff]/20 focus:bg-white'
              : 'bg-[#121111] border border-[#2c2a2a] text-white placeholder-zinc-500 focus:border-emerald-500 focus:bg-[#151414]'
          }`}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!title.trim() || !content.trim() || isSubmitting}
          className={`px-5 py-2 rounded-xl text-white font-bold text-xs transition shadow-sm disabled:opacity-50 cursor-pointer ${
            isVoceroMode ? 'bg-[#0d5bff] hover:bg-[#0047e1]' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/40'
          }`}
        >
          {isSubmitting ? 'Particionando en Chunks...' : 'Ingestar y Vectorizar Documento'}
        </button>
      </div>
    </form>
  );
};