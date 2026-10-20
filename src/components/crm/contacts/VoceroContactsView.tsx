import React, { useState } from 'react';
import { Search, MessageSquare, Phone, Mail } from 'lucide-react';
import { CrmLead } from '../../../types/crm';

interface VoceroContactsViewProps {
  leads: CrmLead[];
  onSelectLead: (id: string) => void;
}

export const VoceroContactsView: React.FC<VoceroContactsViewProps> = ({ leads, onSelectLead }) => {
  const [search, setSearch] = useState('');

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search) ||
    l.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] font-sans overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-5 shadow-xs">
        <div className="flex items-center gap-3">
          <h2 className="text-[17px] font-bold tracking-tight text-[#0a1730]">Contactos</h2>
          <span className="font-mono text-xs text-[#8391aa]">{leads.length}</span>
        </div>

        <div className="w-64">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar contacto…"
            className="w-full rounded-full border border-[#dde5f1] bg-[#f6f8fc] px-3.5 py-1.5 text-xs text-[#0a1730] outline-none focus:border-[#0d5bff] focus:bg-white"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 max-w-5xl w-full mx-auto">
        <div className="rounded-xl border border-[#dde5f1] bg-white shadow-xs divide-y divide-[#e8edf6] overflow-hidden">
          {filtered.map(lead => (
            <div key={lead.id} className="p-3.5 flex items-center justify-between hover:bg-[#f6f8fc] transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#eef2f9] flex items-center justify-center font-bold text-xs text-[#0a1730]">
                  {lead.name ? lead.name.slice(0, 2).toUpperCase() : 'LE'}
                </div>
                <div>
                  <h4 className="font-bold text-[13.5px] text-[#0a1730]">{lead.name || 'Sin Nombre'}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-[#8391aa] font-mono mt-0.5">
                    {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</span>}
                    {lead.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ebf1ff] text-[#0038d8] uppercase">
                  {lead.stage}
                </span>
                <button
                  onClick={() => onSelectLead(lead.id)}
                  className="p-1.5 rounded-lg border border-[#dde5f1] hover:bg-[#ebf1ff] hover:text-[#0038d8] text-[#8391aa] transition cursor-pointer"
                  title="Abrir chat"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
