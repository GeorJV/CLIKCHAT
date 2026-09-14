import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { DocFaqParser, ExtractedFaq } from '../../../utils/docFaqParser';
import { FaqPreviewItem } from './FaqPreviewItem';

interface FaqFileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportBulk: (faqs: Array<{ question: string; answer: string; category?: string }>, source: string) => Promise<boolean>;
}

export const FaqFileUploadModal: React.FC<FaqFileUploadModalProps> = ({
  isOpen,
  onClose,
  onImportBulk
}) => {
  if (!isOpen) return null;

  const [fileName, setFileName] = useState<string>('');
  const [isParsing, setIsParsing] = useState(false);
  const [extractedFaqs, setExtractedFaqs] = useState<ExtractedFaq[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsParsing(true);
    setErrorMessage(null);

    try {
      const text = await DocFaqParser.extractTextFromFile(file);
      const parsed = DocFaqParser.parseFaqsFromText(text);

      if (parsed.length > 0) {
        setExtractedFaqs(parsed);
      } else {
        setExtractedFaqs([]);
        setErrorMessage('No se detectaron preguntas en el archivo. Usa formato "P: Pregunta" y "R: Respuesta" o "¿...?"');
      }
    } catch (err) {
      setErrorMessage('Error al leer el archivo. Verifica el formato (.txt, .docx, .pdf).');
    } finally {
      setIsParsing(false);
    }
  };

  const handleToggle = (idx: number) => {
    setExtractedFaqs(prev => prev.map((f, i) => (i === idx ? { ...f, selected: !f.selected } : f)));
  };

  const handleRemove = (idx: number) => {
    setExtractedFaqs(prev => prev.filter((_, i) => i !== idx));
  };

  const handleChange = (idx: number, field: 'question' | 'answer', val: string) => {
    setExtractedFaqs(prev => prev.map((f, i) => (i === idx ? { ...f, [field]: val } : f)));
  };

  const selectedCount = extractedFaqs.filter(f => f.selected).length;

  const handleImport = async () => {
    const toImport = extractedFaqs.filter(f => f.selected).map(f => ({ question: f.question, answer: f.answer, category: f.category }));
    if (toImport.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    const ok = await onImportBulk(toImport, `archivo_${fileName || 'doc'}`);
    setIsSubmitting(false);
    if (ok) {
      setExtractedFaqs([]);
      setFileName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#09151c] border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl p-5 space-y-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Cargar Archivo de FAQs (.txt, .docx, .pdf)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {extractedFaqs.length === 0 && (
          <div className="border-2 border-dashed border-slate-700 hover:border-purple-500/60 rounded-xl p-6 text-center space-y-3 bg-[#050e14]">
            <UploadCloud className="w-8 h-8 text-purple-400 mx-auto animate-bounce" />
            <p className="text-xs font-bold text-slate-200">Arrastra o selecciona tu archivo de preguntas frecuentes</p>
            <p className="text-[11px] text-slate-400">Formatos admitidos: <strong>.TXT, .DOCX (Word), .PDF, .MD, .JSON</strong></p>
            <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl cursor-pointer transition shadow-md">
              <FileText className="w-3.5 h-3.5" />
              <span>{isParsing ? 'Analizando documento...' : 'Elegir Archivo'}</span>
              <input type="file" accept=".txt,.docx,.doc,.pdf,.md,.json" onChange={handleFileChange} disabled={isParsing} className="hidden" />
            </label>
            {errorMessage && <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs">{errorMessage}</div>}
          </div>
        )}

        {extractedFaqs.length > 0 && (
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-xl text-xs">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Se detectaron {extractedFaqs.length} preguntas en "{fileName}"
              </span>
              <span className="text-slate-400 text-[11px]">{selectedCount} seleccionadas</span>
            </div>
            <div className="space-y-2">
              {extractedFaqs.map((faq, idx) => (
                <FaqPreviewItem key={idx} faq={faq} index={idx} onToggle={handleToggle} onRemove={handleRemove} onChange={handleChange} />
              ))}
            </div>
          </div>
        )}

        {extractedFaqs.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button type="button" onClick={() => { setExtractedFaqs([]); setFileName(''); }} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer">
              Cargar otro archivo
            </button>
            <button type="button" onClick={handleImport} disabled={selectedCount === 0 || isSubmitting} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer">
              {isSubmitting ? 'Guardando en D1...' : `Importar ${selectedCount} FAQs a D1`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
