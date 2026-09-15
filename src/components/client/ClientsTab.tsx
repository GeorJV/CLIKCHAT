import React, { useState } from 'react';
import { Users, Search, Mail, Phone, Calendar, Star, ShieldCheck, UserCheck } from 'lucide-react';

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

const MOCK_CLIENTS: ClientItem[] = [
  { id: 'cli-1', name: 'Carlos Mendoza', phone: '+52 55 4123 8901', email: 'carlos.m@gmail.com', channel: 'WhatsApp Bot', status: 'vip', lastSeen: 'Hace 10 min', ordersCount: 3 },
  { id: 'cli-2', name: 'Lucía Fernández', phone: '+52 55 9876 5432', email: 'lucia.f@hotmail.com', channel: 'Web ClikChat', status: 'cliente', lastSeen: 'Hace 2 horas', ordersCount: 1 },
  { id: 'cli-3', name: 'Roberto Gómez', phone: '+52 55 3344 5566', email: 'roberto.g@gmail.com', channel: 'Instagram Bot', status: 'lead', lastSeen: 'Ayer', ordersCount: 0 },
  { id: 'cli-4', name: 'Mariana Silva', phone: '+52 55 1122 3344', email: 'mariana.s@empresa.com', channel: 'Web ClikChat', status: 'vip', lastSeen: 'Hace 3 días', ordersCount: 5 },
];

export const ClientsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MOCK_CLIENTS.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-4 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#181717] border border-[#282626] p-4 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">Gestión de Clientes & Prospectos</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">Contactos registrados automáticamente por el asistente conversacional</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#181717] border border-[#282626] p-3 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><UserCheck className="w-4 h-4" /></div>
          <div><p className="text-[11px] text-zinc-400">Total Contactos</p><p className="text-sm font-black text-white">{MOCK_CLIENTS.length}</p></div>
        </div>
        <div className="bg-[#181717] border border-[#282626] p-3 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><Star className="w-4 h-4" /></div>
          <div><p className="text-[11px] text-zinc-400">Clientes VIP</p><p className="text-sm font-black text-white">{MOCK_CLIENTS.filter(c => c.status === 'vip').length}</p></div>
        </div>
        <div className="bg-[#181717] border border-[#282626] p-3 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><ShieldCheck className="w-4 h-4" /></div>
          <div><p className="text-[11px] text-zinc-400">Canal Principal</p><p className="text-sm font-black text-white">WhatsApp & Web</p></div>
        </div>
      </div>

      {/* Clients List */}
      <div className="bg-[#181717] border border-[#282626] rounded-2xl overflow-hidden">
        <div className="divide-y divide-[#282626]">
          {filtered.map((cli) => (
            <div key={cli.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#1f1d1d] transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#222020] border border-[#333030] flex items-center justify-center font-bold text-xs text-emerald-400 shrink-0">
                  {cli.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{cli.name}</span>
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                      cli.status === 'vip' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      cli.status === 'cliente' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                      {cli.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-0.5">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-zinc-500" />{cli.phone}</span>
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-zinc-500" />{cli.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 text-right">
                <div className="text-[11px] text-zinc-400">
                  <p className="font-semibold text-zinc-300">{cli.channel}</p>
                  <p className="text-[10px] text-zinc-500">{cli.lastSeen}</p>
                </div>
                <span className="px-2 py-1 rounded-lg bg-[#222020] text-emerald-400 text-[10px] font-bold border border-[#302d2d]">
                  {cli.ordersCount} pedidos
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
