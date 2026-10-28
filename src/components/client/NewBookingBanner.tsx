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
    <div className="relative mb-3.5 w-full rounded-2xl bg-gradient-to-r from-sky-50/95 via-[#f0f6ff] to-emerald-50/90 border border-sky-200/90 p-3 sm:px-4 sm:py-3 shadow-md shadow-blue-500/5 text-[#0a1730] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in font-sans select-none">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/15 via-sky-400/25 to-emerald-400/20 border border-sky-200 flex items-center justify-center text-[#0d5bff] shadow-xs">
            <BellRing className="w-5 h-5 animate-bounce text-[#0d5bff]" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-white" />
          </span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#0d5bff] to-blue-600 text-white font-sans shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
              ¡Cita Nueva Agendada!
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Confirmada
            </span>
            <span className="text-xs sm:text-[13px] font-bold text-[#0a1730] truncate">
              {booking.clientName}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-[#4b5563] mt-1 truncate sm:whitespace-normal">
            Reservó <span className="font-semibold text-[#0a1730]">{booking.serviceName}</span> para el{' '}
            <span className="font-bold text-[#0d5bff] bg-blue-50/90 px-1.5 py-0.5 rounded-md border border-blue-200/60">{displayDate}</span> a las{' '}
            <span className="font-bold text-emerald-700 bg-emerald-50/90 px-1.5 py-0.5 rounded-md border border-emerald-200/60">{booking.time}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <button
          type="button"
          onClick={() => onViewBooking(booking)}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0d5bff] to-[#0047e1] hover:from-[#0047e1] hover:to-[#0038b3] text-white font-bold text-xs shadow-sm shadow-blue-500/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-white" />
          <span>Ver cita ahora</span>
          <ArrowRight className="w-3 h-3 text-white" />
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          title="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
