import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw, FileSpreadsheet, FileCode, X } from 'lucide-react';
import { parseDocumentFile } from '../../../utils/documentParser';

interface Props {
  tenantId?: string;
  onUploadSuccess: () => Promise<void>;
}

export const DocumentDropzone: React.FC<Props> = ({ tenantId, onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const effectiveTenantId = tenantId || 'a0000000-0000-0000-0000-000000000001';

  const handleFiles = async (fileList: FileList | null) => {
    // Filtrar únicamente archivos reales con tamaño > 0 bytes para evitar falsos positivos
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
    <div className="space-y-3">
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
        className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition flex flex-col items-center justify-center text-center cursor-pointer select-none ${
          isDragging ? 'border-emerald-500 bg-emerald-500/[0.08] scale-[1.01]' : 'border-[#333030] bg-[#141212] hover:border-emerald-500/50 hover:bg-[#181616]'
        } ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
      >
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 shadow-lg pointer-events-none">
          {isProcessing ? <RefreshCw className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
        </div>

        <h4 className="text-sm font-bold text-white mb-1 pointer-events-none">
          {isDragging ? '¡Suelta tus archivos aquí!' : 'Arrastra y suelta tus documentos o haz clic para explorar tu PC'}
        </h4>
        <p className="text-xs text-zinc-400 max-w-md mb-3 pointer-events-none">
          Sube manuales, términos, políticas o tablas de datos para que la IA responda consultas con certeza total.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 pointer-events-none select-none">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#1a1818] border border-[#2e2c2c] text-zinc-300">
            <FileText className="w-3 h-3 text-rose-400" /> PDF (.PDF)
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#1a1818] border border-[#2e2c2c] text-zinc-300">
            <FileText className="w-3 h-3 text-sky-400" /> .TXT / .MD / .CSV
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#1a1818] border border-[#2e2c2c] text-zinc-300">
            <FileCode className="w-3 h-3 text-indigo-400" /> Word (.DOCX, .DOC)
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#1a1818] border border-[#2e2c2c] text-zinc-300">
            <FileSpreadsheet className="w-3 h-3 text-emerald-400" /> Excel (.XLSX, .XLS)
          </span>
        </div>
      </div>

      {isProcessing && (
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center gap-2 font-medium">
          <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
          <span>{progressMsg}</span>
        </div>
      )}

      {status && (
        <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 font-medium animate-fade-in ${
          status.type === 'ok' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          <div className="flex items-center gap-2">
            {status.type === 'ok' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{status.msg}</span>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setStatus(null); }}
            className="text-zinc-400 hover:text-white p-0.5 rounded transition cursor-pointer"
            title="Cerrar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
