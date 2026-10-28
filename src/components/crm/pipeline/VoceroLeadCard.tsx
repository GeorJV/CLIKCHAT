import React from 'react';
import { MessageSquareText, ChevronRight, ChevronLeft } from 'lucide-react';
import { CrmLead, CRM_STAGES, CrmStageId } from '../../../types/crm';
import { VoceroLeadScorePill } from '../common/VoceroLeadScorePill';
import { useVoceroMode } from '../../../hooks/useVoceroMode';

interface VoceroLeadCardProps {
  lead: CrmLead;
  onSelectLead: (id: string) => void;
  onChangeStage: (id: string, stage: CrmStageId) => void;
}

export const VoceroLeadCard: React.FC<VoceroLeadCardProps> = ({
  lead,
  onSelectLead,
  onChangeStage,
}) => {
  const { isVoceroMode } = useVoceroMode();
  const stageIndex = CRM_STAGES.findIndex(s => s.id === lead.stage);
  const isWhatsApp = lead.channel === 'whatsapp';

  const timeStr = lead.last_message_at
    ? new Date(lead.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Sin actividad';

  return (
    <div
      onClick={() => onSelectLead(lead.id)}
      className={`cursor-pointer w-full rounded-xl border p-3 shadow-xs hover:shadow-md transition-all font-sans select-none space-y-2.5 ${
        isVoceroMode
          ? 'bg-white border-[#dde5f1] hover:border-[#b4c7e7]'
          : 'bg-[#1a1919] border-[#2d2a2a] hover:border-[#3d3a3a]'
      }`}
    >
      {/* Cabecera del Lead */}
      <div className="flex items-center gap-2.5">
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold border ${
            isVoceroMode
              ? 'bg-[#eef2f9] border-[#dde5f1] text-[#0a1730]'
              : 'bg-[#252424] border-[#383636] text-white'
          }`}
        >
          {lead.name ? lead.name.slice(0, 2).toUpperCase() : 'LE'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`text-[9px] font-black uppercase px-1 rounded shrink-0 ${
                isWhatsApp ? 'bg-[#eaf7ef] text-[#157a41]' : 'bg-[#ebf1ff] text-[#0038d8]'
              }`}
            >
              {isWhatsApp ? 'WA' : 'WEB'}
            </span>
            <p
              className={`truncate text-[13.5px] font-bold ${
                isVoceroMode ? 'text-[#0a1730]' : 'text-white'
              }`}
            >
              {lead.name || 'Nuevo Lead'}
            </p>
          </div>
          <p
            className={`font-mono text-[10.5px] truncate mt-0.5 ${
              isVoceroMode ? 'text-[#8391aa]' : 'text-zinc-500'
            }`}
          >
            {lead.phone ? `${lead.phone} • ` : ''}{timeStr}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectLead(lead.id);
          }}
          title="Abrir conversación en bandeja"
          className={`rounded-lg p-1.5 transition shrink-0 cursor-pointer ${
            isVoceroMode
              ? 'text-[#8391aa] hover:bg-[#ebf1ff] hover:text-[#0038d8]'
              : 'text-zinc-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <MessageSquareText className="h-4 w-4" />
        </button>
      </div>

      {/* Vista Previa del Mensaje (Directo y Visible al Usuario) */}
      <div
        className={`rounded-lg px-2.5 py-2 text-left border ${
          isVoceroMode
            ? 'bg-[#f8fafc] border-[#edf2f7]'
            : 'bg-[#151414] border-[#292727]'
        }`}
      >
        <p
          className={`text-[12px] line-clamp-2 leading-relaxed break-words font-normal ${
            isVoceroMode ? 'text-[#334155]' : 'text-zinc-300'
          }`}
          title={lead.last_message || 'Sin mensajes recientes'}
        >
          {lead.last_message || 'Chat iniciado (sin mensajes aún)'}
        </p>
      </div>

      {/* Score, Monto y Botones de Etapa */}
      <div
        className={`flex items-center justify-between border-t pt-2 text-xs ${
          isVoceroMode ? 'border-[#f0f4fa]' : 'border-[#262424]'
        }`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <VoceroLeadScorePill lead={lead} />
          {lead.deal_value > 0 && (
            <span
              className={`font-mono text-[11px] font-bold truncate ${
                isVoceroMode ? 'text-[#0038d8]' : 'text-emerald-400'
              }`}
            >
              ${lead.deal_value.toLocaleString()} MXN
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {stageIndex > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChangeStage(lead.id, CRM_STAGES[stageIndex - 1].id);
              }}
              title={`Mover a ${CRM_STAGES[stageIndex - 1].title}`}
              className={`p-1 rounded transition cursor-pointer ${
                isVoceroMode
                  ? 'hover:bg-[#f1f5f9] text-[#8391aa]'
                  : 'hover:bg-white/10 text-zinc-400'
              }`}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          )}
          {stageIndex < CRM_STAGES.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChangeStage(lead.id, CRM_STAGES[stageIndex + 1].id);
              }}
              title={`Mover a ${CRM_STAGES[stageIndex + 1].title}`}
              className={`p-1 rounded transition cursor-pointer ${
                isVoceroMode
                  ? 'bg-[#ebf1ff] hover:bg-[#d3e2ff] text-[#0038d8]'
                  : 'bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300'
              }`}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
