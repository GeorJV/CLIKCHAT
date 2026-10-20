import React from 'react';
import { CrmLead, CrmStage, CrmStageId } from '../../../types/crm';
import { VoceroLeadCard } from './VoceroLeadCard';

interface VoceroPipelineColumnProps {
  stage: CrmStage;
  leads: CrmLead[];
  onSelectLead: (id: string) => void;
  onChangeStage: (id: string, stage: CrmStageId) => void;
}

export const VoceroPipelineColumn: React.FC<VoceroPipelineColumnProps> = ({
  stage,
  leads,
  onSelectLead,
  onChangeStage,
}) => {
  const stageLeads = leads.filter(l => l.stage === stage.id);
  const totalValue = stageLeads.reduce((acc, curr) => acc + (curr.deal_value || 0), 0);

  return (
    <div className="w-72 shrink-0 flex flex-col h-full bg-zinc-950/80 rounded-2xl border border-zinc-800/80 overflow-hidden">
      {/* Cabecera de la Columna */}
      <div className="p-3 border-b border-zinc-800/80 bg-zinc-900/50 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${stage.color.replace('text-', 'bg-')}`} />
            <h3 className="text-xs font-bold text-white tracking-tight">{stage.title}</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-bold border border-zinc-700">
            {stageLeads.length}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <span className="text-[10px] text-zinc-500 truncate max-w-[150px]">{stage.description}</span>
          {totalValue > 0 && (
            <span className="font-mono font-bold text-emerald-400 text-xs">
              ${totalValue.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Lista de Tarjetas con Scroll */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
        {stageLeads.length === 0 ? (
          <div className="h-28 flex flex-col items-center justify-center text-center p-3 border border-dashed border-zinc-800/80 rounded-xl text-zinc-600">
            <p className="text-[11px] font-medium">Sin leads en esta etapa</p>
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
    </div>
  );
};
