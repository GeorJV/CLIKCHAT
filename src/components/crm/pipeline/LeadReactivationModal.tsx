import React, { useState } from 'react';
import { Zap, MessageSquare, ExternalLink, X, Check } from 'lucide-react';
import { CrmLead } from '../../../types/crm';

interface LeadReactivationModalProps {
  lead: CrmLead;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage?: (leadId: string, text: string) => void;
}

export const REACTIVATION_TEMPLATES = [
  {
    id: 'hold_order',
    title: '📦 Apartado de Comanda',
    text: (name: string) => `Hola ${name || 'estimad@'}, tenemos apartado tu pedido. ¿Deseas que lo enviemos a preparación en cocina hoy mismo?`,
  },
  {
    id: 'courtesy_benefit',
    title: '🎁 Cortesía / Envío Gratis',
    text: (name: string) => `Hola ${name || 'estimad@'}, si confirmas tu orden en los próximos 30 minutos, te incluimos el envío de cortesía directo a tu dirección.`,
  },
  {
    id: 'personal_support',
    title: '💬 Asistencia con Pago / SINPE',
    text: (name: string) => `Hola ${name || 'estimad@'}, ¿te quedó alguna duda con las opciones de pago (SINPE Móvil o efectivo)? Con gusto te ayudo a finalizar por aquí.`,
  },
];

export const LeadReactivationModal: React.FC<LeadReactivationModalProps> = ({
  lead,
  isOpen,
  onClose,
  onSendMessage,
}) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [customText, setCustomText] = useState(
    REACTIVATION_TEMPLATES[0].text(lead.name || 'Cliente')
  );
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSelectTemplate = (idx: number) => {
    setSelectedIdx(idx);
    setCustomText(REACTIVATION_TEMPLATES[idx].text(lead.name || 'Cliente'));
  };

  const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');

  const handleSendWeb = () => {
    if (onSendMessage) {
      onSendMessage(lead.id, customText);
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1500);
    }
  };

  const handleOpenWa = () => {
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customText)}`;
    window.open(waUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 font-sans animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl border border-[#dde5f1] bg-white p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#f0f4fa]">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#0a1730]">Reactivación de Lead Frío</h3>
              <p className="text-[11px] text-[#62728d]">Follow-up persuasivo en 1-clic (Zolutium Supercharged)</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-700">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Templates Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[#42506b] block">Plantilla Persuasiva:</label>
          <div className="space-y-1">
            {REACTIVATION_TEMPLATES.map((tpl, i) => (
              <button
                key={tpl.id}
                onClick={() => handleSelectTemplate(i)}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition cursor-pointer ${
                  selectedIdx === i
                    ? 'border-[#0d5bff] bg-blue-50/60 font-bold text-[#0038d8]'
                    : 'border-[#dde5f1] bg-[#f6f8fc] text-slate-700 hover:bg-white'
                }`}
              >
                {tpl.title}
              </button>
            ))}
          </div>
        </div>

        {/* Message Editor */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[#42506b] block">Mensaje a Enviar:</label>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            rows={3}
            className="w-full p-2.5 rounded-xl border border-[#dde5f1] bg-[#f6f8fc] text-xs text-[#0a1730] outline-none focus:border-[#0d5bff] focus:bg-white resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          {onSendMessage && (
            <button
              onClick={handleSendWeb}
              disabled={sentSuccess}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#0d5bff] hover:bg-[#0a4de6] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              {sentSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <MessageSquare className="w-3.5 h-3.5" />}
              <span>{sentSuccess ? '¡Enviado al Chat!' : 'Enviar por Chat'}</span>
            </button>
          )}

          {cleanPhone && (
            <button
              onClick={handleOpenWa}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#157a41] hover:bg-[#116636] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir WhatsApp</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
