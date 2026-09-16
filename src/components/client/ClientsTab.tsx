import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, Star, ShieldCheck, UserCheck } from 'lucide-react';

interface ClientItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  channel: string;
  status: 'lead' | 'vip' | 'cliente';
  lastSeen: string;
  ordersCount: number;
}

export const ClientsTab: React.FC<{ tenantId?: string }> = ({ tenantId }) => {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!tenantId) return;
    setIsLoading(true);
    fetch(`/api/chat/tenant-clients/${tenantId}`)
      .then(res => res.ok ? res.json() : { clients: [] })
      .then(data => setClients(data.clients || []))
      .catch(() => setClients([]))
      .finally(() => setIsLoading(false));
  }, [tenantId]);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-4 max-w-6xl mx-auto animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#181717] border border-[#282626] p-4 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">Gestión de Clientes & Contactos</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">Contactos reales recopilados por el bot conversacional en Cloudflare D1</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, correo..."
            className="w-full bg-[#131212] border border-[#2e2b2b] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/60"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#181717] border border-[#282626] p-3 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><UserCheck className="w-4 h-4" /></div>
          <div><p className="text-[11px] text-zinc-400">Total Contactos</p><p className="text-sm font-black text-white">{clients.length}</p></div>
        </div>
        <div className="bg-[#181717] border border-[#282626] p-3 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><Star className="w-4 h-4" /></div>
          <div><p className="text-[11px] text-zinc-400">Clientes VIP</p><p className="text-sm font-black text-white">{clients.filter(c => c.status === 'vip').length}</p></div>
        </div>
        <div className="bg-[#181717] border border-[#282626] p-3 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><ShieldCheck className="w-4 h-4" /></div>
          <div><p className="text-[11px] text-zinc-400">Canal Conectado</p><p className="text-sm font-black text-white">Cloudflare D1 Real</p></div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 text-center bg-[#181717] border border-[#282626] rounded-2xl flex flex-col items-center justify-center space-y-2">
          <Users className="w-8 h-8 text-zinc-600 mb-1" />
          <p className="text-xs font-bold text-zinc-300">
            {isLoading ? 'Cargando contactos desde D1...' : 'No hay clientes registrados aún'}
          </p>
          <p className="text-[11px] text-zinc-500 max-w-sm">
            {isLoading ? 'Consultando la base de datos...' : 'A medida que los visitantes interactúen o dejen sus datos con el bot, sus contactos se guardarán aquí.'}
          </p>
        </div>
      ) : (
        <div className="bg-[#181717] border border-[#282626] rounded-2xl overflow-hidden divide-y divide-[#282626]">
          {filtered.map((cli) => (
            <div key={cli.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#1f1d1d] transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#222020] border border-[#333030] flex items-center justify-center font-bold text-xs text-emerald-400 shrink-0">
                  {cli.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{cli.name}</span>
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {cli.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-0.5">
                    {cli.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-zinc-500" />{cli.phone}</span>}
                    {cli.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-zinc-500" />{cli.email}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 text-right">
                <div className="text-[11px] text-zinc-400">
                  <p className="font-semibold text-zinc-300">{cli.channel}</p>
                  <p className="text-[10px] text-zinc-500">{cli.lastSeen ? new Date(cli.lastSeen).toLocaleDateString() : 'Reciente'}</p>
                </div>
                <span className="px-2 py-1 rounded-lg bg-[#222020] text-emerald-400 text-[10px] font-bold border border-[#302d2d]">
                  {cli.ordersCount} msgs
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
