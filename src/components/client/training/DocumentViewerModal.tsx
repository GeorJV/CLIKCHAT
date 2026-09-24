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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#141313] border border-[#2e2b2b] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#282626] flex items-center justify-between gap-3 bg-[#181616]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white truncate">{doc?.title || 'Cargando documento...'}</h3>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1"><Tag className="w-3 h-3 text-zinc-500" /> {doc?.category || 'manuales'}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold"><Layers className="w-3 h-3" /> {doc?.chunks?.length || doc?.chunks_count || 0} Chunks D1</span>
                {doc?.created_at && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-zinc-500"><Calendar className="w-3 h-3" /> {new Date(doc.created_at).toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: View Switcher & Search */}
        <div className="px-4 py-2.5 bg-[#111010] border-b border-[#242222] flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center bg-[#1c1a1a] p-0.5 rounded-xl border border-[#2e2b2b]">
            <button
              onClick={() => setViewMode('chunks')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'chunks' ? 'bg-[#2a2727] text-emerald-400 shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Chunks RAG ({doc?.chunks?.length || 0})</span>
            </button>
            <button
              onClick={() => setViewMode('full')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'full' ? 'bg-[#2a2727] text-emerald-400 shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Texto Completo</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {viewMode === 'chunks' && (
              <div className="relative">
                <Search className="w-3 h-3 text-zinc-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar en chunks..."
                  className="bg-[#1a1818] border border-[#2e2b2b] rounded-lg pl-7 pr-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 w-36 sm:w-48"
                />
              </div>
            )}
            {viewMode === 'full' && (
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-lg bg-[#1c1a1a] hover:bg-[#252222] border border-[#2e2b2b] text-xs font-bold text-zinc-200 transition cursor-pointer flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 min-h-0 bg-[#0e0d0d]">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-zinc-500 gap-2">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Extrayendo chunks de Cloudflare D1...</span>
            </div>
          ) : viewMode === 'chunks' ? (
            filteredChunks.length === 0 ? (
              <p className="text-center py-8 text-xs text-zinc-500">No se encontraron chunks con ese término.</p>
            ) : (
              filteredChunks.map((chunk, idx) => (
                <div key={chunk.id || idx} className="bg-[#161515] border border-[#292626] rounded-xl p-3.5 hover:border-emerald-500/30 transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Chunk #{chunk.chunk_index !== undefined ? chunk.chunk_index + 1 : idx + 1}
                    </span>
                    <span className="text-[10px] text-zinc-500">{chunk.content.length} caracteres</span>
                  </div>
                  <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap select-text">{chunk.content}</p>
                </div>
              ))
            )
          ) : (
            <div className="bg-[#161515] border border-[#292626] rounded-xl p-4">
              <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap select-text font-mono">
                {doc?.raw_content || 'No hay contenido disponible para este documento.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
