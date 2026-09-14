import React, { useState, useEffect, useCallback } from 'react';
import { KnowledgeDocument } from '../../types/client';
import { FileText, Plus, Trash2, Sparkles, Layers } from 'lucide-react';

interface DocumentsManagerTabProps {
  tenantId?: string;
}

export const DocumentsManagerTab: React.FC<DocumentsManagerTabProps> = ({ tenantId }) => {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('manuales');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadDocs = useCallback(async () => {
    if (!tenantId) return;
    try {
      const res = await fetch(`/api/documents?tenantId=${tenantId}`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch (e) {
      console.error(e);
    }
  }, [tenantId]);

  useEffect(() => { loadDocs(); }, [loadDocs]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId || !title.trim() || !content.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: tenantId, title: title.trim(), content: content.trim(), category })
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
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Documentos y Manuales No Estructurados (RAG Bloque 2)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Manuales de garantía, guías de uso o políticas largas que el bot particiona en chunks para responder preguntas complejas.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Cerrar' : 'Subir Documento'}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleUpload} className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 space-y-3.5 shadow-xl">
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Ingestar Documento en Cloudflare D1
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1 font-medium">Título del Documento</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Manual de Garantía Oficial 2026" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1 font-medium">Categoría</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ej: garantias, politicas, guias" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1 font-medium">Texto Completo del Documento / Manual</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Pega aquí el texto completo del manual, términos o especificaciones..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 min-h-[110px]" />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={!title.trim() || !content.trim() || isSubmitting} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition disabled:opacity-50">
              {isSubmitting ? 'Particionando en Chunks...' : 'Ingestar y Vectorizar Documento'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">{doc.title}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">{doc.category}</span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
                  <Layers className="w-3 h-3" /> {doc.chunks_count || 1} Chunks D1
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Subido: {new Date(doc.created_at).toLocaleDateString()}</p>
            </div>
            <button onClick={() => handleDelete(doc.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
