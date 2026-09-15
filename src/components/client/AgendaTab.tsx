import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, Plus, User, MapPin } from 'lucide-react';

interface Appointment {
  id: string;
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed';
  price: number;
}

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'apt-1', clientName: 'Valeria Morales', serviceName: 'Consulta Virtual Personalizada', date: 'Hoy, 15 Sep', time: '16:00 - 16:45', status: 'confirmed', price: 45 },
  { id: 'apt-2', clientName: 'Alejandro Cruz', serviceName: 'Demostración de Producto en Vivo', date: 'Mañana, 16 Sep', time: '11:30 - 12:00', status: 'pending', price: 0 },
  { id: 'apt-3', clientName: 'Gabriela Ortiz', serviceName: 'Asesoría Especializada Premium', date: 'Jueves, 17 Sep', time: '15:00 - 16:00', status: 'confirmed', price: 60 },
  { id: 'apt-4', clientName: 'Martín Paredes', serviceName: 'Soporte Técnico de Integración', date: 'Viernes, 18 Sep', time: '10:00 - 10:30', status: 'completed', price: 30 },
];

export const AgendaTab: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending'>('all');

  const filtered = MOCK_APPOINTMENTS.filter(a => filter === 'all' || a.status === filter);

  return (
    <div className="space-y-4 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#181717] border border-[#282626] p-4 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">Agenda de Citas & Reservaciones</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">Gestión de citas agendadas por tus clientes a través del bot</p>
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'confirmed', 'pending'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                filter === tab ? 'bg-[#252323] text-emerald-400 border border-[#383535]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab === 'all' ? 'Todas' : tab === 'confirmed' ? 'Confirmadas' : 'Pendientes'}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-2.5">
        {filtered.map(apt => (
          <div key={apt.id} className="bg-[#181717] border border-[#282626] p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#383535] transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#201e1e] border border-[#2d2a2a] flex flex-col items-center justify-center text-emerald-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-white">{apt.clientName}</span>
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                    apt.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    apt.status === 'pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}>
                    {apt.status === 'confirmed' ? 'Confirmada' : apt.status === 'pending' ? 'Pendiente' : 'Finalizada'}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mt-0.5 font-medium">{apt.serviceName}</p>
                <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1">
                  <span className="flex items-center gap-1 text-emerald-400/90 font-semibold"><Calendar className="w-3 h-3" />{apt.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{apt.time}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#252323]">
              <span className="text-xs font-bold text-emerald-400">
                {apt.price > 0 ? `$${apt.price} USD` : 'Gratis'}
              </span>
              <button className="px-3 py-1 rounded-xl bg-[#222020] hover:bg-[#2c2929] text-zinc-200 text-xs font-semibold border border-[#363333] transition cursor-pointer">
                Gestionar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
