import React from 'react';
import { MessageSquareText, ChevronRight, ChevronLeft } from 'lucide-react';
import { CrmLead, CRM_STAGES, CrmStageId } from '../../../types/crm';
import { VoceroLeadScorePill } from '../common/VoceroLeadScorePill';

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
  const stageIndex = CRM_STAGES.findIndex(s => s.id === lead.stage);

  const timeStr = lead.last_message_at
    ? new Date(lead.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Sin actividad';

  return (
    <div
      onClick={() => onSelectLead(lead.id)}
      className="cursor-pointer rounded-lg border border-[#dde5f1] bg-white p-3 shadow-xs hover:shadow-md transition-shadow font-sans select-none space-y-2"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eef2f9] text-[11px] font-bold text-[#0a1730]">
          {lead.name ? lead.name.slice(0, 2).toUpperCase() : 'LE'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold text-[#0a1730]">
            {lead.name || 'Sin Nombre'}
          </p>
          <p className="font-mono text-[10.5px] text-[#8391aa]">
            {timeStr}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectLead(lead.id);
          }}
          title="Abrir conversación"
          className="rounded p-1 text-[#8391aa] hover:bg-[#ebf1ff] hover:text-[#0038d8] transition"
        >
          <MessageSquareText className="h-4 w-4" />
        </button>
      </div>

      {/* Score, Monto y Botones de Etapa */}
      <div className="flex items-center justify-between border-t border-[#f0f4fa] pt-1.5 text-xs">
        <div className="flex items-center gap-1.5 min-w-0">
          <VoceroLeadScorePill lead={lead} />
          {lead.deal_value > 0 && (
            <span className="font-mono text-[11px] font-bold text-[#0038d8] truncate">
              ${lead.deal_value.toLocaleString()} MXN
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {stageIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChangeStage(lead.id, CRM_STAGES[stageIndex - 1].id);
              }}
              title="Mover atrás"
              className="p-1 rounded hover:bg-[#f6f8fc] text-[#8391aa]"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          )}
          {stageIndex < CRM_STAGES.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChangeStage(lead.id, CRM_STAGES[stageIndex + 1].id);
              }}
              title="Mover adelante"
              className="p-1 rounded bg-[#ebf1ff] hover:bg-[#d3e2ff] text-[#0038d8]"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
