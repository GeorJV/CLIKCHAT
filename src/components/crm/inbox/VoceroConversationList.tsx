import React from 'react';
import { Search, Filter, MessageSquare, Plus } from 'lucide-react';
import { CrmLead, CrmInboxFilter } from '../../../types/crm';
import { VoceroConversationItem } from './VoceroConversationItem';

interface VoceroConversationListProps {
  leads: CrmLead[];
  selectedLeadId: string | null;
  onSelectLead: (id: string) => void;
  filterInbox: CrmInboxFilter;
  onSetFilterInbox: (filter: CrmInboxFilter) => void;
  searchTerm: string;
  onSetSearchTerm: (term: string) => void;
  onOpenNewLeadModal: () => void;
  isLoading: boolean;
}

export const VoceroConversationList: React.FC<VoceroConversationListProps> = ({
  leads,
  selectedLeadId,
  onSelectLead,
  filterInbox,
  onSetFilterInbox,
  searchTerm,
  onSetSearchTerm,
  onOpenNewLeadModal,
  isLoading,
}) => {
  const filteredLeads = leads.filter(l => {
    // Filtro por término de búsqueda
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      l.name.toLowerCase().includes(term) ||
      l.phone.includes(term) ||
      (l.last_message && l.last_message.toLowerCase().includes(term));
    if (!matchesSearch) return false;

    // Filtro por categoría de bandeja
    if (filterInbox === 'whatsapp') return l.channel === 'whatsapp';
    if (filterInbox === 'web') return l.channel === 'web';
    if (filterInbox === 'human_needed') return l.ai_paused === true;
    if (filterInbox === 'won') return l.stage === 'won';
    return true;
  });

  const FILTER_TABS: { id: CrmInboxFilter; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'web', label: 'Web' },
    { id: 'human_needed', label: 'Humano' },
    { id: 'won', label: 'Ganados' },
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800/80">
      {/* Cabecera con Búsqueda y Botón Nuevo Lead */}
      <div className="p-3 border-b border-zinc-800/80 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Bandeja Multicanal</h3>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
              {filteredLeads.length}
            </span>
          </div>
          <button
            onClick={onOpenNewLeadModal}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold transition cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Nuevo</span>
          </button>
        </div>

        {/* Campo de Búsqueda */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSetSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, teléfono o chat..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Pestañas de Filtro */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => onSetFilterInbox(tab.id)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold whitespace-nowrap transition cursor-pointer ${
                filterInbox === tab.id
                  ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-white bg-zinc-900/40 hover:bg-zinc-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Conversaciones */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {isLoading && leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500 space-y-2">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">Cargando conversaciones...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-10 px-4 text-zinc-500 space-y-1">
            <p className="text-xs font-semibold text-zinc-400">No hay conversaciones</p>
            <p className="text-[11px] text-zinc-600">Ningún contacto coincide con los filtros actuales.</p>
          </div>
        ) : (
          filteredLeads.map(lead => (
            <VoceroConversationItem
              key={lead.id}
              lead={lead}
              isSelected={lead.id === selectedLeadId}
              onSelect={onSelectLead}
            />
          ))
        )}
      </div>
    </div>
  );
};
