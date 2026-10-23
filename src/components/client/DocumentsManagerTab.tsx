import React, { useState, useEffect, useCallback } from 'react';
import { KnowledgeDocument } from '../../types/client';
import { FileText, Plus, Trash2, Layers, Edit3, Eye, ChevronRight } from 'lucide-react';
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
      const res = await fetch(`/api/documents?tenantId=${effectiveTenantId}&_t=${Date.now()}`, { cache: 'no-store' });
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
        cache: 'no-store',
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
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE', cache: 'no-store' });
      if (res.ok) setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Cabecera Principal - Sin bordes, limpia y resaltadita */}
      <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0d5bff] shrink-0 shadow-xs">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0a1730]">Documentos, Manuales & Tablas (RAG Nivel 3)</h3>
            <p className="text-xs text-[#62728d] mt-0.5">Sube manuales u hojas de cálculo que la IA particionará en chunks.</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#f8fafc] hover:bg-[#ebf1ff] text-[#0a1730] hover:text-[#0d5bff] font-bold text-xs transition cursor-pointer shrink-0 shadow-2xs hover:shadow-xs"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{showForm ? 'Ocultar Editor' : 'Pegar Texto Manual'}</span>
        </button>
      </div>

      <DocumentDropzone tenantId={effectiveTenantId} onUploadSuccess={loadDocs} />

      {showForm && (
        <form onSubmit={handleUpload} className="bg-white rounded-2xl p-5 space-y-3.5 shadow-md">
          <h4 className="text-xs font-bold text-[#0a1730] uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#0d5bff]" /> Ingestar Documento en Cloudflare D1
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#0a1730] mb-1 font-bold">Título del Documento</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Manual de Garantía Oficial 2026"
                className="w-full bg-[#f8fafc] rounded-xl px-3.5 py-2 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:bg-white shadow-2xs transition"
              />
            </div>
            <div>
              <label className="block text-xs text-[#0a1730] mb-1 font-bold">Categoría</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ej: garantias, politicas, guias"
                className="w-full bg-[#f8fafc] rounded-xl px-3.5 py-2 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:bg-white shadow-2xs transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#0a1730] mb-1 font-bold">Texto Completo del Documento / Manual</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Pega aquí el texto completo del manual, términos o especificaciones..."
              className="w-full bg-[#f8fafc] rounded-xl p-3 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:bg-white min-h-[100px] shadow-2xs transition"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!title.trim() || !content.trim() || isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#0d5bff] hover:bg-[#0047e1] text-white font-bold text-xs transition shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Particionando en Chunks...' : 'Ingestar y Vectorizar Documento'}
            </button>
          </div>
        </form>
      )}

      {/* Lista de Documentos - Sin bordes, limpia y resaltadita */}
      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDocId(doc.id)}
            className="bg-white rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:shadow-md shadow-sm transition group"
            title="Haz clic para ver el contenido completo y los chunks particionados"
          >
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-[#0a1730] group-hover:text-[#0d5bff] transition truncate">{doc.title}</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#f1f5f9] text-[#475569]">{doc.category}</span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] bg-emerald-50 text-emerald-700 font-bold shadow-2xs">
                  <Layers className="w-3 h-3 text-emerald-600" /> {doc.chunks_count || 1} Chunks D1
                </span>
              </div>
              <p className="text-[11px] text-[#62728d]">
                Subido: {new Date(doc.created_at).toLocaleDateString()} • <span className="text-[#0d5bff] underline font-medium">Clic para explorar contenido</span>
              </p>
            </div>
            
            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedDocId(doc.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#f8fafc] hover:bg-[#ebf1ff] text-[#334155] hover:text-[#0d5bff] text-xs font-bold transition cursor-pointer shadow-2xs"
                title="Ver contenido"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ver contenido</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#8391aa] group-hover:text-[#0d5bff] transition" />
              </button>
              <button
                onClick={() => handleDelete(doc.id)}
                className="p-2 rounded-xl text-[#8391aa] hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
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
