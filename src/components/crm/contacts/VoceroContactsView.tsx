import React, { useState } from 'react';
import { Search, Download, Trash2, Check, CheckSquare, Square } from 'lucide-react';
import { CrmLead } from '../../../types/crm';
import { VoceroContactItem } from './VoceroContactItem';
import { VoceroDeleteContactModal } from './VoceroDeleteContactModal';

interface VoceroContactsViewProps {
  leads: CrmLead[];
  onSelectLead: (id: string) => void;
  onDeleteLead?: (id: string) => Promise<boolean>;
  onDeleteLeads?: (ids: string[]) => Promise<boolean>;
}

export const VoceroContactsView: React.FC<VoceroContactsViewProps> = ({
  leads, onSelectLead, onDeleteLead, onDeleteLeads
}) => {
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState<'all' | 'whatsapp' | 'web'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [contactToDelete, setContactToDelete] = useState<CrmLead | null>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = leads.filter(l => {
    const term = (search || '').toLowerCase();
    const matchesSearch = (l.name || '').toLowerCase().includes(term) || (l.phone || '').includes(term) || (l.email || '').toLowerCase().includes(term);
    if (!matchesSearch) return false;
    if (channelFilter === 'whatsapp') return l.channel === 'whatsapp';
    if (channelFilter === 'web') return l.channel === 'web' || l.channel === 'clikchat';
    return true;
  });

  const isAllSelected = filtered.length > 0 && filtered.every(l => selectedIds.has(l.id));
  const toggleSelectAll = () => setSelectedIds(isAllSelected ? new Set() : new Set(filtered.map(l => l.id)));
  const toggleSelectOne = (id: string) => setSelectedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  const handleConfirmSingleDelete = async () => {
    if (!contactToDelete || !onDeleteLead) return;
    setIsDeleting(true);
    try {
      await onDeleteLead(contactToDelete.id);
      setSelectedIds(prev => { const n = new Set(prev); n.delete(contactToDelete.id); return n; });
      setContactToDelete(null);
    } finally { setIsDeleting(false); }
  };

  const handleConfirmBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    setIsDeleting(true);
    try {
      if (onDeleteLeads) await onDeleteLeads(ids);
      else if (onDeleteLead) await Promise.all(ids.map(id => onDeleteLead(id)));
      setSelectedIds(new Set());
      setShowBulkModal(false);
    } finally { setIsDeleting(false); }
  };

  const handleExportCsv = () => {
    const headers = ['Nombre', 'Teléfono', 'Email', 'Etapa', 'Canal'];
    const rows = filtered.map(l => [
      `"${(l.name || '').replace(/"/g, '""')}"`, `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`, `"${(l.stage || '').replace(/"/g, '""')}"`, `"${(l.channel || 'web').replace(/"/g, '""')}"`
    ]);
    const link = document.createElement('a');
    link.href = encodeURI('data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n'));
    link.download = `contactos_clikchat_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] font-sans overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-4 sm:px-5 shadow-xs gap-2">
        <div className="flex items-center gap-2.5 shrink-0">
          <h2 className="text-[16px] sm:text-[17px] font-bold tracking-tight text-[#0a1730]">Contactos</h2>
          <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#62728d] font-semibold">{filtered.length} / {leads.length}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <div className="hidden sm:flex items-center gap-1 bg-[#f1f5f9] p-0.5 rounded-lg text-xs">
            {(['all', 'whatsapp', 'web'] as const).map((ch) => (
              <button key={ch} onClick={() => setChannelFilter(ch)} className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer capitalize ${channelFilter === ch ? 'bg-white text-[#0d5bff] shadow-xs' : 'text-[#62728d] hover:text-[#0a1730]'}`}>
                {ch === 'all' ? 'Todos' : ch === 'whatsapp' ? 'WhatsApp' : 'Web'}
              </button>
            ))}
          </div>

          <div className="w-36 sm:w-52">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar contacto…" className="w-full rounded-full border border-[#dde5f1] bg-[#f6f8fc] px-3.5 py-1.5 text-xs text-[#0a1730] outline-none focus:border-[#0d5bff] focus:bg-white" />
          </div>

          <button onClick={handleExportCsv} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#dde5f1] bg-white text-xs font-semibold text-[#0a1730] hover:bg-[#f6f8fc] transition cursor-pointer" title="Exportar contactos a CSV">
            <Download className="w-3.5 h-3.5 text-[#0d5bff]" /><span className="hidden md:inline">Exportar CSV</span>
          </button>
        </div>
      </header>

      {/* Barra de Selección Masiva & Acciones */}
      {filtered.length > 0 && (
        <div className="px-4 py-2 bg-white border-b border-[#e8edf6] flex items-center justify-between text-xs gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSelectAll}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                isAllSelected ? 'bg-blue-50 border-[#0d5bff] text-[#0d5bff]' : 'border-[#dde5f1] bg-white text-[#42506b] hover:bg-[#f6f8fc]'
              }`}
            >
              {isAllSelected ? <CheckSquare className="w-3.5 h-3.5 text-[#0d5bff]" /> : <Square className="w-3.5 h-3.5 text-[#8391aa]" />}
              <span>{isAllSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}</span>
            </button>
            {selectedIds.size > 0 && (
              <span className="text-[11px] font-bold text-[#0d5bff] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {selectedIds.size} de {filtered.length} seleccionados
              </span>
            )}
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-[11px] font-semibold text-[#8391aa] hover:text-[#0a1730] transition cursor-pointer px-2 py-1"
              >
                Limpiar selección
              </button>
              <button
                onClick={() => setShowBulkModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar seleccionados ({selectedIds.size})</span>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto p-4 max-w-5xl w-full mx-auto">
        <div className="rounded-xl border border-[#dde5f1] bg-white shadow-xs divide-y divide-[#e8edf6] overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8391aa]">No se encontraron contactos para este filtro.</div>
          ) : (
            filtered.map(lead => (
              <VoceroContactItem
                key={lead.id}
                lead={lead}
                isSelected={selectedIds.has(lead.id)}
                onToggleSelect={toggleSelectOne}
                onSelectLead={onSelectLead}
                onDeleteLead={(l) => setContactToDelete(l)}
              />
            ))
          )}
        </div>
      </div>

      <VoceroDeleteContactModal
        isOpen={Boolean(contactToDelete)} count={1} contactName={contactToDelete?.name} isBulk={false}
        isDeleting={isDeleting} onConfirm={handleConfirmSingleDelete} onClose={() => setContactToDelete(null)}
      />
      <VoceroDeleteContactModal
        isOpen={showBulkModal} count={selectedIds.size} isBulk={true}
        isDeleting={isDeleting} onConfirm={handleConfirmBulkDelete} onClose={() => setShowBulkModal(false)}
      />
    </div>
  );
};
