import React from 'react';
import { Calendar, BellRing, ArrowRight, X } from 'lucide-react';
import { BookingDetail } from '../../utils/bookingSyncBus';
import { formatDisplayDate } from '../../utils/bookingDateNormalizer';

interface Props {
  booking: BookingDetail;
  onViewBooking: (booking: BookingDetail) => void;
  onDismiss: () => void;
}

export const NewBookingBanner: React.FC<Props> = ({ booking, onViewBooking, onDismiss }) => {
  const displayDate = formatDisplayDate(booking.date) || booking.date;

  return (
    <div className="relative mb-3.5 w-full rounded-2xl bg-gradient-to-r from-amber-950/90 via-[#221b10] to-[#181717] border-2 border-amber-500/70 p-3 sm:px-4 sm:py-3 shadow-2xl shadow-amber-950/40 text-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in font-sans select-none ring-2 ring-amber-400/30">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-md shadow-amber-500/20">
            <BellRing className="w-5 h-5 animate-bounce" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 ring-2 ring-[#1e1b12] animate-ping" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-black font-mono">
              ¡Cita Nueva Agendada!
            </span>
            <span className="text-xs font-bold text-white truncate">
              {booking.clientName}
            </span>
          </div>
          <p className="text-[11px] text-amber-200/90 mt-0.5 truncate sm:whitespace-normal">
            Reservó <span className="font-semibold text-white">{booking.serviceName}</span> para el{' '}
            <span className="font-bold text-amber-300">{displayDate}</span> a las{' '}
            <span className="font-bold text-amber-300">{booking.time}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <button
          type="button"
          onClick={() => onViewBooking(booking)}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs shadow-md shadow-amber-950/40 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-black" />
          <span>Ver cita ahora</span>
          <ArrowRight className="w-3 h-3 text-black" />
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="p-1.5 rounded-lg text-amber-400/70 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
          title="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};