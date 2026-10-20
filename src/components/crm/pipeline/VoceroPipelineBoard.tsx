import React, { useState } from 'react';
import { Plus, TrendingUp, DollarSign, Award, Target } from 'lucide-react';
import { CrmLead, CRM_STAGES, CrmStageId } from '../../../types/crm';
import { VoceroPipelineColumn } from './VoceroPipelineColumn';
import { VoceroNewLeadModal } from './VoceroNewLeadModal';

interface VoceroPipelineBoardProps {
  leads: CrmLead[];
  onSelectLead: (id: string) => void;
  onChangeStage: (id: string, stage: CrmStageId) => void;
  onCreateLead: (data: Partial<CrmLead>) => void;
}

export const VoceroPipelineBoard: React.FC<VoceroPipelineBoardProps> = ({
  leads,
  onSelectLead,
  onChangeStage,
  onCreateLead,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Métricas consolidadas del pipeline
  const totalValue = leads.reduce((acc, curr) => acc + (curr.deal_value || 0), 0);
  const wonValue = leads.filter(l => l.stage === 'won').reduce((acc, curr) => acc + (curr.deal_value || 0), 0);
  const activeLeadsCount = leads.filter(l => l.stage !== 'lost' && l.stage !== 'won').length;
  const wonCount = leads.filter(l => l.stage === 'won').length;

  return (
    <div className="flex flex-col h-full bg-zinc-950 font-sans p-4 space-y-4 overflow-hidden">
      {/* Barra Superior de Métricas de Pipeline */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 sm:px-4 sm:py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-md">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Valor Pipeline</p>
              <p className="text-sm sm:text-base font-black text-white font-mono">${totalValue.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">En Negociación</p>
              <p className="text-sm sm:text-base font-black text-white font-mono">{activeLeadsCount} Leads</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Cerrado Ganado</p>
              <p className="text-sm sm:text-base font-black text-emerald-400 font-mono">${wonValue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nuevo Lead</span>
        </button>
      </div>

      {/* Tablero Kanban con Columnas Horizontales */}
      <div className="flex-1 flex gap-3.5 overflow-x-auto pb-2 scrollbar-thin">
        {CRM_STAGES.map(stage => (
          <VoceroPipelineColumn
            key={stage.id}
            stage={stage}
            leads={leads}
            onSelectLead={onSelectLead}
            onChangeStage={onChangeStage}
          />
        ))}
      </div>

      {/* Modal para Crear Lead */}
      <VoceroNewLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateLead={onCreateLead}
      />
    </div>
  );
};
