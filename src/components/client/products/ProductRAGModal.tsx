import React, { useState, useEffect, useRef } from 'react';
import { X, Brain, Upload, FileText, Check, AlertCircle, Trash2, Sparkles } from 'lucide-react';
import { Product } from '../../../types';
import { extractTextFromFile } from '../../../utils/documentExtractor';

interface ProductRAGModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productId: string, embeddingText: string) => Promise<boolean>;
}

export const ProductRAGModal: React.FC<ProductRAGModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave
}) => {
  const [content, setContent] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setContent(product.embedding_text || (product.details as any)?.rag_knowledge || '');
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsExtracting(true);
    setErrorMsg(null);
    try {
      const extracted = await extractTextFromFile(file);
      setContent(prev => (prev ? `${prev}\n\n--- Documento: ${file.name} ---\n${extracted}` : extracted));
      setSuccessMsg(`¡Archivo "${file.name}" leído exitosamente! (0 tokens)`);
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al procesar el archivo');
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg(null);
    try {
      const ok = await onSave(product.id, content.trim());
      if (ok) {
        setSuccessMsg('¡Conocimiento RAG guardado para este producto!');
        setTimeout(() => { setSuccessMsg(null); onClose(); }, 1200);
      } else { setErrorMsg('No se pudo guardar. Intenta nuevamente.'); }
    } catch (e: any) { setErrorMsg(e.message || 'Error al guardar'); }
    finally { setIsSaving(false); }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-[#121111] border border-[#2b2828] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#242222] flex items-center justify-between bg-[#171616]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <span>RAG & Conocimiento de Producto</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-extrabold">Exclusivo</span>
              </h3>
              <p className="text-xs text-zinc-400 truncate max-w-xs sm:max-w-md">{product.name}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#343030] hover:border-purple-500/50 bg-[#161515] rounded-xl p-3 text-center cursor-pointer transition group"
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".txt,.md,.docx,.pdf" className="hidden" />
            <div className="flex items-center justify-center gap-2 text-zinc-300 text-xs font-semibold">
              <Upload className="w-4 h-4 text-purple-400 group-hover:scale-110 transition" />
              <span>Subir archivo: <strong className="text-purple-300">.txt, .docx o .pdf</strong></span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">$0 Tokens</span>
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5">Lectura instantánea en navegador sin consumo de IA.</p>
          </div>

          {isExtracting && <div className="text-xs text-purple-400 flex items-center gap-1.5 bg-purple-950/30 p-2 rounded-lg border border-purple-800/30 animate-pulse"><FileText className="w-3.5 h-3.5" /><span>Extrayendo texto del documento sin gastar tokens...</span></div>}
          {errorMsg && <div className="text-xs text-rose-400 flex items-center gap-1.5 bg-rose-950/30 p-2 rounded-lg border border-rose-800/30"><AlertCircle className="w-3.5 h-3.5" /><span>{errorMsg}</span></div>}
          {successMsg && <div className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-950/30 p-2 rounded-lg border border-emerald-800/30"><Check className="w-3.5 h-3.5" /><span>{successMsg}</span></div>}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400 font-bold uppercase tracking-wider">Manual / Instrucciones Específicas:</span>
              <span className="text-purple-300 font-mono text-[10px]">{wordCount} palabras | {content.length} caracteres</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={7}
              placeholder="Pega o escribe aquí la información exclusiva de este producto: temarios, manual de uso, garantías, modo de empleo, ingredientes, compatibilidad o preguntas frecuentes..."
              className="w-full bg-[#161515] border border-[#2b2929] rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 resize-none font-mono leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#242222] bg-[#171616] flex items-center justify-between gap-2">
          {content ? (
            <button type="button" onClick={() => setContent('')} className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-red-400 transition py-1 px-2">
              <Trash2 className="w-3 h-3" />
              <span>Limpiar</span>
            </button>
          ) : <div />}
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} disabled={isSaving} className="px-3 py-1.5 text-xs text-zinc-300 hover:text-white bg-[#222020] hover:bg-[#2b2828] rounded-xl border border-[#2e2c2c] transition">
              Cancelar
            </button>
            <button type="button" onClick={handleSave} disabled={isSaving || isExtracting} className="px-4 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 active:scale-95 rounded-xl transition flex items-center gap-1.5 shadow-md disabled:opacity-50">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Guardando...' : 'Guardar Conocimiento'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
