import React, { useState, useMemo, useEffect } from 'react';
import { CalendarDays, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { VoceroAppointmentCard, AppointmentItem } from './VoceroAppointmentCard';
import { VoceroNewBookingModal } from './VoceroNewBookingModal';
import { VoceroCompactCalendar } from './VoceroCompactCalendar';
import { VoceroAppointmentDetailModal } from './VoceroAppointmentDetailModal';
import { BookingIntervalConfig } from './BookingIntervalConfig';
import { getInitialAppointments, BOOKING_FILTER_TABS } from './bookingConstants';

interface VoceroBookingsViewProps {
  tenantId?: string;
}

export const VoceroBookingsView: React.FC<VoceroBookingsViewProps> = ({ tenantId }) => {
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'tomorrow' | 'after' | 'this_week' | 'next_week'>('all');
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<string | null>(null);
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentItem | null>(null);

  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const tId = tenantId || (typeof window !== 'undefined' ? localStorage.getItem('clikchat_active_tenant_slug') : null) || 'geosoft';
  const storageKey = `clikchat_bookings_${tId}`;
  const bookingSwitchKey = `clikchat_allow_chat_booking_${tId}`;

  const [allowAgentBooking, setAllowAgentBooking] = useState<boolean>(() => {
    if (typeof window !== 'undefined') { const s = localStorage.getItem(bookingSwitchKey); if (s !== null) return s === 'true'; }
    return true;
  });

  const [appointments, setAppointments] = useState<AppointmentItem[]>(() => {
    try { const saved = localStorage.getItem(storageKey); return saved ? JSON.parse(saved) : getInitialAppointments(); } catch { return getInitialAppointments(); }
  });

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/bookings?tenant=${encodeURIComponent(tId)}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.bookings && Array.isArray(d.bookings) && isMounted) {
          const apiApts = d.bookings.map((b: any) => ({
            id: b.id, clientName: b.customer_name || 'Cliente', serviceName: b.service_name || 'Servicio Profesional',
            dateKey: b.booking_date || todayKey, displayDate: b.booking_date || todayKey, time: b.booking_time || '10:00 AM',
            status: b.status || 'confirmed', channel: 'web' as const, phone: b.customer_phone || '', notes: b.notes || '', price: Number(b.price) || 0
          }));
          setAppointments(prev => { const seen = new Set(prev.map(p => p.id)); return [...apiApts.filter(a => !seen.has(a.id)), ...prev]; });
        }
      }).catch(() => {});
    return () => { isMounted = false; };
  }, [tId, todayKey]);

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(appointments)); } catch (e) {}
  }, [appointments, storageKey]);

  const handleToggleAgentBooking = async () => {
    const nextVal = !allowAgentBooking;
    setAllowAgentBooking(nextVal);
    if (typeof window !== 'undefined') { try { localStorage.setItem(bookingSwitchKey, String(nextVal)); } catch (e) {} }
    try {
      await fetch('/api/tenant/booking-settings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId: tId, allowAgentBooking: nextVal })
      });
    } catch (e) {}
  };

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
        <button type="button" onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0d5bff] hover:bg-[#0047e1] text-xs font-bold text-white transition cursor-pointer shadow-xs">
          <Plus className="w-3.5 h-3.5" /><span>Nueva Cita</span>
        </button>
      </header>

      {/* Switch Agendamiento en Chat */}
      <div className="bg-white border-b border-[#e8edf6] px-4 sm:px-6 py-2 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${allowAgentBooking ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
          <span className="font-bold text-[#0a1730]">Permitir al agente agendar citas en el chat</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${allowAgentBooking ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
            {allowAgentBooking ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <button
          type="button" onClick={handleToggleAgentBooking}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${allowAgentBooking ? 'bg-[#0d5bff]' : 'bg-slate-300'}`}
          role="switch" aria-checked={allowAgentBooking}
        >
          <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${allowAgentBooking ? 'translate-x-4' : 'translate-x-0'}`} />
        </button>
      </div>

      {/* Filtros Temporales */}
      <div className="bg-white border-b border-[#e8edf6] px-4 sm:px-6 py-2 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
        {BOOKING_FILTER_TABS.map((tab) => (
          <button key={tab.id} onClick={() => { setTimeFilter(tab.id as any); setCalendarSelectedDate(null); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${timeFilter === tab.id && !calendarSelectedDate ? 'bg-[#0d5bff] text-white shadow-xs' : 'bg-[#f1f5f9] text-[#62728d] hover:text-[#0a1730]'}`}>
            {tab.label}
          </button>
        ))}
        <div className="h-4 w-px bg-[#e2e8f0] mx-0.5 shrink-0" />
        <button type="button" onClick={() => { setShowMonthCalendar(!showMonthCalendar); setCalendarSelectedDate(null); }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${showMonthCalendar ? 'bg-[#0d5bff] text-white shadow-xs' : 'bg-[#f1f5f9] text-[#42506b] hover:text-[#0a1730] hover:bg-[#e2e8f0]'}`}>
          <CalendarIcon className="w-3.5 h-3.5" /><span>{showMonthCalendar ? 'Ocultar Mes' : 'Mes Completo'}</span>
        </button>
      </div>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-4xl w-full mx-auto space-y-3">
        <BookingIntervalConfig tenantId={tId} isDarkTheme={false} />
        {showMonthCalendar && (
          <div className="mb-4"><VoceroCompactCalendar appointmentDates={appointmentDates} selectedDate={calendarSelectedDate} onSelectDate={(d) => setCalendarSelectedDate(d)} /></div>
        )}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-[#d8e2f0] bg-white p-10 text-center shadow-xs">
            <CalendarDays className="h-8 w-8 text-[#8391aa] mx-auto mb-2 opacity-50" />
            <h4 className="text-xs font-bold text-[#0a1730]">No hay citas para este período</h4>
            <p className="text-[11px] text-[#8391aa] max-w-sm mx-auto mt-1">Las citas agendadas por tus clientes a través del bot o creadas manualmente se sincronizan aquí en tiempo real.</p>
          </div>
        ) : (
          filtered.map((apt) => (
            <VoceroAppointmentCard key={apt.id} appointment={apt} onToggleStatus={handleToggleStatus} onDelete={(id) => setAppointments(prev => prev.filter(a => a.id !== id))} onSelectAppointment={(item) => setSelectedAppointment(item)} />
          ))
        )}
      </main>

      <VoceroNewBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddBooking={(apt) => setAppointments(prev => [apt, ...prev])} />
      <VoceroAppointmentDetailModal appointment={selectedAppointment} isOpen={Boolean(selectedAppointment)} onClose={() => setSelectedAppointment(null)} onToggleStatus={(id) => { handleToggleStatus(id); setSelectedAppointment(prev => prev && prev.id === id ? { ...prev, status: prev.status === 'confirmed' ? 'pending' : 'confirmed' } : prev); }} onDelete={(id) => { setAppointments(prev => prev.filter(a => a.id !== id)); setSelectedAppointment(null); }} />
    </div>
  );
};
