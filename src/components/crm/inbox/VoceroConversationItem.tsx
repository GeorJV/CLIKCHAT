import React from 'react';
import { MessageSquare, Bot, UserCheck, Clock, ShieldAlert } from 'lucide-react';
import { CrmLead, CRM_STAGES } from '../../../types/crm';

interface VoceroConversationItemProps {
  lead: CrmLead;
  isSelected: boolean;
  onSelect: (leadId: string) => void;
}

export const VoceroConversationItem: React.FC<VoceroConversationItemProps> = ({
  lead,
  isSelected,
  onSelect,
}) => {
  const stage = CRM_STAGES.find(s => s.id === lead.stage) || CRM_STAGES[0];
  const isWhatsApp = lead.channel === 'whatsapp';

  // Cálculo de ventana de 24 horas de WhatsApp (Regla de Meta)
  const calculateWhatsAppWindow = () => {
    if (!isWhatsApp || !lead.last_message_at) return null;
    const lastMsgTime = new Date(lead.last_message_at).getTime();
    const diffHours = (Date.now() - lastMsgTime) / (1000 * 60 * 60);
    const remainingHours = Math.max(0, 24 - diffHours);

    if (remainingHours <= 0) {
      return { expired: true, text: 'Ventana 24h expirada' };
    }
    const hours = Math.floor(remainingHours);
    const mins = Math.floor((remainingHours - hours) * 60);
    return { expired: false, text: `${hours}h ${mins}m restantes` };
  };

  const waWindow = calculateWhatsAppWindow();

  return (
    <div
      onClick={() => onSelect(lead.id)}
      className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
        isSelected
          ? 'bg-zinc-800/90 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20'
          : 'bg-zinc-900/60 hover:bg-zinc-800/60 border-zinc-800/80 hover:border-zinc-700'
      }`}
    >
      <div className="flex items-start gap-2.5">
        {/* Avatar con Badge de Canal */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-white">
            {lead.name ? lead.name.slice(0, 2).toUpperCase() : 'LE'}
          </div>
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] shadow-sm ${
              isWhatsApp ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
            }`}
          >
            {isWhatsApp ? 'WA' : 'WEB'}
          </div>
        </div>

        {/* Información del Lead */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <h4 className="text-xs font-bold text-white truncate">{lead.name || 'Sin Nombre'}</h4>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${stage.bgLight} ${stage.color} ${stage.borderColor}`}>
              {stage.title}
            </span>
          </div>

          <p className="text-[11px] text-zinc-400 truncate mb-1.5">
            {lead.last_message || 'Sin mensajes recientes'}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            {/* Estado de IA / Humano */}
            <span
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                lead.ai_paused
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}
            >
              {lead.ai_paused ? <UserCheck className="w-2.5 h-2.5" /> : <Bot className="w-2.5 h-2.5" />}
              <span>{lead.ai_paused ? 'Humano' : 'Bot Activo'}</span>
            </span>

            {/* Ventana de 24h WhatsApp */}
            {waWindow && (
              <span
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono border ${
                  waWindow.expired
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                }`}
              >
                {waWindow.expired ? <ShieldAlert className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5 text-emerald-400" />}
                <span>{waWindow.text}</span>
              </span>
            )}

            {/* Deal Value */}
            {lead.deal_value > 0 && (
              <span className="font-mono font-bold text-emerald-400 ml-auto">
                ${lead.deal_value.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
