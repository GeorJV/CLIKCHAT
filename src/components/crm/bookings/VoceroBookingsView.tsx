import React, { useState, useMemo, useEffect } from 'react';
import { CalendarDays, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { VoceroCompactCalendar } from './VoceroCompactCalendar';
import { VoceroAppointmentCard, AppointmentItem } from './VoceroAppointmentCard';
import { VoceroNewBookingModal } from './VoceroNewBookingModal';
import { getInitialAppointments } from './bookingConstants';

interface VoceroBookingsViewProps {
  tenantId?: string;
  currency?: string;
}

export const VoceroBookingsView: React.FC<VoceroBookingsViewProps> = ({ tenantId }) => {
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'tomorrow' | 'after' | 'this_week' | 'next_week'>('all');
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const storageKey = `clikchat_bookings_${tenantId || 'default'}`;

  const [appointments, setAppointments] = useState<AppointmentItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : getInitialAppointments();
    } catch {
      return getInitialAppointments();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(appointments));
    } catch (e) {
      console.warn('Error saving bookings to localStorage:', e);
    }
  }, [appointments, storageKey]);

  const handleToggleStatus = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'confirmed' ? 'pending' : 'confirmed' } : a));
  };

  const appointmentDates = useMemo(() => appointments.map(a => a.dateKey), [appointments]);

  const filtered = useMemo(() => {
    if (calendarSelectedDate) return appointments.filter(a => a.dateKey === calendarSelectedDate);
    const msInDay = 86400000;
    const nowMs = new Date(todayKey).getTime();

    return appointments.filter(a => {
      const diff = (new Date(a.dateKey).getTime() - nowMs) / msInDay;
      if (timeFilter === 'today') return diff === 0;
      if (timeFilter === 'tomorrow') return diff === 1;
      if (timeFilter === 'after') return diff === 2;
      if (timeFilter === 'this_week') return diff >= 0 && diff <= 7;
      if (timeFilter === 'next_week') return diff > 7 && diff <= 14;
      return true;
    });
  }, [appointments, timeFilter, calendarSelectedDate, todayKey]);

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] font-sans overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-4 sm:px-6 shadow-xs">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-[#0d5bff]" />
          <h2 className="text-[16px] sm:text-[17px] font-bold tracking-tight text-[#0a1730]">Citas & Reservaciones</h2>
          <span className="vocero-kicker ml-1 hidden sm:inline">Agenda Digital</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0d5bff] hover:bg-[#0047e1] text-xs font-bold text-white transition cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Cita</span>
          </button>

          <button
            type="button"
            onClick={() => { setShowMonthCalendar(!showMonthCalendar); setCalendarSelectedDate(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer shadow-xs ${
              showMonthCalendar ? 'bg-[#0d5bff] border-[#0d5bff] text-white' : 'bg-white border-[#d8e2f0] text-[#0a1730] hover:bg-[#f8fafc]'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{showMonthCalendar ? 'Cerrar Mes' : 'Mes Completo'}</span>
          </button>
        </div>
      </header>

      {/* Filtros Temporales */}
      <div className="bg-white border-b border-[#e8edf6] px-4 sm:px-6 py-2 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
        {[
          { id: 'all', label: 'Todas' },
          { id: 'today', label: 'Hoy' },
          { id: 'tomorrow', label: 'Mañana' },
          { id: 'after', label: 'Pasado Mañana' },
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
              Las citas agendadas por tus clientes a través del bot o creadas manualmente se sincronizan aquí en tiempo real.
            </p>
          </div>
        ) : (
          filtered.map((apt) => (
            <VoceroAppointmentCard
              key={apt.id}
              appointment={apt}
              onToggleStatus={handleToggleStatus}
              onDelete={(id) => setAppointments(prev => prev.filter(a => a.id !== id))}
            />
          ))
        )}
      </main>

      <VoceroNewBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddBooking={(apt) => setAppointments(prev => [apt, ...prev])}
      />
    </div>
  );
};
