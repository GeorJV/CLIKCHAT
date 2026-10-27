import React, { useState, useMemo, useEffect } from 'react';
import { CalendarDays, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { VoceroAppointmentCard, AppointmentItem } from './VoceroAppointmentCard';
import { VoceroNewBookingModal } from './VoceroNewBookingModal';
import { VoceroCompactCalendar } from './VoceroCompactCalendar';
import { VoceroAppointmentDetailModal } from './VoceroAppointmentDetailModal';
import { BookingIntervalConfig } from './BookingIntervalConfig';
import { getInitialAppointments, BOOKING_FILTER_TABS } from './bookingConstants';
import { normalizeToDateKey, formatDisplayDate, getBookingFilterKeys, isBookingInFilter, BookingFilterType } from '../../../utils/bookingDateNormalizer';
import { subscribeBookingSync } from '../../../utils/bookingSyncBus';

interface VoceroBookingsViewProps {
  tenantId?: string; currency?: string; highlightedBookingId?: string | null; onAcknowledgeBooking?: (id: string) => void;
}

export const VoceroBookingsView: React.FC<VoceroBookingsViewProps> = ({ tenantId, highlightedBookingId, onAcknowledgeBooking }) => {
  const [timeFilter, setTimeFilter] = useState<BookingFilterType>('all');
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<string | null>(null);
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentItem | null>(null);
  const now = useMemo(() => new Date(), []);
  const filterKeys = useMemo(() => getBookingFilterKeys(now), [now]);
  const todayKey = filterKeys.todayKey;
  const tId = tenantId || (typeof window !== 'undefined' ? localStorage.getItem('clikchat_active_tenant_slug') : null) || 'geosoft';
  const storageKey = `clikchat_bookings_${tId}`;
  const bookingSwitchKey = `clikchat_allow_chat_booking_${tId}`;
  const [allowAgentBooking, setAllowAgentBooking] = useState<boolean>(() => {
    if (typeof window !== 'undefined') { const s = localStorage.getItem(bookingSwitchKey); if (s !== null) return s === 'true'; }
    return true;
  });

  useEffect(() => {
    if (highlightedBookingId) {
      setTimeFilter('all'); setCalendarSelectedDate(null);
      setTimeout(() => { document.getElementById(`vocero-apt-${highlightedBookingId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
    }
  }, [highlightedBookingId]);

  const [appointments, setAppointments] = useState<AppointmentItem[]>(() => {
    try {
      let allFound: any[] = [];
      [storageKey, 'clikchat_bookings_geosoft', 'clikchat_bookings_ten_geosoft_prod'].forEach(k => {
        const s = localStorage.getItem(k);
        if (s) { try { const arr = JSON.parse(s); if (Array.isArray(arr)) allFound.push(...arr); } catch {} }
      });
      const unique = Array.from(new Map(allFound.map((a: any) => [a.id, a])).values()).filter((a: any) => !['apt-1', 'apt-2', 'apt-3', 'apt-4'].includes(a.id));
      const src = unique.length > 0 ? unique : getInitialAppointments();
      return src.map((a: AppointmentItem) => ({ ...a, dateKey: normalizeToDateKey(a.dateKey || a.displayDate, now) || a.dateKey, displayDate: formatDisplayDate(a.displayDate || a.dateKey, now) || a.displayDate }));
    } catch { return getInitialAppointments(); }
  });

  const fetchBookings = () => {
    const bParam = tId === 'ten_geosoft_prod' ? 'geosoft' : tId;
    fetch(`/api/bookings?tenant=${encodeURIComponent(bParam)}&tenantId=ten_geosoft_prod&_t=${Date.now()}`, { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(d => {
      if (d?.bookings && Array.isArray(d.bookings)) {
        const apiApts = d.bookings.map((b: any) => ({
          id: b.id, clientName: b.customer_name || 'Cliente', serviceName: b.service_name || 'Servicio Profesional',
          dateKey: normalizeToDateKey(b.booking_date, now) || todayKey, displayDate: formatDisplayDate(b.booking_date, now) || b.booking_date,
          time: b.booking_time || '10:00 AM', status: b.status || 'confirmed', channel: 'web' as const, phone: b.customer_phone || '', notes: b.notes || '', price: Number(b.price) || 0
        }));
        setAppointments(prev => [...apiApts, ...prev.filter(p => !new Set(apiApts.map(a => a.id)).has(p.id) && !['apt-1', 'apt-2', 'apt-3', 'apt-4'].includes(p.id))]);
      }
    }).catch(() => {});
  };

  useEffect(() => {
    fetchBookings();
    const handleActive = () => { if (!document.hidden) fetchBookings(); };
    window.addEventListener('focus', handleActive);
    document.addEventListener('visibilitychange', handleActive);
    const unsub = subscribeBookingSync(fetchBookings);
    const timer = setInterval(() => { if (!document.hidden) fetchBookings(); }, 3500);
    return () => { window.removeEventListener('focus', handleActive); document.removeEventListener('visibilitychange', handleActive); unsub(); clearInterval(timer); };
  }, [tId, todayKey, now]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(appointments));
      if (tId === 'geosoft' || tId === 'ten_geosoft_prod') {
        localStorage.setItem('clikchat_bookings_geosoft', JSON.stringify(appointments));
        localStorage.setItem('clikchat_bookings_ten_geosoft_prod', JSON.stringify(appointments));
      }
    } catch (e) {}
  }, [appointments, storageKey, tId]);

  const handleToggleAgentBooking = async () => {
    const nextVal = !allowAgentBooking; setAllowAgentBooking(nextVal);
    if (typeof window !== 'undefined') { try { localStorage.setItem(bookingSwitchKey, String(nextVal)); } catch {} }
    try { await fetch('/api/tenant/booking-settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tenantId: tId, allowAgentBooking: nextVal }) }); } catch {}
  };

  const handleDeleteAppointment = async (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    if (selectedAppointment?.id === id) setSelectedAppointment(null);
    [storageKey, 'clikchat_bookings_geosoft', 'clikchat_bookings_ten_geosoft_prod'].forEach(k => {
      try { const s = localStorage.getItem(k); if (s) { const arr = JSON.parse(s); if (Array.isArray(arr)) localStorage.setItem(k, JSON.stringify(arr.filter((a: any) => a.id !== id))); } } catch {}
    });
    try { await fetch(`/api/bookings/${encodeURIComponent(id)}`, { method: 'DELETE' }); } catch (e) {}
  };

  const handleToggleStatus = async (id: string) => {
    const apt = appointments.find(a => a.id === id);
    const next = apt?.status === 'confirmed' ? 'pending' : 'confirmed';
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: next } : a));
    try { await fetch(`/api/bookings/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) }); } catch (e) {}
  };

  const appointmentDates = useMemo(() => appointments.map(a => normalizeToDateKey(a.dateKey, now) || a.dateKey), [appointments, now]);
  const filtered = useMemo(() => calendarSelectedDate ? appointments.filter(a => (normalizeToDateKey(a.dateKey, now) || a.dateKey) === calendarSelectedDate) : appointments.filter(a => isBookingInFilter(a.dateKey, timeFilter, filterKeys, now)), [appointments, timeFilter, calendarSelectedDate, filterKeys, now]);

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
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${allowAgentBooking ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>{allowAgentBooking ? 'Activo' : 'Inactivo'}</span>
          </div>
          <button type="button" onClick={handleToggleAgentBooking} className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${allowAgentBooking ? 'bg-[#0d5bff]' : 'bg-slate-300'}`} role="switch" aria-checked={allowAgentBooking}>
            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${allowAgentBooking ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Filtros Temporales */}
        <div className="bg-white border-b border-[#e8edf6] px-4 sm:px-6 py-2 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
          {BOOKING_FILTER_TABS.map((tab) => (
            <button key={tab.id} onClick={() => { setTimeFilter(tab.id as any); setCalendarSelectedDate(null); }} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${timeFilter === tab.id && !calendarSelectedDate ? 'bg-[#0d5bff] text-white shadow-xs' : 'bg-[#f1f5f9] text-[#62728d] hover:text-[#0a1730]'}`}>{tab.label}</button>
          ))}
          <div className="h-4 w-px bg-[#e2e8f0] mx-0.5 shrink-0" />
          <button type="button" onClick={() => { setShowMonthCalendar(!showMonthCalendar); setCalendarSelectedDate(null); }} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${showMonthCalendar ? 'bg-[#0d5bff] text-white shadow-xs' : 'bg-[#f1f5f9] text-[#42506b] hover:text-[#0a1730] hover:bg-[#e2e8f0]'}`}>
            <CalendarIcon className="w-3.5 h-3.5" /><span>{showMonthCalendar ? 'Ocultar Mes' : 'Mes Completo'}</span>
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-4xl w-full mx-auto space-y-3">
          <BookingIntervalConfig tenantId={tId} isDarkTheme={false} />
          {showMonthCalendar && <div className="mb-4"><VoceroCompactCalendar appointmentDates={appointmentDates} selectedDate={calendarSelectedDate} onSelectDate={(d) => setCalendarSelectedDate(d)} /></div>}
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-[#d8e2f0] bg-white p-10 text-center shadow-xs">
              <CalendarDays className="h-8 w-8 text-[#8391aa] mx-auto mb-2 opacity-50" /><h4 className="text-xs font-bold text-[#0a1730]">No hay citas para este período</h4><p className="text-[11px] text-[#8391aa] max-w-sm mx-auto mt-1">Las citas agendadas por tus clientes a través del bot o creadas manualmente se sincronizan aquí en tiempo real.</p>
            </div>
          ) : (
            filtered.map((apt) => (
              <VoceroAppointmentCard
                key={apt.id} appointment={apt}
                isHighlighted={apt.id === highlightedBookingId}
                onHover={() => onAcknowledgeBooking && onAcknowledgeBooking(apt.id)}
                onToggleStatus={handleToggleStatus} onDelete={handleDeleteAppointment}
                onSelectAppointment={(item) => setSelectedAppointment(item)}
              />
            ))
          )}
        </main>

        <VoceroNewBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddBooking={(apt) => {
          const norm = { ...apt, dateKey: normalizeToDateKey(apt.dateKey, now) || apt.dateKey };
          setAppointments(prev => [norm, ...prev]);
          broadcastBookingCreated(tId);
        }} />
        <VoceroAppointmentDetailModal appointment={selectedAppointment} isOpen={Boolean(selectedAppointment)} onClose={() => setSelectedAppointment(null)} onToggleStatus={(id) => { handleToggleStatus(id); setSelectedAppointment(prev => prev && prev.id === id ? { ...prev, status: prev.status === 'confirmed' ? 'pending' : 'confirmed' } : prev); }} onDelete={handleDeleteAppointment} />
      </div>
    );
  };
