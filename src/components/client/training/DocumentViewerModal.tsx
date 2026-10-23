import React, { useState, useEffect } from 'react';
import { X, Layers, FileText, Copy, Check, Search, Calendar, Tag } from 'lucide-react';
import { DocumentDetail } from '../../../types/client';
import { useVoceroMode } from '../../../hooks/useVoceroMode';

interface DocumentViewerModalProps {
  documentId: string;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ documentId, onClose }) => {
  const { isVoceroMode } = useVoceroMode();
  const [doc, setDoc] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'chunks' | 'full'>('chunks');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch(`/api/documents/${documentId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.document) setDoc(data.document);
      })
      .catch((err) => console.error('Error al cargar documento:', err))
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [documentId]);

  const handleCopy = () => {
    if (!doc?.raw_content) return;
    navigator.clipboard.writeText(doc.raw_content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredChunks = (doc?.chunks || []).filter((c) =>
    searchTerm ? c.content.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs font-sans">
      <div className={`rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden ${
        isVoceroMode ? 'bg-white' : 'bg-[#181717] border border-[#282626] text-white'
      }`}>
        {/* Header */}
        <div className={`p-5 flex items-center justify-between gap-3 ${isVoceroMode ? 'bg-[#f8fafc]' : 'bg-[#141313] border-b border-[#242222]'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
              isVoceroMode ? 'bg-blue-50 text-[#0d5bff]' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className={`text-sm sm:text-base font-bold truncate ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>{doc?.title || 'Cargando documento...'}</h3>
              <div className={`flex items-center gap-2 mt-0.5 text-[11px] ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'}`}>
                <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {doc?.category || 'manuales'}</span>
                <span>•</span>
                <span className={`flex items-center gap-1 font-semibold ${isVoceroMode ? 'text-[#0d5bff]' : 'text-emerald-400'}`}><Layers className="w-3 h-3" /> {doc?.chunks?.length || doc?.chunks_count || 0} Chunks D1</span>
                {doc?.created_at && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(doc.created_at).toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl transition cursor-pointer ${
              isVoceroMode ? 'text-[#8391aa] hover:bg-[#e8edf6] hover:text-[#0a1730]' : 'text-zinc-400 hover:bg-[#222020] hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: View Switcher & Search */}
        <div className={`px-5 py-3 flex flex-wrap items-center justify-between gap-2.5 ${isVoceroMode ? 'bg-[#f1f5f9]' : 'bg-[#121111] border-b border-[#242222]'}`}>
          <div className={`flex items-center p-1 rounded-xl shadow-2xs ${isVoceroMode ? 'bg-white' : 'bg-[#181717] border border-[#262424]'}`}>
            <button
              onClick={() => setViewMode('chunks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'chunks'
                  ? (isVoceroMode ? 'bg-[#0d5bff] text-white shadow-xs' : 'bg-emerald-600 text-white shadow-xs')
                  : (isVoceroMode ? 'text-[#62728d] hover:text-[#0a1730]' : 'text-zinc-400 hover:text-white')
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Chunks RAG ({doc?.chunks?.length || 0})</span>
            </button>
            <button
              onClick={() => setViewMode('full')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'full'
                  ? (isVoceroMode ? 'bg-[#0d5bff] text-white shadow-xs' : 'bg-emerald-600 text-white shadow-xs')
                  : (isVoceroMode ? 'text-[#62728d] hover:text-[#0a1730]' : 'text-zinc-400 hover:text-white')
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Texto Completo</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {viewMode === 'chunks' && (
              <div className="relative">
                <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${isVoceroMode ? 'text-[#8391aa]' : 'text-zinc-500'}`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar en chunks..."
                  className={`rounded-xl pl-9 pr-3 py-1.5 text-xs w-36 sm:w-48 shadow-2xs focus:outline-none ${
                    isVoceroMode ? 'bg-white text-[#0a1730] placeholder-[#8391aa] focus:ring-2 focus:ring-[#0d5bff]/20' : 'bg-[#181717] text-white placeholder-zinc-500 border border-[#2a2828] focus:border-emerald-500'
                  }`}
                />
              </div>
            )}
            {viewMode === 'full' && (
              <button
                onClick={handleCopy}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-2xs ${
                  isVoceroMode ? 'bg-white hover:bg-[#f8fafc] text-[#0a1730]' : 'bg-[#222020] hover:bg-[#282626] text-white border border-[#333131]'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className={`flex-1 overflow-y-auto p-5 space-y-3 min-h-0 ${isVoceroMode ? 'bg-[#f8fafc]' : 'bg-[#121111]'}`}>
          {loading ? (
            <div className={`py-12 flex flex-col items-center justify-center gap-2 ${isVoceroMode ? 'text-[#8391aa]' : 'text-zinc-500'}`}>
              <div className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin ${isVoceroMode ? 'border-[#0d5bff]' : 'border-emerald-500'}`} />
              <span className="text-xs">Extrayendo chunks de Cloudflare D1...</span>
            </div>
          ) : viewMode === 'chunks' ? (
            filteredChunks.length === 0 ? (
              <p className={`text-center py-8 text-xs ${isVoceroMode ? 'text-[#8391aa]' : 'text-zinc-500'}`}>No se encontraron chunks con ese término.</p>
            ) : (
              filteredChunks.map((chunk, idx) => (
                <div key={chunk.id || idx} className={`rounded-2xl p-4 shadow-xs transition ${
                  isVoceroMode ? 'bg-white hover:shadow' : 'bg-[#181717] border border-[#262424] hover:border-[#383535]'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isVoceroMode ? 'bg-blue-50 text-[#0d5bff]' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      Chunk #{chunk.chunk_index !== undefined ? chunk.chunk_index + 1 : idx + 1}
                    </span>
                    <span className={`text-[10px] ${isVoceroMode ? 'text-[#8391aa]' : 'text-zinc-500'}`}>{chunk.content.length} caracteres</span>
                  </div>
                  <p className={`text-xs leading-relaxed whitespace-pre-wrap select-text font-normal ${isVoceroMode ? 'text-[#334155]' : 'text-zinc-200'}`}>{chunk.content}</p>
                </div>
              ))
            )
          ) : (
            <div className={`rounded-2xl p-5 shadow-xs ${isVoceroMode ? 'bg-white' : 'bg-[#181717] border border-[#262424]'}`}>
              <p className={`text-xs leading-relaxed whitespace-pre-wrap select-text font-mono ${isVoceroMode ? 'text-[#334155]' : 'text-zinc-200'}`}>
                {doc?.raw_content || 'No hay contenido disponible para este documento.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
