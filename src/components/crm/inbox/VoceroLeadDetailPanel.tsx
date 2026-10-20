import React, { useState, useEffect } from 'react';
import { ChevronRight, ExternalLink, DollarSign, FileText, Check } from 'lucide-react';
import { CrmLead, CRM_STAGES, CrmStageId } from '../../../types/crm';

interface VoceroLeadDetailPanelProps {
  lead: CrmLead | null;
  onChangeStage: (leadId: string, stage: CrmStageId) => void;
  onUpdateLead: (leadId: string, fields: Partial<CrmLead>) => void;
  onClose: () => void;
}

export const VoceroLeadDetailPanel: React.FC<VoceroLeadDetailPanelProps> = ({
  lead,
  onChangeStage,
  onUpdateLead,
  onClose,
}) => {
  const [dealValue, setDealValue] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [savedNotes, setSavedNotes] = useState(false);

  useEffect(() => {
    if (lead) {
      setDealValue(lead.deal_value ? String(lead.deal_value) : '');
      setNotes(lead.notes || '');
    }
  }, [lead?.id]);

  if (!lead) return null;

  const handleSaveNotes = () => {
    onUpdateLead(lead.id, { notes });
    setSavedNotes(true);
    setTimeout(() => setSavedNotes(false), 2000);
  };

  const cleanPhone = lead.phone.replace(/[^0-9]/g, '');

  return (
    <div className="w-80 h-full bg-white border-l border-[#e8edf6] flex flex-col font-sans select-none overflow-y-auto">
      {/* Cabecera idéntica a Vocero */}
      <header className="sticky top-0 flex items-center justify-between border-b border-[#e8edf6] bg-white px-4 py-3 shadow-xs">
        <h3 className="vocero-kicker">Detalles</h3>
        <button
          onClick={onClose}
          aria-label="Ocultar panel"
          className="rounded p-1 text-[#8391aa] hover:bg-[#f6f8fc] hover:text-[#0a1730] cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </header>

      <div className="p-4 space-y-4 text-xs">
        {/* Contacto */}
        <div className="flex items-center gap-3 pb-3 border-b border-[#e8edf6]">
          <div className="w-10 h-10 rounded-full bg-[#eef2f9] border border-[#dde5f1] flex items-center justify-center font-bold text-sm text-[#0a1730]">
            {lead.name ? lead.name.slice(0, 2).toUpperCase() : 'LE'}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-[14px] text-[#0a1730] truncate">{lead.name || 'Sin Nombre'}</h4>
            <p className="font-mono text-[11px] text-[#8391aa]">{lead.phone || 'Sin teléfono'}</p>
          </div>
        </div>

        {cleanPhone && (
          <a
            href={`https://wa.me/${cleanPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg border border-[#c9ebd6] bg-[#e9f7ee] text-[#157a41] font-bold text-[11px] hover:bg-[#d7eede] transition"
          >
            <span>Conversar en WhatsApp</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}

        {/* Etapa del Embudo (Pills de Vocero) */}
        <div className="space-y-1.5">
          <span className="vocero-kicker block">Etapa del Embudo</span>
          <div className="grid grid-cols-2 gap-1.5">
            {CRM_STAGES.map((s) => {
              const active = lead.stage === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onChangeStage(lead.id, s.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border text-left transition cursor-pointer ${
                    active
                      ? 'border-[#0d5bff] bg-[#ebf1ff] text-[#0038d8] font-bold shadow-xs'
                      : 'border-[#dde5f1] bg-[#f6f8fc] text-[#42506b] hover:bg-white'
                  }`}
                >
                  {s.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Monto del Trato */}
        <div className="space-y-1.5">
          <span className="vocero-kicker block">Monto del Trato</span>
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-[#8391aa] text-xs">$</span>
              <input
                type="number"
                value={dealValue}
                onChange={(e) => setDealValue(e.target.value)}
                onBlur={() => onUpdateLead(lead.id, { deal_value: parseFloat(dealValue) || 0 })}
                placeholder="0.00"
                className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-[#dde5f1] bg-[#f6f8fc] text-xs font-mono text-[#0a1730] outline-none focus:border-[#0d5bff] focus:bg-white"
              />
            </div>
            <span className="font-mono text-xs text-[#8391aa] font-bold">MXN</span>
          </div>
        </div>

        {/* Notas Internas */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="vocero-kicker block">Notas Privadas</span>
            {savedNotes && (
              <span className="text-[10px] text-[#157a41] flex items-center gap-0.5 font-bold">
                <Check className="w-3 h-3" /> Guardado
              </span>
            )}
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleSaveNotes}
            rows={3}
            placeholder="Añade notas privadas sobre este cliente…"
            className="w-full p-2 rounded-lg border border-[#dde5f1] bg-[#f6f8fc] text-xs text-[#0a1730] outline-none focus:border-[#0d5bff] focus:bg-white resize-none"
          />
        </div>
      </div>
    </div>
  );
};
