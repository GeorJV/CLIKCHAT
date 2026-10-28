import React, { useState } from 'react';
import { Plus, Zap } from 'lucide-react';
import { CrmLead, CRM_STAGES, CrmStageId, getCrmStages } from '../../../types/crm';
import { VoceroPipelineColumn } from './VoceroPipelineColumn';
import { VoceroNewLeadModal } from './VoceroNewLeadModal';
import { useVoceroMode } from '../../../hooks/useVoceroMode';

interface VoceroPipelineBoardProps {
  leads: CrmLead[];
  onSelectLead: (id: string) => void;
  onChangeStage: (id: string, stage: CrmStageId) => void;
  onCreateLead: (data: Partial<CrmLead>) => void;
  businessType?: string;
}

export const VoceroPipelineBoard: React.FC<VoceroPipelineBoardProps> = ({
  leads, onSelectLead, onChangeStage, onCreateLead, businessType
}) => {
  const { isVoceroMode } = useVoceroMode();
  const isServices = businessType === 'servicios' || businessType === 'citas' || businessType === 'servicios_citas';
  const stages = getCrmStages(businessType);
  const [modalOpen, setModalOpen] = useState(false), [triggerToast, setTriggerToast] = useState<string | null>(null);
  const [activeEtapa, setActiveEtapa] = useState<1 | 2>(1), [isAnimating, setIsAnimating] = useState(false);
  const [animPhase, setAnimPhase] = useState<'idle' | 'slide-out-right' | 'prep-from-right' | 'slide-in-left'>('idle');

  const totalValue = leads.reduce((acc, curr) => acc + (curr.deal_value || 0), 0);

  const handleStageChange = (id: string, stage: CrmStageId) => {
    onChangeStage(id, stage);
    if (stage === 'won') setTriggerToast(isServices ? '🎉 ¡Trato cerrado con éxito! Cita registrada.' : '🎉 ¡Trato cerrado con éxito! Comanda registrada.');
    else if (stage === 'proposal') setTriggerToast(isServices ? '⚡ Seguimiento activado: Cita agendada.' : '⚡ Automatización Kanban: Seguimiento activado.');
    else if (stage === 'lost') setTriggerToast('📦 Lead en pausa: Disponible para Reactivación.');
    setTimeout(() => setTriggerToast(null), 4000);
  };

  const handleSwitchEtapa = (target: 1 | 2) => {
    if (target === activeEtapa || isAnimating) return;
    setIsAnimating(true);
    setAnimPhase('slide-out-right');

    setTimeout(() => {
      setActiveEtapa(target);
      setAnimPhase('prep-from-right');
      setTimeout(() => {
        setAnimPhase('slide-in-left');
        setTimeout(() => { setAnimPhase('idle'); setIsAnimating(false); }, 400);
      }, 40);
    }, 280);
  };

  const displayedStages = activeEtapa === 1 ? stages.slice(0, 3) : stages.slice(3, 6);

  const getAnimClass = () => {
    if (animPhase === 'slide-out-right') return 'translate-x-[110%] opacity-0 scale-[0.98] duration-300 ease-in pointer-events-none';
    if (animPhase === 'prep-from-right') return 'translate-x-[110%] opacity-0 scale-[0.98] duration-0 pointer-events-none';
    if (animPhase === 'slide-in-left') return 'translate-x-0 opacity-100 scale-100 duration-400 ease-out';
    return 'translate-x-0 opacity-100 scale-100';
  };

  return (
    <div className={`flex flex-col h-full font-sans overflow-hidden relative ${isVoceroMode ? 'bg-[#f6f8fc]' : 'bg-[#151414] text-slate-100'}`}>
      {/* Cabecera con Pipeline + Selector de Etapas Centrado */}
      <header className={`flex h-14 shrink-0 items-center justify-between px-5 shadow-xs gap-3 border-b ${
        isVoceroMode ? 'border-[#e8edf6] bg-white' : 'border-[#262424] bg-[#181717]'
      }`}>
        <div className="flex items-center gap-3 shrink-0">
          <h2 className={`text-[17px] font-bold tracking-tight ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>Pipeline</h2>
          <span className={`hidden sm:inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-bold ${
            isVoceroMode ? 'border-[#dde5f1] text-[#0038d8] bg-[#ebf1ff]' : 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10'
          }`}>
            Total: ${totalValue.toLocaleString()} MXN
          </span>
        </div>

        {/* Botones Centrados y Bonitos: Etapa 1 (1-3) y Etapa 2 (4-6) */}
        <div className="flex-1 flex justify-center items-center">
          <div className={`inline-flex items-center p-1 rounded-2xl shadow-2xs border ${
            isVoceroMode ? 'bg-[#f1f5f9] border-[#d8e2f0]' : 'bg-[#121111] border-[#2c2a2a]'
          }`}>
            <button
              type="button"
              onClick={() => handleSwitchEtapa(1)}
              disabled={isAnimating}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeEtapa === 1
                  ? (isVoceroMode ? 'bg-white text-[#0d5bff] shadow-sm scale-[1.02]' : 'bg-emerald-600 text-white shadow-sm scale-[1.02]')
                  : (isVoceroMode ? 'text-[#62728d] hover:text-[#0a1730] hover:bg-white/60' : 'text-zinc-400 hover:text-white hover:bg-[#1a1919]')
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                activeEtapa === 1 ? (isVoceroMode ? 'bg-[#0d5bff] animate-pulse' : 'bg-emerald-400 animate-pulse') : 'bg-slate-300'
              }`} />
              <span>{activeEtapa === 1 ? 'En Etapa 1' : 'Etapa 1'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                activeEtapa === 1 ? (isVoceroMode ? 'bg-[#ebf1ff] text-[#0d5bff]' : 'bg-emerald-700 text-white') : (isVoceroMode ? 'bg-slate-200/70 text-[#8391aa]' : 'bg-[#1e1d1d] text-zinc-400')
              }`}>
                1 - 3
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchEtapa(2)}
              disabled={isAnimating}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeEtapa === 2
                  ? (isVoceroMode ? 'bg-white text-[#0d5bff] shadow-sm scale-[1.02]' : 'bg-emerald-600 text-white shadow-sm scale-[1.02]')
                  : (isVoceroMode ? 'text-[#62728d] hover:text-[#0a1730] hover:bg-white/60' : 'text-zinc-400 hover:text-white hover:bg-[#1a1919]')
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                activeEtapa === 2 ? (isVoceroMode ? 'bg-[#0d5bff] animate-pulse' : 'bg-emerald-400 animate-pulse') : 'bg-slate-300'
              }`} />
              <span>{activeEtapa === 2 ? 'En Etapa 2' : 'Etapa 2'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                activeEtapa === 2 ? (isVoceroMode ? 'bg-[#ebf1ff] text-[#0d5bff]' : 'bg-emerald-700 text-white') : (isVoceroMode ? 'bg-slate-200/70 text-[#8391aa]' : 'bg-[#1e1d1d] text-zinc-400')
              }`}>
                4 - 6
              </span>
            </button>
          </div>
        </div>

        <div className="shrink-0">
          <button
            onClick={() => setModalOpen(true)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition cursor-pointer ${
              isVoceroMode ? 'bg-[#0d5bff] hover:bg-[#0a4de6]' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Nuevo Trato</span>
            <span className="sm:hidden">Nuevo</span>
          </button>
        </div>
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

      {/* Columnas Contiguas Tipo Bandeja con Animación Suave Carrusel */}
      <div className={`flex-1 overflow-x-auto overflow-y-hidden relative ${isVoceroMode ? 'bg-white' : 'bg-[#151414]'}`}>
        <div
          className={`flex h-full w-full divide-x ${isVoceroMode ? 'divide-[#e8edf6]' : 'divide-[#262424]'} transition-all ${getAnimClass()}`}
          style={{
            transitionTimingFunction: animPhase === 'slide-in-left' ? 'cubic-bezier(0.16, 1, 0.3, 1)' : 'cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {displayedStages.map((stage) => (
            <VoceroPipelineColumn
              key={stage.id}
              stage={stage}
              leads={leads}
              onSelectLead={onSelectLead}
              onChangeStage={handleStageChange}
              className="flex-1 min-w-[280px] h-full"
            />
          ))}
        </div>
      </div>

      <VoceroNewLeadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreateLead={onCreateLead}
        businessType={businessType}
      />
    </div>
  );
};
