import React, { useState } from 'react';
import { X, Calendar, Clock, Globe, User, Phone, FileText } from 'lucide-react';
import { ServiceItem, ServiceBookingData } from '../../../types/serviceChat';

interface Props {
  service: ServiceItem | null;
  storeName: string;
  onClose: () => void;
  onConfirmBooking: (data: ServiceBookingData) => void;
}

export const ServiceBookingModal: React.FC<Props> = ({
  service,
  storeName,
  onClose,
  onConfirmBooking,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string>('10:30 AM');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmBooking({
        service,
        date: selectedDate,
        timeSlot: selectedSlot,
        customerName,
        customerPhone,
        notes,
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-[#181717] border border-[#282626] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#282626] bg-[#141313] shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Calendar className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">Agendar Sesión</h3>
              <span className="text-[10px] text-zinc-400">{storeName}</span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-[#252424] transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          <div className="p-3 rounded-xl bg-[#141313] border border-[#242222] flex items-center gap-3">
            <img src={service.images?.[0] || service.image} alt={service.title} className="w-12 h-12 rounded-lg object-cover border border-[#2e2b2b]" />
            <div className="min-w-0 flex-1">
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{service.category || 'Servicio'}</span>
              <h4 className="text-xs font-bold text-white truncate mt-0.5">{service.title}</h4>
              <span className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3 text-emerald-400" />{service.duration || '45 min'} • {service.serviceModality || 'Online'}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Date selector */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-300 mb-1.5">Selecciona Fecha:</label>
              <div className="grid grid-cols-4 gap-1.5">
                {nextDays.map((d) => (
                  <button key={d.iso} type="button" onClick={() => setSelectedDate(d.iso)} className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center cursor-pointer ${selectedDate === d.iso ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' : 'bg-[#141313] border-[#262424] text-zinc-300 hover:border-[#383535]'}`}>
                    <span className="text-[9px] uppercase font-bold text-zinc-400">{d.dayName}</span>
                    <span className="text-sm font-extrabold">{d.dayNum}</span>
                    <span className="text-[8px] text-zinc-400">{d.month}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time slot selector */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-300 mb-1.5">Horario Disponible:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {availableSlots.map((slot) => (
                  <button key={slot} type="button" onClick={() => setSelectedSlot(slot)} className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${selectedSlot === slot ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm' : 'bg-[#141313] border-[#262424] text-zinc-300 hover:border-[#383535]'}`}>
                    <Clock className="w-3 h-3" /><span>{slot}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Customer form */}
            <div className="space-y-2 pt-1 border-t border-[#262424]">
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                <input type="text" required placeholder="Nombre completo" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-[#131212] border border-[#282626] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                <input type="tel" required placeholder="WhatsApp de confirmación" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full bg-[#131212] border border-[#282626] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="relative">
                <FileText className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                <input type="text" placeholder="Motivo de la consulta (Opcional)" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-[#131212] border border-[#282626] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500" />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting || !customerName.trim() || !customerPhone.trim()} className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition cursor-pointer">
              <Calendar className="w-4 h-4" /><span>Confirmar Cita ({selectedDate} - {selectedSlot})</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
