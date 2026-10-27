import React, { useState, useEffect } from 'react';
import { Calendar, Clock, RefreshCw, Bot } from 'lucide-react';
import { BookingIntervalConfig } from '../crm/bookings/BookingIntervalConfig';
import { formatDisplayDate } from '../../utils/bookingDateNormalizer';
import { subscribeBookingSync } from '../../utils/bookingSyncBus';

interface Appointment {
  id: string; clientName: string; serviceName: string; date: string; time: string; status: 'confirmed' | 'pending' | 'completed'; price: number;
}

export const AgendaTab: React.FC<{ tenantId?: string }> = ({ tenantId }) => {
  const activeSlug = tenantId || (typeof window !== 'undefined' ? localStorage.getItem('clikchat_active_tenant_slug') : null) || 'geosoft';
  const storageKey = `clikchat_bookings_${activeSlug}`;
  const bookingSwitchKey = `clikchat_allow_chat_booking_${activeSlug}`;

  const [allowAgentBooking, setAllowAgentBooking] = useState<boolean>(() => {
    if (typeof window !== 'undefined') { const s = localStorage.getItem(bookingSwitchKey); if (s !== null) return s === 'true'; }
    return true;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const s = localStorage.getItem(storageKey);
        if (s) {
          const p = JSON.parse(s);
          if (Array.isArray(p)) return p.map((a: Appointment) => ({ ...a, date: formatDisplayDate(a.date) || a.date }));
        }
      } catch (e) {}
    }
    return [];
  });
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending'>('all');
  const [isLoading, setIsLoading] = useState(false);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/bookings?tenant=${encodeURIComponent(activeSlug)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.bookings && Array.isArray(data.bookings)) {
          const apiApts: Appointment[] = data.bookings.map((b: any) => ({
            id: b.id, clientName: b.customer_name || 'Cliente', serviceName: b.service_name || 'Servicio Profesional',
            date: formatDisplayDate(b.booking_date) || b.booking_date || '', time: b.booking_time || '',
            status: (b.status || 'confirmed') as any, price: Number(b.price) || 0
          }));
          setAppointments((prev) => {
            const apiIds = new Set(apiApts.map(a => a.id));
            const merged = [...apiApts, ...prev.filter(p => !apiIds.has(p.id) && !p.id.startsWith('apt_'))];
            if (typeof window !== 'undefined') { try { localStorage.setItem(storageKey, JSON.stringify(merged)); } catch (e) {} }
            return merged;
          });
        }
      }
    } catch (e) {} finally { setIsLoading(false); }
  };

  useEffect(() => {
    fetchBookings();
    const handleFocus = () => fetchBookings();
    window.addEventListener('focus', handleFocus);
    const unsub = subscribeBookingSync(fetchBookings);
    const timer = setInterval(() => { if (!document.hidden) fetchBookings(); }, 5000);
    return () => { window.removeEventListener('focus', handleFocus); unsub(); clearInterval(timer); };
  }, [activeSlug]);

  const handleToggleAgentBooking = async () => {
    const nextVal = !allowAgentBooking;
    setAllowAgentBooking(nextVal);
    if (typeof window !== 'undefined') { try { localStorage.setItem(bookingSwitchKey, String(nextVal)); } catch (e) {} }
    try {
      await fetch('/api/tenant/booking-settings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId: activeSlug, allowAgentBooking: nextVal })
      });
    } catch (e) {}
  };

  const filtered = appointments.filter(a => filter === 'all' || a.status === filter);

  return (
    <div className="space-y-4 max-w-6xl mx-auto animate-fade-in font-sans">
      {/* Switch: Permitir al agente agendar citas en el chat */}
      <div className="bg-[#181717] border border-[#282626] p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-bold text-white">Permitir al agente agendar citas en el chat</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${allowAgentBooking ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                {allowAgentBooking ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5 truncate sm:whitespace-normal">
              El agente solicita los datos dato por dato, confirma disponibilidad y genera la tarjeta de cita en el chat.
            </p>
          </div>
        </div>
        <button
          type="button" onClick={handleToggleAgentBooking}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${allowAgentBooking ? 'bg-emerald-500' : 'bg-zinc-700'}`}
          role="switch" aria-checked={allowAgentBooking} title={allowAgentBooking ? 'Desactivar agendamiento en chat' : 'Activar agendamiento en chat'}
        >
          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${allowAgentBooking ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>

      {/* Configuración de Intervalos de Atención y Descanso */}
      <BookingIntervalConfig tenantId={activeSlug} isDarkTheme={true} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#181717] border border-[#282626] p-4 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">Agenda de Citas & Reservaciones</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">Gestión de citas reales agendadas por tus clientes a través del bot</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={fetchBookings} disabled={isLoading} className="p-1.5 rounded-xl border border-[#2d2b2b] text-zinc-400 hover:text-white bg-[#201e1e] transition cursor-pointer" title="Actualizar agenda">
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
          {(['all', 'confirmed', 'pending'] as const).map(tab => (
            <button key={tab} onClick={() => setFilter(tab)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${filter === tab ? 'bg-[#252323] text-emerald-400 border border-[#383535]' : 'text-zinc-400 hover:text-white'}`}>
              {tab === 'all' ? 'Todas' : tab === 'confirmed' ? 'Confirmadas' : 'Pendientes'}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List / Empty State */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-[#181717] border border-[#282626] rounded-2xl flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#201e1e] border border-[#2d2a2a] flex items-center justify-center text-emerald-400"><Calendar className="w-6 h-6" /></div>
          <h3 className="text-sm font-bold text-white">No hay citas agendadas aún</h3>
          <p className="text-xs text-zinc-400 max-w-sm">Las citas, demostraciones y reservaciones que tus clientes agenden a través del bot conversacional se sincronizarán aquí automáticamente.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map(apt => (
            <div key={apt.id} className="bg-[#181717] border border-[#282626] p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#383535] transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#201e1e] border border-[#2d2a2a] flex flex-col items-center justify-center text-emerald-400 shrink-0"><Clock className="w-4 h-4" /></div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white">{apt.clientName}</span>
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${apt.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : apt.status === 'pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
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
                <span className="text-xs font-bold text-emerald-400">{apt.price > 0 ? `$${apt.price} USD` : 'Gratis'}</span>
                <span className="px-3 py-1 rounded-xl bg-[#222020] text-emerald-400 text-xs font-semibold border border-[#363333]">Sincronizado</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
