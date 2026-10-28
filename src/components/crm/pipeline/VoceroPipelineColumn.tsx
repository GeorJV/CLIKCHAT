import React from 'react';
import { CrmLead, CrmStage, CrmStageId } from '../../../types/crm';
import { VoceroLeadCard } from './VoceroLeadCard';
import { useVoceroMode } from '../../../hooks/useVoceroMode';

interface VoceroPipelineColumnProps {
  stage: CrmStage;
  leads: CrmLead[];
  onSelectLead: (id: string) => void;
  onChangeStage: (id: string, stage: CrmStageId) => void;
  className?: string;
}

export const VoceroPipelineColumn: React.FC<VoceroPipelineColumnProps> = ({
  stage,
  leads,
  onSelectLead,
  onChangeStage,
  className = '',
}) => {
  const { isVoceroMode } = useVoceroMode();
  const stageLeads = leads.filter(l => l.stage === stage.id);
  const totalValue = stageLeads.reduce((acc, curr) => acc + (curr.deal_value || 0), 0);

  return (
    <div
      className={`flex h-full flex-col font-sans overflow-hidden border-r last:border-r-0 ${
        isVoceroMode ? 'bg-white border-[#e8edf6]' : 'bg-[#151414] border-[#262424]'
      } ${className || 'flex-1 min-w-[280px] shrink-0'}`}
    >
      {/* Cabecera de Columna al Ras (Sin márgenes exteriores) */}
      <div
        className={`flex items-center justify-between border-b px-4 py-3 shrink-0 ${
          isVoceroMode ? 'bg-white border-[#e8edf6]' : 'bg-[#181717] border-[#262424]'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`text-[13.5px] font-bold tracking-tight truncate ${
              isVoceroMode ? 'text-[#0a1730]' : 'text-white'
            }`}
          >
            {stage.title}
          </span>
          <span
            className={`rounded-full border px-2 py-0.5 font-mono text-[11px] font-bold ${
              isVoceroMode
                ? 'border-[#dde5f1] bg-[#f1f5f9] text-[#42506b]'
                : 'border-[#333131] bg-[#201f1f] text-zinc-300'
            }`}
          >
            {stageLeads.length}
          </span>
        </div>
        {totalValue > 0 && (
          <span
            className={`font-mono text-[11.5px] font-bold ${
              isVoceroMode ? 'text-[#0038d8]' : 'text-emerald-400'
            }`}
          >
            ${totalValue.toLocaleString()} MXN
          </span>
        )}
      </div>

      {/* Lista de Leads (Ancho Completo de la Columna) */}
      <div
        className={`flex-1 space-y-2.5 overflow-y-auto p-3 ${
          isVoceroMode ? 'bg-[#f6f8fc]' : 'bg-[#121111]'
        }`}
      >
        {stageLeads.length === 0 ? (
          <div
            className={`py-12 text-center text-xs font-medium ${
              isVoceroMode ? 'text-[#8391aa]' : 'text-zinc-500'
            }`}
          >
            Sin tratos en esta etapa
          </div>
        ) : (
          stageLeads.map((lead) => (
            <VoceroLeadCard
              key={lead.id}
              lead={lead}
              onSelectLead={onSelectLead}
              onChangeStage={onChangeStage}
            />
          ))
        )}
      </div>

      {/* Pie de Columna con Subtotal */}
      <div
        className={`border-t px-4 py-2.5 text-[11px] font-mono text-right font-bold shrink-0 ${
          isVoceroMode
            ? 'border-[#e8edf6] bg-white text-[#42506b]'
            : 'border-[#262424] bg-[#181717] text-zinc-400'
        }`}
      >
        {totalValue > 0 ? `Subtotal: $${totalValue.toLocaleString()} MXN` : 'Sin monto registrado'}
      </div>
    </div>
  );
};
