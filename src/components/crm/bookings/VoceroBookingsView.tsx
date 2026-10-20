import React, { useState, useMemo } from 'react';
import { CalendarDays, Calendar as CalendarIcon } from 'lucide-react';
import { VoceroCompactCalendar } from './VoceroCompactCalendar';
import { VoceroAppointmentCard, AppointmentItem } from './VoceroAppointmentCard';

interface VoceroBookingsViewProps {
  tenantId?: string;
  currency?: string;
}

export const VoceroBookingsView: React.FC<VoceroBookingsViewProps> = () => {
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'tomorrow' | 'after' | 'this_week' | 'next_week'>('all');
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<string | null>(null);

  const now = new Date();
  const formatKey = (d: Date) => d.toISOString().slice(0, 10);
  const todayKey = formatKey(now);

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowKey = formatKey(tomorrow);

  const dayAfter = new Date(now);
  dayAfter.setDate(now.getDate() + 2);
  const dayAfterKey = formatKey(dayAfter);

  const dayAfterName = dayAfter.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  const capitalizedDayAfter = dayAfterName.charAt(0).toUpperCase() + dayAfterName.slice(1);

  const [appointments] = useState<AppointmentItem[]>([
    {
      id: 'apt-1', clientName: 'Carlos Morales', serviceName: 'Corte Clásico & Barba',
      dateKey: todayKey, displayDate: `Hoy, ${now.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`,
      time: '14:30', status: 'confirmed', channel: 'whatsapp'
    },
    {
      id: 'apt-2', clientName: 'María Fernanda Ruiz', serviceName: 'Consulta de Valoración',
      dateKey: tomorrowKey, displayDate: `Mañana, ${tomorrow.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`,
      time: '10:00', status: 'pending', channel: 'instagram'
    },
    {
      id: 'apt-3', clientName: 'David Rodríguez', serviceName: 'Asesoría Especializada',
      dateKey: dayAfterKey, displayDate: capitalizedDayAfter,
      time: '16:00', status: 'confirmed', channel: 'web'
    }
  ]);

  const appointmentDates = useMemo(() => appointments.map(a => a.dateKey), [appointments]);

  const filtered = useMemo(() => {
    if (calendarSelectedDate) return appointments.filter(a => a.dateKey === calendarSelectedDate);
    const msInDay = 86400000;
    const nowMs = new Date(todayKey).getTime();

    return appointments.filter(a => {
      if (timeFilter === 'today') return a.dateKey === todayKey;
      if (timeFilter === 'tomorrow') return a.dateKey === tomorrowKey;
      if (timeFilter === 'after') return a.dateKey === dayAfterKey;
      if (timeFilter === 'this_week') {
        const diff = (new Date(a.dateKey).getTime() - nowMs) / msInDay;
        return diff >= 0 && diff <= 7;
      }
      if (timeFilter === 'next_week') {
        const diff = (new Date(a.dateKey).getTime() - nowMs) / msInDay;
        return diff > 7 && diff <= 14;
      }
      return true;
    });
  }, [appointments, timeFilter, calendarSelectedDate, todayKey, tomorrowKey, dayAfterKey]);

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] font-sans overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-4 sm:px-6 shadow-xs">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-[#0d5bff]" />
          <h2 className="text-[16px] sm:text-[17px] font-bold tracking-tight text-[#0a1730]">Citas & Reservaciones</h2>
          <span className="vocero-kicker ml-1 hidden sm:inline">Agenda Digital</span>
        </div>

        <button
          type="button"
          onClick={() => { setShowMonthCalendar(!showMonthCalendar); setCalendarSelectedDate(null); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer shadow-xs ${
            showMonthCalendar ? 'bg-[#0d5bff] border-[#0d5bff] text-white' : 'bg-white border-[#d8e2f0] text-[#0a1730] hover:bg-[#f8fafc]'
          }`}
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>{showMonthCalendar ? 'Cerrar Calendario' : 'Mes Completo'}</span>
        </button>
      </header>

      {/* Filtros Temporales */}
      <div className="bg-white border-b border-[#e8edf6] px-4 sm:px-6 py-2 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
        {[
          { id: 'all', label: 'Todas' },
          { id: 'today', label: 'Hoy' },
          { id: 'tomorrow', label: 'Mañana' },
          { id: 'after', label: capitalizedDayAfter },
          { id: 'this_week', label: 'Esta Semana' },
          { id: 'next_week', label: 'Semana Siguiente' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setTimeFilter(tab.id as any); setCalendarSelectedDate(null); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              timeFilter === tab.id && !calendarSelectedDate
                ? 'bg-[#0d5bff] text-white shadow-xs'
                : 'bg-[#f1f5f9] text-[#62728d] hover:text-[#0a1730]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-4xl w-full mx-auto space-y-3">
        {showMonthCalendar && (
          <div className="mb-4">
            <VoceroCompactCalendar
              appointmentDates={appointmentDates}
              selectedDate={calendarSelectedDate}
              onSelectDate={(d) => setCalendarSelectedDate(d)}
            />
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-[#d8e2f0] bg-white p-10 text-center shadow-xs">
            <CalendarDays className="h-8 w-8 text-[#8391aa] mx-auto mb-2 opacity-50" />
            <h4 className="text-xs font-bold text-[#0a1730]">No hay citas para este período</h4>
            <p className="text-[11px] text-[#8391aa] max-w-sm mx-auto mt-1">
              Las citas agendadas por tus clientes a través del bot se sincronizan en esta agenda en tiempo real.
            </p>
          </div>
        ) : (
          filtered.map((apt) => <VoceroAppointmentCard key={apt.id} appointment={apt} />)
        )}
      </main>
    </div>
  );
};
