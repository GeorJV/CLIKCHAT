import React from 'react';
import { ChevronRight, ChevronLeft, MessageSquare, Bot, UserCheck, DollarSign } from 'lucide-react';
import { CrmLead, CRM_STAGES, CrmStageId } from '../../../types/crm';

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
  const isWhatsApp = lead.channel === 'whatsapp';
  const stageIndex = CRM_STAGES.findIndex(s => s.id === lead.stage);

  const handlePrevStage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stageIndex > 0) {
      onChangeStage(lead.id, CRM_STAGES[stageIndex - 1].id);
    }
  };

  const handleNextStage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stageIndex < CRM_STAGES.length - 1) {
      onChangeStage(lead.id, CRM_STAGES[stageIndex + 1].id);
    }
  };

  return (
    <div
      onClick={() => onSelectLead(lead.id)}
      className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition shadow-sm hover:shadow-md cursor-pointer group space-y-2.5"
    >
      {/* Cabecera de la Tarjeta */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-white shrink-0">
            {lead.name ? lead.name.slice(0, 2).toUpperCase() : 'LE'}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition">
              {lead.name || 'Sin Nombre'}
            </h4>
            <p className="text-[10px] text-zinc-400 font-mono truncate">{lead.phone || 'Sin Teléfono'}</p>
          </div>
        </div>

        <span
          className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
            isWhatsApp ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
          }`}
        >
          {isWhatsApp ? 'WhatsApp' : 'Web'}
        </span>
      </div>

      {/* Snippet de Último Mensaje */}
      {lead.last_message && (
        <p className="text-[11px] text-zinc-400 line-clamp-2 italic bg-zinc-950/60 p-1.5 rounded-lg border border-zinc-800/60">
          "{lead.last_message}"
        </p>
      )}

      {/* Tags Chips */}
      {lead.tags && lead.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {lead.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              {tag}
            </span>
          ))}
          {lead.tags.length > 3 && (
            <span className="text-[9px] text-zinc-500">+{lead.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Pie con Valor del Trato y Controles de Avance */}
      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 font-mono font-bold text-emerald-400">
          {lead.deal_value > 0 ? (
            <span>${lead.deal_value.toLocaleString()}</span>
          ) : (
            <span className="text-zinc-600 font-normal text-[10px]">Sin valor</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {stageIndex > 0 && (
            <button
              onClick={handlePrevStage}
              title="Retroceder etapa"
              className="p-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
          )}
          {stageIndex < CRM_STAGES.length - 1 && (
            <button
              onClick={handleNextStage}
              title="Avanzar etapa"
              className="p-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition cursor-pointer"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
