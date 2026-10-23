import React, { useState, useRef } from 'react';
import { Paperclip, UploadCloud, FileText, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { extractTextFromFile } from '../../../utils/documentExtractor';

interface AttachedDoc {
  name: string;
  size: string;
  ext: string;
}

interface VoceroSystemPromptAttachmentProps {
  systemPrompt: string;
  onSystemPromptChange: (newPrompt: string) => void;
}

export const VoceroSystemPromptAttachment: React.FC<VoceroSystemPromptAttachmentProps> = ({
  systemPrompt,
  onSystemPromptChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const [attachedDocs, setAttachedDocs] = useState<AttachedDoc[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processFiles = async (fileList: FileList | null) => {
    const validFiles = Array.from(fileList || []).filter(f => f && f.size > 0);
    if (validFiles.length === 0) return;

    setIsProcessing(true);
    setStatus(null);
    let appendedText = systemPrompt ? `${systemPrompt.trim()}\n\n` : '';
    const newDocs: AttachedDoc[] = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      setProgressMsg(`Extrayendo (${i + 1}/${validFiles.length}): ${file.name}...`);
      try {
        const text = await extractTextFromFile(file);
        if (!text || text.trim().length === 0) {
          throw new Error(`El archivo "${file.name}" no contiene texto legible.`);
        }
        const ext = file.name.split('.').pop()?.toLowerCase() || 'doc';
        appendedText += `\n--- INICIO DOCUMENTO: ${file.name} ---\n${text.trim()}\n--- FIN DOCUMENTO: ${file.name} ---\n`;
        newDocs.push({ name: file.name, size: formatFileSize(file.size), ext });
      } catch (err: any) {
        console.error(`Error al procesar ${file.name}:`, err);
        setStatus({ type: 'err', msg: err.message || `No se pudo leer ${file.name}` });
      }
    }

    setIsProcessing(false);
    setProgressMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (newDocs.length > 0) {
      onSystemPromptChange(appendedText.trim());
      setAttachedDocs(prev => [...prev, ...newDocs]);
      setStatus({ type: 'ok', msg: `¡${newDocs.length} archivo(s) incorporado(s) exitosamente a las instrucciones maestras!` });
      setTimeout(() => setStatus(null), 4000);
    }
  };

  const handleRemoveDoc = (docName: string) => {
    const escaped = docName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`\\n?--- INICIO DOCUMENTO: ${escaped} ---[\\s\\S]*?--- FIN DOCUMENTO: ${escaped} ---\\n?`, 'g');
    const cleanedPrompt = systemPrompt.replace(pattern, '\n').trim();
    onSystemPromptChange(cleanedPrompt);
    setAttachedDocs(prev => prev.filter(d => d.name !== docName));
  };

  return (
    <div className="space-y-2.5 mt-2 font-sans">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".txt,.md,.pdf,.docx,.doc,.json,.csv"
        onChange={(e) => processFiles(e.target.files)}
        className="hidden"
      />

      {/* Zona de Drop & Click para Adjuntar */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files); }}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`p-3.5 rounded-xl border-2 border-dashed transition cursor-pointer select-none flex items-center justify-between gap-3 ${
          isDragging
            ? 'border-[#0d5bff] bg-blue-50/70 scale-[1.01]'
            : 'border-[#d8e2f0] bg-[#f8fafc] hover:border-[#0d5bff]/60 hover:bg-[#f1f5f9]'
        } ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0d5bff] border border-blue-100">
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#0a1730] truncate">
              {isProcessing ? progressMsg : 'Arrastra o adjunta archivos para el System Prompt'}
            </p>
            <p className="text-[11px] text-[#62728d] truncate">
              Soporta documentos de texto (.txt, .md), PDFs (.pdf) y Word (.docx, .doc).
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#d8e2f0] text-xs font-bold text-[#0a1730] hover:bg-[#f6f8fc] shrink-0 shadow-2xs"
        >
          <Paperclip className="h-3.5 w-3.5 text-[#0d5bff]" />
          <span>Adjuntar</span>
        </button>
      </div>

      {/* Alertas de Estado */}
      {status && (
        <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 font-medium ${
          status.type === 'ok' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {status.type === 'ok' ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" /> : <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />}
          <span className="truncate">{status.msg}</span>
        </div>
      )}

      {/* Lista de Documentos Adjuntos Guardados */}
      {attachedDocs.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {attachedDocs.map((doc) => (
            <div
              key={doc.name}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#dde5f1] text-[11px] font-semibold text-[#0a1730] shadow-2xs"
            >
              <FileText className={`h-3.5 w-3.5 shrink-0 ${doc.ext === 'pdf' ? 'text-rose-500' : (doc.ext === 'docx' || doc.ext === 'doc') ? 'text-blue-500' : 'text-slate-500'}`} />
              <span className="truncate max-w-[150px]">{doc.name}</span>
              <span className="text-[10px] text-[#8391aa]">({doc.size})</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemoveDoc(doc.name); }}
                className="ml-1 p-0.5 rounded-md hover:bg-rose-50 text-[#8391aa] hover:text-rose-600 transition cursor-pointer"
                title="Quitar documento del System Prompt"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
