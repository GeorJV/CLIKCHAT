import React, { useState, useEffect, useCallback } from 'react';
import { KnowledgeDocument } from '../../types/client';
import { FileText, Trash2, Layers, Edit3, Eye, ChevronRight } from 'lucide-react';
import { DocumentDropzone } from './training/DocumentDropzone';
import { DocumentViewerModal } from './training/DocumentViewerModal';
import { DocumentUploadForm } from './training/DocumentUploadForm';
import { useVoceroMode } from '../../hooks/useVoceroMode';

interface DocumentsManagerTabProps {
  tenantId?: string;
}

export const DocumentsManagerTab: React.FC<DocumentsManagerTabProps> = ({ tenantId }) => {
  const { isVoceroMode } = useVoceroMode();
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
    <div className={`space-y-4 font-sans ${isVoceroMode ? 'text-[#0a1730]' : 'text-slate-100'}`}>
      {/* Cabecera Principal */}
      <div className={`rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isVoceroMode ? 'bg-white shadow-sm' : 'bg-[#181717] border border-[#282626] shadow-lg'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
            isVoceroMode ? 'bg-blue-50 text-[#0d5bff]' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-sm font-bold ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>Documentos, Manuales & Tablas (RAG Nivel 3)</h3>
            <p className={`text-xs ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'} mt-0.5`}>Sube manuales u hojas de cálculo que la IA particionará en chunks.</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer shrink-0 shadow-2xs ${
            isVoceroMode ? 'bg-[#f8fafc] hover:bg-[#ebf1ff] text-[#0a1730] hover:text-[#0d5bff]' : 'bg-[#222020] hover:bg-[#282626] text-zinc-300 hover:text-white border border-[#333131]'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{showForm ? 'Ocultar Editor' : 'Pegar Texto Manual'}</span>
        </button>
      </div>

      <DocumentDropzone tenantId={effectiveTenantId} onUploadSuccess={loadDocs} />

      {showForm && (
        <DocumentUploadForm
          title={title}
          setTitle={setTitle}
          category={category}
          setCategory={setCategory}
          content={content}
          setContent={setContent}
          isSubmitting={isSubmitting}
          onSubmit={handleUpload}
        />
      )}

      {/* Lista de Documentos */}
      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDocId(doc.id)}
            className={`rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer transition group ${
              isVoceroMode
                ? 'bg-white hover:shadow-md shadow-sm'
                : 'bg-[#181717] hover:bg-[#1f1e1e] border border-[#282626] shadow-md'
            }`}
          >
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`font-bold text-sm transition truncate ${
                  isVoceroMode ? 'text-[#0a1730] group-hover:text-[#0d5bff]' : 'text-white group-hover:text-emerald-400'
                }`}>{doc.title}</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                  isVoceroMode ? 'bg-[#f1f5f9] text-[#475569]' : 'bg-[#141313] text-zinc-400 border border-[#262424]'
                }`}>{doc.category}</span>
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-2xs ${
                  isVoceroMode ? 'bg-emerald-50 text-emerald-700' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  <Layers className={`w-3 h-3 ${isVoceroMode ? 'text-emerald-600' : 'text-emerald-400'}`} /> {doc.chunks_count || 1} Chunks D1
                </span>
              </div>
              <p className={`text-[11px] ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'}`}>
                Subido: {new Date(doc.created_at).toLocaleDateString()} • <span className={`${isVoceroMode ? 'text-[#0d5bff]' : 'text-emerald-400'} underline font-medium`}>Clic para explorar contenido</span>
              </p>
            </div>
            
            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedDocId(doc.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs ${
                  isVoceroMode ? 'bg-[#f8fafc] hover:bg-[#ebf1ff] text-[#334155] hover:text-[#0d5bff]' : 'bg-[#222020] hover:bg-[#282626] text-zinc-300 hover:text-white border border-[#333131]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ver contenido</span>
                <ChevronRight className={`w-3.5 h-3.5 ${isVoceroMode ? 'text-[#8391aa] group-hover:text-[#0d5bff]' : 'text-zinc-500 group-hover:text-emerald-400'}`} />
              </button>
              <button
                onClick={() => handleDelete(doc.id)}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  isVoceroMode ? 'text-[#8391aa] hover:text-rose-600 hover:bg-rose-50' : 'text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10'
                }`}
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
