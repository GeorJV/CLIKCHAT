import React, { useState, useEffect } from 'react';
import { X, Layers, FileText, Copy, Check, Search, Calendar, Tag } from 'lucide-react';
import { DocumentDetail } from '../../../types/client';

interface DocumentViewerModalProps {
  documentId: string;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ documentId, onClose }) => {
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
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header - Limpio y sin bordes */}
        <div className="p-5 flex items-center justify-between gap-3 bg-[#f8fafc]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0d5bff] shrink-0 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-[#0a1730] truncate">{doc?.title || 'Cargando documento...'}</h3>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#62728d]">
                <span className="flex items-center gap-1"><Tag className="w-3 h-3 text-[#8391aa]" /> {doc?.category || 'manuales'}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#0d5bff] font-semibold"><Layers className="w-3 h-3" /> {doc?.chunks?.length || doc?.chunks_count || 0} Chunks D1</span>
                {doc?.created_at && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[#8391aa]"><Calendar className="w-3 h-3" /> {new Date(doc.created_at).toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8391aa] hover:bg-[#e8edf6] hover:text-[#0a1730] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: View Switcher & Search - Limpio */}
        <div className="px-5 py-3 bg-[#f1f5f9] flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center bg-white p-1 rounded-xl shadow-2xs">
            <button
              onClick={() => setViewMode('chunks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'chunks' ? 'bg-[#0d5bff] text-white shadow-xs' : 'text-[#62728d] hover:text-[#0a1730]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Chunks RAG ({doc?.chunks?.length || 0})</span>
            </button>
            <button
              onClick={() => setViewMode('full')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'full' ? 'bg-[#0d5bff] text-white shadow-xs' : 'text-[#62728d] hover:text-[#0a1730]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Texto Completo</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {viewMode === 'chunks' && (
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#8391aa] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar en chunks..."
                  className="bg-white rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 w-36 sm:w-48 shadow-2xs"
                />
              </div>
            )}
            {viewMode === 'full' && (
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#f8fafc] text-xs font-bold text-[#0a1730] transition cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#8391aa]" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 min-h-0 bg-[#f8fafc]">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-[#8391aa] gap-2">
              <div className="w-6 h-6 border-2 border-[#0d5bff] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Extrayendo chunks de Cloudflare D1...</span>
            </div>
          ) : viewMode === 'chunks' ? (
            filteredChunks.length === 0 ? (
              <p className="text-center py-8 text-xs text-[#8391aa]">No se encontraron chunks con ese término.</p>
            ) : (
              filteredChunks.map((chunk, idx) => (
                <div key={chunk.id || idx} className="bg-white rounded-2xl p-4 shadow-xs hover:shadow transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0d5bff]">
                      Chunk #{chunk.chunk_index !== undefined ? chunk.chunk_index + 1 : idx + 1}
                    </span>
                    <span className="text-[10px] text-[#8391aa]">{chunk.content.length} caracteres</span>
                  </div>
                  <p className="text-xs text-[#334155] leading-relaxed whitespace-pre-wrap select-text font-normal">{chunk.content}</p>
                </div>
              ))
            )
          ) : (
            <div className="bg-white rounded-2xl p-5 shadow-xs">
              <p className="text-xs text-[#334155] leading-relaxed whitespace-pre-wrap select-text font-mono">
                {doc?.raw_content || 'No hay contenido disponible para este documento.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
