import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone } from 'lucide-react';
import { ServiceItem, ServiceBookingData } from '../../../types/serviceChat';
import { formatDisplayDate } from '../../../utils/bookingDateNormalizer';

interface Props {
  service: ServiceItem | null;
  storeName: string;
  onClose: () => void;
  onConfirmBooking: (data: ServiceBookingData) => void;
}

export const ServiceBookingModal: React.FC<Props> = ({ service, storeName, onClose, onConfirmBooking }) => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string>('10:30 AM');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!service) return null;

  const availableSlots = ['09:00 AM', '10:30 AM', '12:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'];
  const nextDays = Array.from({ length: 4 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      iso: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('es-ES', { weekday: 'short' }),
      dayNum: d.getDate(),
      month: d.toLocaleDateString('es-ES', { month: 'short' }),
    };
  });

  const formattedDisplay = formatDisplayDate(selectedDate) || selectedDate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmBooking({
        service,
        date: formattedDisplay,
        timeSlot: selectedSlot,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        notes: '',
      });
      setIsSubmitting(false);
      onClose();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-[420px] bg-[#161515] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans">
        {/* Header Compacto */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-[#121111] shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Calendar className="w-3.5 h-3.5" />
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">Agendar Cita</h3>
              <span className="text-[10px] text-zinc-400">{storeName}</span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer" title="Cerrar">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario Compacto Sin Scroll */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div className="px-3 py-1.5 rounded-xl bg-[#121111] border border-white/[0.05] flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="font-bold text-white text-xs truncate">{service.title}</span>
            </div>
            <span className="text-[10px] text-zinc-400 shrink-0 flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              {service.duration || '45 min'} • {service.serviceModality === 'presencial' ? 'Presencial' : 'Online'}
            </span>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Día de la Cita</label>
            <div className="grid grid-cols-4 gap-1.5">
              {nextDays.map((d) => (
                <button
                  key={d.iso}
                  type="button"
                  onClick={() => setSelectedDate(d.iso)}
                  className={`py-1.5 px-1 rounded-xl border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                    selectedDate === d.iso
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-md ring-1 ring-emerald-400/30'
                      : 'bg-[#121111] border-white/[0.06] text-zinc-300 hover:border-zinc-600'
                  }`}
                >
                  <span className="text-[9px] uppercase font-bold text-zinc-400">{d.dayName}</span>
                  <span className="text-xs sm:text-sm font-extrabold">{d.dayNum}</span>
                  <span className="text-[8px] text-zinc-400">{d.month}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Horario Disponible</label>
            <div className="grid grid-cols-3 gap-1.5">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                    selectedSlot === slot
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-400/30'
                      : 'bg-[#121111] border-white/[0.06] text-zinc-300 hover:border-zinc-600'
                  }`}
                >
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>{slot}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-white/[0.06]">
            <div className="relative">
              <User className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
              <input
                type="text"
                required
                placeholder="Tu nombre completo"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-[#121111] border border-white/[0.08] rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-emerald-500" />
              <input
                type="tel"
                required
                placeholder="WhatsApp / Teléfono"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-[#121111] border border-white/[0.08] rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !customerName.trim() || !customerPhone.trim()}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-40 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition active:scale-[0.99] cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>Confirmar y Guardar Cita ({selectedSlot})</span>
          </button>
        </form>
      </div>
    </div>
  );
};
