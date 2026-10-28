import React from 'react';
import { Phone, Mail, MessageSquare, Trash2, Check } from 'lucide-react';
import { CrmLead } from '../../../types/crm';

interface VoceroContactItemProps {
  lead: CrmLead;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onSelectLead: (id: string) => void;
  onDeleteLead: (lead: CrmLead) => void;
}

export const VoceroContactItem: React.FC<VoceroContactItemProps> = ({
  lead, isSelected, onToggleSelect, onSelectLead, onDeleteLead
}) => {
  return (
    <div className={`p-3.5 flex items-center justify-between transition-colors ${isSelected ? 'bg-blue-50/70' : 'hover:bg-[#f6f8fc]'}`}>
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => onToggleSelect(lead.id)}
          aria-label={isSelected ? 'Deseleccionar' : 'Seleccionar'}
          className={`w-5 h-5 rounded-md border flex items-center justify-center transition cursor-pointer shrink-0 ${
            isSelected ? 'bg-[#0d5bff] border-[#0d5bff] text-white shadow-xs' : 'border-[#cbd5e1] bg-white hover:border-[#0d5bff]'
          }`}
        >
          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        <div className="w-9 h-9 rounded-full bg-[#eef2f9] border border-[#dde5f1] flex items-center justify-center font-bold text-xs text-[#0a1730] shrink-0">
          {lead.name ? lead.name.slice(0, 2).toUpperCase() : 'LE'}
        </div>

        <div className="min-w-0">
          <h4 className="font-bold text-[13.5px] text-[#0a1730] truncate">{lead.name || 'Sin Nombre'}</h4>
          <div className="flex items-center gap-2.5 text-[11px] text-[#8391aa] font-mono mt-0.5 flex-wrap">
            {lead.phone && <span className="flex items-center gap-1 text-[#42506b]"><Phone className="w-3 h-3 text-[#0d5bff]" />{lead.phone}</span>}
            {lead.email && <span className="flex items-center gap-1 text-[#42506b]"><Mail className="w-3 h-3 text-[#0d5bff]" />{lead.email}</span>}
            <span className="text-[10px] text-[#8391aa] uppercase font-sans">({lead.channel || 'web'})</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 ml-2">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ebf1ff] text-[#0038d8] uppercase hidden sm:inline-block">
          {lead.stage}
        </span>

        {lead.phone && (
          <a
            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg border border-[#dde5f1] hover:bg-[#eaf7ef] hover:text-[#0f8b44] text-[#8391aa] transition cursor-pointer"
            title="Abrir WhatsApp directo"
          >
            <Phone className="w-4 h-4" />
          </a>
        )}

        <button
          onClick={() => onSelectLead(lead.id)}
          className="p-1.5 rounded-lg border border-[#dde5f1] hover:bg-[#ebf1ff] hover:text-[#0038d8] text-[#8391aa] transition cursor-pointer"
          title="Abrir chat en CRM"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        <button
          onClick={() => onDeleteLead(lead)}
          className="p-1.5 rounded-lg border border-[#dde5f1] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-[#8391aa] transition cursor-pointer"
          title="Eliminar este contacto"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
