import React from 'react';
import { Search, X, Inbox, Plus } from 'lucide-react';
import { CrmLead, CrmInboxFilter } from '../../../types/crm';
import { VoceroConversationItem } from './VoceroConversationItem';
import { LiveVisitorsBar } from '../presence/LiveVisitorsBar';

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
    const term = (searchTerm || '').toLowerCase();
    const name = (l.name || '').toLowerCase();
    const phone = l.phone || '';
    const lastMsg = (l.last_message || '').toLowerCase();
    const matchesSearch =
      name.includes(term) ||
      phone.includes(term) ||
      lastMsg.includes(term);
    if (!matchesSearch) return false;

    if (filterInbox === 'whatsapp') return l.channel === 'whatsapp';
    if (filterInbox === 'web') return l.channel === 'web';
    if (filterInbox === 'human_needed') return l.ai_paused === true;
    if (filterInbox === 'won') return l.stage === 'won';
    return true;
  });

  const FILTROS = [
    { id: 'all' as CrmInboxFilter, label: 'Todas' },
    { id: 'human_needed' as CrmInboxFilter, label: 'Humano' },
    { id: 'whatsapp' as CrmInboxFilter, label: 'WhatsApp' },
    { id: 'won' as CrmInboxFilter, label: 'Ganadas' },
  ];

  return (
    <div className="flex h-full flex-col bg-white border-r border-[#e8edf6] select-none font-sans">
      {/* Cabecera idéntica a Vocero */}
      <header className="border-b border-[#e8edf6] px-4 pb-3 pt-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-[17px] font-bold tracking-tight text-[#0a1730]">Bandeja</h2>
            <span className="font-mono text-[12px] text-[#8391aa]">{leads.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <LiveVisitorsBar onSelectLeadChat={onSelectLead} />
            <button
              onClick={onOpenNewLeadModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ebf1ff] hover:bg-[#d3e2ff] text-[#0038d8] text-[11.5px] font-bold transition cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Nuevo</span>
            </button>
          </div>
        </div>

        {/* Buscador Redondeado Vocero */}
        <div className="flex items-center gap-2 rounded-full border border-[#dde5f1] bg-white px-3.5 py-[6px] shadow-sm focus-within:border-[#0d5bff] focus-within:ring-2 focus-within:ring-[#d3e2ff]">
          <Search className="h-3.5 w-3.5 shrink-0 text-[#8391aa]" strokeWidth={1.8} />
          <input
            value={searchTerm}
            onChange={(e) => onSetSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o teléfono…"
            className="w-full bg-transparent text-[12.5px] outline-none text-[#0a1730] placeholder:text-[#8391aa]"
          />
          {searchTerm && (
            <button onClick={() => onSetSearchTerm('')} className="p-0.5 text-[#8391aa] hover:text-[#0a1730]">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Pestañas de Filtro Redondeadas (Foco Separado Vocero) */}
      <div className="flex items-center gap-1.5 border-b border-[#e8edf6] px-4 py-2 overflow-x-auto scrollbar-none bg-[#f6f8fc]">
        {FILTROS.map((f) => {
          const active = filterInbox === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onSetFilterInbox(f.id)}
              className={`flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11.5px] font-semibold transition-colors cursor-pointer ${
                active
                  ? 'border-[#0d5bff] bg-[#0d5bff] text-white shadow-sm'
                  : 'border-[#dde5f1] bg-white text-[#42506b] hover:border-[#8391aa]'
              }`}
            >
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Lista de Conversaciones */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 bg-[#f6f8fc]">
        {isLoading && leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-[#8391aa] space-y-2">
            <div className="w-5 h-5 border-2 border-[#0d5bff] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">Cargando bandeja…</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-12 px-4 text-[#8391aa] space-y-1">
            <Inbox className="w-8 h-8 mx-auto text-[#dde5f1] mb-1" />
            <p className="text-xs font-semibold text-[#42506b]">Sin conversaciones</p>
            <p className="text-[11px] text-[#8391aa]">No hay contactos que coincidan con la búsqueda.</p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
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
