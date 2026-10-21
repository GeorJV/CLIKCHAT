import React, { useState } from 'react';
import { Search, MessageSquare, Phone, Mail, Download } from 'lucide-react';
import { CrmLead } from '../../../types/crm';

interface VoceroContactsViewProps {
  leads: CrmLead[];
  onSelectLead: (id: string) => void;
}

export const VoceroContactsView: React.FC<VoceroContactsViewProps> = ({ leads, onSelectLead }) => {
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState<'all' | 'whatsapp' | 'web'>('all');

  const filtered = leads.filter(l => {
    const term = (search || '').toLowerCase();
    const name = (l.name || '').toLowerCase();
    const phone = l.phone || '';
    const email = (l.email || '').toLowerCase();
    const matchesSearch = name.includes(term) || phone.includes(term) || email.includes(term);

    if (!matchesSearch) return false;
    if (channelFilter === 'whatsapp') return l.channel === 'whatsapp';
    if (channelFilter === 'web') return l.channel === 'web' || l.channel === 'clikchat';
    return true;
  });

  const handleExportCsv = () => {
    const headers = ['Nombre', 'Teléfono', 'Email', 'Etapa', 'Canal'];
    const rows = filtered.map(l => [
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.stage || '').replace(/"/g, '""')}"`,
      `"${(l.channel || 'web').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `contactos_clikchat_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] font-sans overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-5 shadow-xs">
        <div className="flex items-center gap-3">
          <h2 className="text-[17px] font-bold tracking-tight text-[#0a1730]">Contactos</h2>
          <span className="font-mono text-xs text-[#8391aa]">{filtered.length} / {leads.length}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Filtros de Canal */}
          <div className="flex items-center gap-1 bg-[#f1f5f9] p-0.5 rounded-lg text-xs">
            {(['all', 'whatsapp', 'web'] as const).map((ch) => (
              <button
                key={ch}
                onClick={() => setChannelFilter(ch)}
                className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer capitalize ${
                  channelFilter === ch ? 'bg-white text-[#0d5bff] shadow-xs' : 'text-[#62728d] hover:text-[#0a1730]'
                }`}
              >
                {ch === 'all' ? 'Todos' : ch === 'whatsapp' ? 'WhatsApp' : 'Web'}
              </button>
            ))}
          </div>

          <div className="w-52">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar contacto…"
              className="w-full rounded-full border border-[#dde5f1] bg-[#f6f8fc] px-3.5 py-1.5 text-xs text-[#0a1730] outline-none focus:border-[#0d5bff] focus:bg-white"
            />
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#dde5f1] bg-white text-xs font-semibold text-[#0a1730] hover:bg-[#f6f8fc] transition cursor-pointer"
            title="Exportar contactos a CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#0d5bff]" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 max-w-5xl w-full mx-auto">
        <div className="rounded-xl border border-[#dde5f1] bg-white shadow-xs divide-y divide-[#e8edf6] overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8391aa]">
              No se encontraron contactos para este filtro.
            </div>
          ) : (
            filtered.map(lead => (
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
                      <span className="text-[10px] text-[#8391aa] uppercase font-sans">({lead.channel || 'web'})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ebf1ff] text-[#0038d8] uppercase">
                    {lead.stage}
                  </span>
                  {lead.phone && (
                    <a
                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg border border-[#dde5f1] hover:bg-[#eaf7ef] hover:text-[#0f8b44] text-[#8391aa] transition cursor-pointer"
                      title="Abrir WhatsApp directo"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => onSelectLead(lead.id)}
                    className="p-1.5 rounded-lg border border-[#dde5f1] hover:bg-[#ebf1ff] hover:text-[#0038d8] text-[#8391aa] transition cursor-pointer"
                    title="Abrir chat en CRM"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
