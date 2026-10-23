import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw, FileSpreadsheet, FileCode } from 'lucide-react';
import { parseDocumentFile } from '../../../utils/documentParser';
import { useVoceroMode } from '../../../hooks/useVoceroMode';

interface Props {
  tenantId?: string;
  onUploadSuccess: () => Promise<void>;
}

export const DocumentDropzone: React.FC<Props> = ({ tenantId, onUploadSuccess }) => {
  const { isVoceroMode } = useVoceroMode();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const effectiveTenantId = tenantId || 'a0000000-0000-0000-0000-000000000001';

  const handleFiles = async (fileList: FileList | null) => {
    const validFiles = Array.from(fileList || []).filter(f => f && f.size > 0);
    if (validFiles.length === 0) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsProcessing(true);
    setStatus(null);

    let successCount = 0;
    let lastError = '';

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      setProgressMsg(`Procesando (${i + 1}/${validFiles.length}): ${file.name}...`);
      try {
        const { title, content, fileType } = await parseDocumentFile(file);
        if (!content || content.trim().length === 0) {
          throw new Error(`El archivo "${file.name}" está vacío o no contiene texto legible.`);
        }

        const res = await fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenant_id: effectiveTenantId,
            title,
            content,
            category: fileType === 'xlsx' || fileType === 'xls' ? 'inventario_tablas' : 'manuales'
          })
        });

        if (res.ok) {
          successCount++;
        } else {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Error del servidor al subir ${file.name}`);
        }
      } catch (err: any) {
        console.error(`Error procesando ${file.name}:`, err);
        lastError = err.message || `No se pudo procesar ${file.name}`;
      }
    }

    setIsProcessing(false);
    setProgressMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (successCount > 0) {
      setStatus({ type: 'ok', msg: `¡${successCount} documento(s) indexado(s) exitosamente en Cloudflare D1!` });
      await onUploadSuccess();
      setTimeout(() => setStatus(null), 4000);
    } else if (lastError) {
      setStatus({ type: 'err', msg: lastError });
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <div className="space-y-3 font-sans">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".txt,.md,.csv,.doc,.docx,.xlsx,.xls,.pdf"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`p-6 sm:p-8 rounded-2xl transition flex flex-col items-center justify-center text-center cursor-pointer select-none shadow-sm hover:shadow-md ${
          isVoceroMode
            ? (isDragging ? 'bg-[#ebf1ff] scale-[1.01]' : 'bg-white hover:bg-[#f8fafc]')
            : (isDragging ? 'bg-emerald-950/20 border border-emerald-500/40 scale-[1.01]' : 'bg-[#181717] hover:bg-[#1d1c1c] border border-[#282626]')
        } ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
      >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-xs pointer-events-none ${
          isVoceroMode ? 'bg-blue-50 text-[#0d5bff]' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        }`}>
          {isProcessing ? <RefreshCw className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
        </div>

        <h4 className={`text-sm font-bold mb-1 pointer-events-none ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>
          {isDragging ? '¡Suelta tus archivos aquí!' : 'Arrastra y suelta tus documentos o haz clic para explorar tu PC'}
        </h4>
        <p className={`text-xs max-w-md mb-3 pointer-events-none ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'}`}>
          Sube manuales, términos, políticas o tablas de datos para que la IA responda consultas con certeza total.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 pointer-events-none select-none">
          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-2xs ${
            isVoceroMode ? 'bg-[#f8fafc] text-[#475569]' : 'bg-[#141313] text-zinc-300 border border-[#262424]'
          }`}>
            <FileText className="w-3 h-3 text-rose-500" /> PDF (.PDF)
          </span>
          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-2xs ${
            isVoceroMode ? 'bg-[#f8fafc] text-[#475569]' : 'bg-[#141313] text-zinc-300 border border-[#262424]'
          }`}>
            <FileText className={`w-3 h-3 ${isVoceroMode ? 'text-[#0d5bff]' : 'text-emerald-400'}`} /> .TXT / .MD / .CSV
          </span>
          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-2xs ${
            isVoceroMode ? 'bg-[#f8fafc] text-[#475569]' : 'bg-[#141313] text-zinc-300 border border-[#262424]'
          }`}>
            <FileCode className="w-3 h-3 text-indigo-400" /> Word (.DOCX, .DOC)
          </span>
          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-2xs ${
            isVoceroMode ? 'bg-[#f8fafc] text-[#475569]' : 'bg-[#141313] text-zinc-300 border border-[#262424]'
          }`}>
            <FileSpreadsheet className="w-3 h-3 text-emerald-500" /> Excel (.XLSX, .XLS)
          </span>
        </div>
      </div>

      {isProcessing && (
        <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 font-medium shadow-2xs ${
          isVoceroMode ? 'bg-blue-50 text-[#0d5bff]' : 'bg-emerald-950/30 text-emerald-300 border border-emerald-500/30'
        }`}>
          <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
          <span>{progressMsg}</span>
        </div>
      )}

      {status && (
        <div className={`p-3.5 rounded-xl text-xs flex items-center justify-between gap-2 font-medium animate-fade-in shadow-xs ${
          status.type === 'ok'
            ? (isVoceroMode ? 'bg-emerald-50 text-emerald-800' : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30')
            : (isVoceroMode ? 'bg-rose-50 text-rose-800' : 'bg-rose-950/40 text-rose-300 border border-rose-500/30')
        }`}>
          <div className="flex items-center gap-2">
            {status.type === 'ok' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />}
            <span>{status.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
};
