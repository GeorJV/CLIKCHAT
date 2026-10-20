import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, DollarSign, FileText, ExternalLink, Check } from 'lucide-react';
import { CrmLead, CRM_STAGES, CrmStageId } from '../../../types/crm';
import { VoceroTagsEditor } from './VoceroTagsEditor';

interface VoceroLeadDetailPanelProps {
  lead: CrmLead | null;
  onChangeStage: (leadId: string, stage: CrmStageId) => void;
  onUpdateLead: (leadId: string, fields: Partial<CrmLead>) => void;
}

export const VoceroLeadDetailPanel: React.FC<VoceroLeadDetailPanelProps> = ({
  lead,
  onChangeStage,
  onUpdateLead,
}) => {
  const [dealValue, setDealValue] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSavedNotes, setIsSavedNotes] = useState(false);

  useEffect(() => {
    if (lead) {
      setDealValue(lead.deal_value ? String(lead.deal_value) : '');
      setNotes(lead.notes || '');
    }
  }, [lead?.id]);

  if (!lead) {
    return (
      <div className="w-80 h-full bg-zinc-950 p-4 border-l border-zinc-800 text-zinc-500 text-xs flex items-center justify-center">
        Detalles del Lead
      </div>
    );
  }

  const handleSaveDealValue = () => {
    const num = parseFloat(dealValue) || 0;
    onUpdateLead(lead.id, { deal_value: num });
  };

  const handleSaveNotes = () => {
    onUpdateLead(lead.id, { notes });
    setIsSavedNotes(true);
    setTimeout(() => setIsSavedNotes(false), 2000);
  };

  const cleanPhone = lead.phone.replace(/[^0-9]/g, '');

  return (
    <div className="w-80 h-full bg-zinc-950 border-l border-zinc-800/80 overflow-y-auto p-4 space-y-4">
      {/* Perfil del Contacto */}
      <div className="text-center pb-3 border-b border-zinc-800 space-y-1.5">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-base text-white shadow-md">
          {lead.name ? lead.name.slice(0, 2).toUpperCase() : 'LE'}
        </div>
        <h3 className="text-sm font-bold text-white tracking-tight">{lead.name || 'Sin Nombre'}</h3>
        <p className="text-[11px] text-zinc-400 font-mono">{lead.phone || 'Sin Teléfono'}</p>

        {cleanPhone && (
          <a
            href={`https://wa.me/${cleanPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold transition mt-1"
          >
            <span>Abrir en WhatsApp</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        )}
      </div>

      {/* Selector de Etapa del Pipeline (1-Clic) */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
          Etapa del Embudo
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {CRM_STAGES.map((st) => (
            <button
              key={st.id}
              onClick={() => onChangeStage(lead.id, st.id)}
              className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition text-left border cursor-pointer ${
                lead.stage === st.id
                  ? `${st.bgLight} ${st.color} ${st.borderColor} shadow-sm ring-1 ring-current`
                  : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {st.title}
            </button>
          ))}
        </div>
      </div>

      {/* Valor del Trato ($ Deal Value) */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-zinc-400 flex items-center gap-1 uppercase tracking-wider">
          <DollarSign className="w-3 h-3 text-emerald-400" /> Valor Estimado / Venta
        </label>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            value={dealValue}
            onChange={(e) => setDealValue(e.target.value)}
            onBlur={handleSaveDealValue}
            placeholder="0.00"
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleSaveDealValue}
            className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-bold border border-zinc-700 cursor-pointer"
          >
            Guardar
          </button>
        </div>
      </div>

      {/* Editor de Etiquetas */}
      <VoceroTagsEditor
        tags={lead.tags || []}
        onUpdateTags={(tags) => onUpdateLead(lead.id, { tags })}
      />

      {/* Notas Privadas del Asesor */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-zinc-400 flex items-center gap-1 uppercase tracking-wider">
            <FileText className="w-3 h-3 text-emerald-400" /> Notas Internas
          </label>
          {isSavedNotes && (
            <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-semibold">
              <Check className="w-3 h-3" /> Guardado
            </span>
          )}
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleSaveNotes}
          rows={3}
          placeholder="Escribe notas privadas sobre las preferencias de este cliente..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 resize-none"
        />
      </div>
    </div>
  );
};
