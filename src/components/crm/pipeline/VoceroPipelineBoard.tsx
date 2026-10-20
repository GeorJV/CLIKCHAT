import React, { useState } from 'react';
import { Plus, Sparkles, CheckCircle, Zap } from 'lucide-react';
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
  const [modalOpen, setModalOpen] = useState(false);
  const [triggerToast, setTriggerToast] = useState<string | null>(null);

  const totalValue = leads.reduce((acc, curr) => acc + (curr.deal_value || 0), 0);

  const handleStageChange = (id: string, stage: CrmStageId) => {
    onChangeStage(id, stage);
    if (stage === 'won') {
      setTriggerToast('🎉 ¡Trato cerrado con éxito! Comanda registrada para despacho.');
    } else if (stage === 'proposal') {
      setTriggerToast('⚡ Automatización Kanban: Seguimiento de propuesta activado.');
    } else if (stage === 'lost') {
      setTriggerToast('📦 Lead en pausa: Disponible para Reactivación en 1-Clic.');
    }
    setTimeout(() => setTriggerToast(null), 4000);
  };

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] font-sans overflow-hidden relative">
      {/* Cabecera idéntica a Vocero Pipeline */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-5 shadow-xs">
        <div className="flex items-center gap-3">
          <h2 className="text-[17px] font-bold tracking-tight text-[#0a1730]">Pipeline</h2>
          <span className="rounded-full border border-[#dde5f1] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#0038d8] bg-[#ebf1ff]">
            Total: ${totalValue.toLocaleString()} MXN
          </span>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-full bg-[#0d5bff] hover:bg-[#0a4de6] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Nuevo Trato</span>
        </button>
      </header>

      {/* Disparador Automatizado Toast */}
      {triggerToast && (
        <div className="absolute top-16 right-6 z-40 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3.5 py-2 text-xs font-bold text-[#0a1730] shadow-lg ring-1 ring-blue-500/20">
            <Zap className="h-3.5 w-3.5 text-[#0d5bff]" />
            <span>{triggerToast}</span>
          </div>
        </div>
      )}

      {/* Columnas Horizontales */}
      <div className="flex-1 flex gap-3 overflow-x-auto p-4 snap-x scrollbar-thin bg-[#f6f8fc]">
        {CRM_STAGES.map((stage) => (
          <VoceroPipelineColumn
            key={stage.id}
            stage={stage}
            leads={leads}
            onSelectLead={onSelectLead}
            onChangeStage={handleStageChange}
          />
        ))}
      </div>

      <VoceroNewLeadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreateLead={onCreateLead}
      />
    </div>
  );
};
