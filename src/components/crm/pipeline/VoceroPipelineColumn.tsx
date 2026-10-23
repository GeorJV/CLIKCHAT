import React from 'react';
import { CrmLead, CrmStage, CrmStageId } from '../../../types/crm';
import { VoceroLeadCard } from './VoceroLeadCard';

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
  const stageLeads = leads.filter(l => l.stage === stage.id);
  const totalValue = stageLeads.reduce((acc, curr) => acc + (curr.deal_value || 0), 0);

  return (
    <div className={`flex h-full flex-col rounded-xl border border-[#dde5f1] bg-[#f6f8fc] font-sans overflow-hidden ${className || 'w-64 shrink-0 snap-start'}`}>
      {/* Cabecera idéntica a Vocero StageColumn */}
      <div className="flex items-center justify-between border-b border-[#dde5f1] bg-white px-3 py-2.5">
        <span className="text-[13.5px] font-bold tracking-tight text-[#0a1730]">
          {stage.title}
        </span>
        <span className="rounded-full border border-[#dde5f1] bg-white px-2 py-0.5 font-mono text-[11px] text-[#8391aa]">
          {stageLeads.length}
        </span>
      </div>

      {/* Lista de Leads */}
      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        {stageLeads.length === 0 ? (
          <div className="py-8 text-center text-[#8391aa] text-[11.5px]">
            Sin tratos en esta etapa
          </div>
        ) : (
          stageLeads.map(lead => (
            <VoceroLeadCard
              key={lead.id}
              lead={lead}
              onSelectLead={onSelectLead}
              onChangeStage={onChangeStage}
            />
          ))
        )}
      </div>

      {/* Pie de Columna con Total */}
      <div className="border-t border-[#dde5f1] bg-white px-3 py-2 text-[11px] font-mono text-right text-[#42506b] font-bold">
        {totalValue > 0 ? `$${totalValue.toLocaleString()} MXN` : '—'}
      </div>
    </div>
  );
};
