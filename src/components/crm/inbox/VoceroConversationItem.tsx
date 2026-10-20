import React from 'react';
import { CrmLead } from '../../../types/crm';

interface VoceroConversationItemProps {
  lead: CrmLead;
  isSelected: boolean;
  onSelect: (leadId: string) => void;
}

const STAGE_DOT_COLOR: Record<string, string> = {
  lead: '#8391aa',
  qualifying: '#0d5bff',
  proposal: '#8b5cf6',
  negotiation: '#f2a71b',
  won: '#1fb35b',
  lost: '#d94a4a',
};

export const VoceroConversationItem: React.FC<VoceroConversationItemProps> = ({
  lead,
  isSelected,
  onSelect,
}) => {
  const isWhatsApp = lead.channel === 'whatsapp';
  const dotColor = STAGE_DOT_COLOR[lead.stage] || '#8391aa';

  const timeStr = lead.last_message_at
    ? new Date(lead.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div
      onClick={() => onSelect(lead.id)}
      className={`px-3 py-2.5 rounded-xl border transition-all cursor-pointer relative ${
        isSelected
          ? 'bg-[#ebf1ff] border-[#d3e2ff] text-[#0a1730] shadow-sm'
          : 'bg-white hover:bg-[#f6f8fc] border-[#e8edf6] text-[#0a1730]'
      }`}
    >
      <div className="flex items-start gap-2.5">
        {/* Avatar Circular con Iniciales */}
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-full bg-[#eef2f9] border border-[#dde5f1] flex items-center justify-center font-bold text-xs text-[#0a1730]">
            {lead.name ? lead.name.slice(0, 2).toUpperCase() : 'LE'}
          </div>
          <span
            className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white"
            style={{ backgroundColor: dotColor }}
            title={`Etapa: ${lead.stage}`}
          />
        </div>

        {/* Datos de la Conversación */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className={`text-[9px] font-black uppercase px-1 rounded ${
                  isWhatsApp ? 'bg-[#eaf7ef] text-[#157a41]' : 'bg-[#ebf1ff] text-[#0038d8]'
                }`}
              >
                {isWhatsApp ? 'WA' : 'WEB'}
              </span>
              <h4 className="text-[13.5px] font-bold text-[#0a1730] truncate">
                {lead.name || 'Sin Nombre'}
              </h4>
            </div>
            <span className="font-mono text-[10.5px] text-[#8391aa] shrink-0">
              {timeStr}
            </span>
          </div>

          <p className="text-[12px] text-[#42506b] truncate mb-1">
            {lead.last_message || 'Sin mensajes recientes'}
          </p>

          <div className="flex items-center justify-between text-[10.5px]">
            <span className="font-mono text-[#157a41] font-medium tracking-tight">
              {isWhatsApp ? 'ventana abierta (24h)' : lead.phone || 'chat web'}
            </span>

            {lead.deal_value > 0 && (
              <span className="font-mono font-bold text-[#0038d8]">
                ${lead.deal_value.toLocaleString()} MXN
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
