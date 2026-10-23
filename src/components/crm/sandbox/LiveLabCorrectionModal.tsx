import React, { useState, useEffect } from 'react';
import {
  X,
  Edit3,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Send,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

interface LiveLabCorrectionModalProps {
  isOpen: boolean;
  userQuestion: string;
  originalAnswer: string;
  messageId: string;
  onClose: () => void;
  onSaveCorrection: (
    newAnswer: string,
    action: 'faq' | 'flow_rule' | 'sandbox_only',
    testQuestion?: string
  ) => Promise<void>;
}

export const LiveLabCorrectionModal: React.FC<LiveLabCorrectionModalProps> = ({
  isOpen,
  userQuestion,
  originalAnswer,
  onClose,
  onSaveCorrection,
}) => {
  const [correctedText, setCorrectedText] = useState('');
  const [actionType, setActionType] = useState<'faq' | 'flow_rule' | 'sandbox_only'>('faq');
  const [testQuestion, setTestQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCorrectedText(originalAnswer);
      setTestQuestion(`¿Podrían confirmarme sobre ${userQuestion.replace(/^(hola|buenos dias|buenas|oye|disculpa),?\s*/i, '').trim()}?`);
      setSavedSuccess(false);
    }
  }, [isOpen, originalAnswer, userQuestion]);

  if (!isOpen) return null;

  const handleSubmit = async (shouldTest = false) => {
    if (!correctedText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    await onSaveCorrection(correctedText.trim(), actionType, shouldTest ? testQuestion : undefined);
    setIsSubmitting(false);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 font-sans animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-[#e2e8f0] space-y-4">
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e8edf6]">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#ebf1ff] flex items-center justify-center text-[#0d5bff]">
              <Edit3 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0a1730]">Live Lab · Modificar Respuesta</h3>
              <p className="text-[11px] text-[#62728d]">Corrige al agente y enséñale la respuesta correcta</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#8391aa] hover:bg-[#f6f8fc] hover:text-[#0a1730] cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Pregunta Original del Cliente */}
        <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0d5bff] flex items-center gap-1">
            <HelpCircle className="w-3 h-3" /> Pregunta formulada por el cliente:
          </span>
          <p className="font-semibold text-[#0a1730]">"{userQuestion}"</p>
        </div>

        {/* Editor de la Respuesta Correcta */}
        <div>
          <label className="block text-xs font-bold text-[#0a1730] mb-1.5 flex items-center justify-between">
            <span>Escribe cómo debió responder el agente:</span>
            {savedSuccess && (
              <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ¡Respuesta guardada con éxito!
              </span>
            )}
          </label>
          <textarea
            rows={4}
            value={correctedText}
            onChange={(e) => setCorrectedText(e.target.value)}
            placeholder="Escribe la respuesta exacta autorizada..."
            className="w-full rounded-xl border border-[#dde5f1] p-3 text-xs text-[#0a1730] outline-none focus:border-[#0d5bff] focus:bg-[#fafcff] leading-relaxed"
          />
        </div>

        {/* Destino de la Corrección */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-[#42506b] block">¿Dónde deseas aplicar este aprendizaje?</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'faq' as const, label: 'FAQ IQ (Memoria RAG)', icon: BookOpen, desc: 'Guardar como FAQ oficial' },
              { id: 'flow_rule' as const, label: 'Flow IQ (Reglas)', icon: TrendingUp, desc: 'Directiva de venta' },
              { id: 'sandbox_only' as const, label: 'Solo este Chat', icon: Sparkles, desc: 'Prueba local' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setActionType(opt.id)}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  actionType === opt.id
                    ? 'border-[#0d5bff] bg-[#ebf1ff] text-[#0038d8] shadow-xs'
                    : 'border-[#dde5f1] bg-white text-[#42506b] hover:bg-[#f8fafc]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <opt.icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{opt.label}</span>
                </div>
                <p className="text-[10px] text-[#62728d] mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Acciones del Modal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-3 border-t border-[#e8edf6]">
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-[#c9ebd6] bg-[#eaf7ef] text-[#0f8b44] hover:bg-[#d5eedf] text-xs font-bold transition cursor-pointer"
            title="Guarda la corrección y envía una pregunta similar para comprobar que el agente aprendió"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Comprobar respuesta agregada</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-[#dde5f1] text-xs font-semibold text-[#42506b] hover:bg-[#f6f8fc] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-[#0d5bff] hover:bg-[#0047e1] text-xs font-bold text-white shadow-xs disabled:opacity-50 transition cursor-pointer flex items-center gap-1.5"
            >
              <span>{isSubmitting ? 'Guardando...' : 'Aplicar Corrección'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
