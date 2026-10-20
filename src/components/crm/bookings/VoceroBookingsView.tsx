import React, { useState } from 'react';
import { CalendarDays, Clock, CheckCircle2, AlertCircle, Plus, User } from 'lucide-react';

interface VoceroBookingsViewProps {
  tenantId?: string;
  currency?: string;
}

interface Appointment {
  id: string;
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending';
  channel: 'whatsapp' | 'instagram' | 'web';
}

export const VoceroBookingsView: React.FC<VoceroBookingsViewProps> = () => {
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending'>('all');
  const [appointments] = useState<Appointment[]>([
    {
      id: 'apt-1',
      clientName: 'Carlos Morales',
      serviceName: 'Corte Clásico & Barba',
      date: 'Hoy, 20 Oct',
      time: '14:30',
      status: 'confirmed',
      channel: 'whatsapp'
    },
    {
      id: 'apt-2',
      clientName: 'María Fernanda Ruiz',
      serviceName: 'Consulta de Valoración',
      date: 'Mañana, 21 Oct',
      time: '10:00',
      status: 'pending',
      channel: 'instagram'
    }
  ]);

  const filtered = appointments.filter(a => filter === 'all' || a.status === filter);

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] font-sans overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-6 shadow-xs">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-[#0d5bff]" />
          <h2 className="text-[17px] font-bold tracking-tight text-[#0a1730]">Citas & Reservaciones</h2>
          <span className="vocero-kicker ml-2">Agenda Digital</span>
        </div>

        <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-xl">
          {(['all', 'confirmed', 'pending'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filter === tab ? 'bg-white text-[#0d5bff] shadow-xs' : 'text-[#62728d] hover:text-[#0a1730]'
              }`}
            >
              {tab === 'all' ? 'Todas' : tab === 'confirmed' ? 'Confirmadas' : 'Pendientes'}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 max-w-4xl w-full mx-auto space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-[#d8e2f0] bg-white p-12 text-center">
            <CalendarDays className="h-8 w-8 text-[#8391aa] mx-auto mb-2 opacity-50" />
            <h4 className="text-xs font-bold text-[#0a1730]">No hay citas en este filtro</h4>
            <p className="text-[11px] text-[#8391aa] max-w-sm mx-auto mt-1">
              Las citas agendadas por tus clientes a través del bot o WhatsApp se sincronizan en esta agenda en tiempo real.
            </p>
          </div>
        ) : (
          filtered.map((apt) => (
            <div
              key={apt.id}
              className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs flex items-center justify-between gap-4 hover:border-[#b8cced] transition"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#ebf1ff] flex items-center justify-center text-[#0d5bff] font-bold text-xs">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0a1730]">{apt.clientName}</h4>
                  <p className="text-[11px] text-[#62728d]">{apt.serviceName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="font-semibold text-[#0a1730] flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-[#8391aa]" /> {apt.date} · {apt.time}
                </span>

                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  apt.status === 'confirmed' ? 'bg-[#eaf7ef] text-[#0f8b44]' : 'bg-[#fff5e6] text-[#b36b00]'
                }`}>
                  {apt.status === 'confirmed' ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" /> Confirmada
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3" /> Pendiente
                    </>
                  )}
                </span>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};
