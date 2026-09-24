import React, { useState, useEffect, useCallback } from 'react';
import { KnowledgeDocument } from '../../types/client';
import { FileText, Plus, Trash2, Sparkles, Layers, Edit3, Eye, ChevronRight } from 'lucide-react';
import { DocumentDropzone } from './training/DocumentDropzone';
import { DocumentViewerModal } from './training/DocumentViewerModal';

interface DocumentsManagerTabProps {
  tenantId?: string;
}

export const DocumentsManagerTab: React.FC<DocumentsManagerTabProps> = ({ tenantId }) => {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('manuales');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const effectiveTenantId = tenantId || 'a0000000-0000-0000-0000-000000000001';

  const loadDocs = useCallback(async () => {
    try {
      const res = await fetch(`/api/documents?tenantId=${effectiveTenantId}`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch (e) {
      console.error(e);
    }
  }, [effectiveTenantId]);

  useEffect(() => { loadDocs(); }, [loadDocs]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: effectiveTenantId, title: title.trim(), content: content.trim(), category })
      });
      if (res.ok) {
        setTitle('');
        setContent('');
        setShowForm(false);
        await loadDocs();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      if (res.ok) setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-5">
      <div className="onyx-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Documentos, Manuales & Tablas (RAG Nivel 3)</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Sube manuales (.docx, .txt) u hojas de cálculo (.xlsx) que la IA procesará y particionará en chunks para responder con certeza.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#1c1a1a] hover:bg-[#252222] border border-[#333] text-zinc-200 font-bold text-xs transition cursor-pointer shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{showForm ? 'Ocultar Editor' : 'Pegar Texto Manual'}</span>
        </button>
      </div>

      {/* ZONA UNIVERSAL DE ARRASTRAR Y SOLTAR / SUBIR DESDE PC */}
      <DocumentDropzone tenantId={effectiveTenantId} onUploadSuccess={loadDocs} />

      {showForm && (
        <form onSubmit={handleUpload} className="onyx-card rounded-2xl p-5 space-y-3.5 shadow-xl">
          <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Ingestar Documento en Cloudflare D1
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-300 mb-1 font-medium">Título del Documento</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Manual de Garantía Oficial 2026" className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-xs text-zinc-300 mb-1 font-medium">Categoría</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ej: garantias, politicas, guias" className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-zinc-300 mb-1 font-medium">Texto Completo del Documento / Manual</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Pega aquí el texto completo del manual, términos o especificaciones..." className="w-full bg-[#111010] border border-[#282626] rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 min-h-[110px]" />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={!title.trim() || !content.trim() || isSubmitting} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition disabled:opacity-50 cursor-pointer">
              {isSubmitting ? 'Particionando en Chunks...' : 'Ingestar y Vectorizar Documento'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDocId(doc.id)}
            className="onyx-card rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:border-emerald-500/50 hover:bg-[#191717] transition group shadow-sm"
            title="Haz clic para ver el contenido completo y los chunks particionados"
          >
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-white group-hover:text-emerald-300 transition truncate">{doc.title}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#151414] text-zinc-300 border border-[#282626]">{doc.category}</span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  <Layers className="w-3 h-3" /> {doc.chunks_count || 1} Chunks D1
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Subido: {new Date(doc.created_at).toLocaleDateString()} • <span className="text-emerald-400/80 group-hover:text-emerald-300 underline font-medium">Clic para explorar contenido</span></p>
            </div>
            
            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedDocId(doc.id)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#201d1d] hover:bg-emerald-500/20 border border-[#333] hover:border-emerald-500/40 text-zinc-300 hover:text-emerald-300 text-xs font-bold transition cursor-pointer"
                title="Ver contenido"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ver contenido</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 transition" />
              </button>
              <button
                onClick={() => handleDelete(doc.id)}
                className="p-2 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                title="Eliminar documento"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedDocId && (
        <DocumentViewerModal
          documentId={selectedDocId}
          onClose={() => setSelectedDocId(null)}
        />
      )}
    </div>
  );
};
