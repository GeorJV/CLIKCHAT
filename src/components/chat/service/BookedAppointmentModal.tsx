import React from 'react';
import { X, CalendarCheck, Clock, User, Mail, Phone, Briefcase, Send, CheckCircle2 } from 'lucide-react';
import { ServiceBookingData } from '../../../types/serviceChat';

interface Props {
  booking: ServiceBookingData;
  storeName?: string;
  businessPhone?: string;
  onClose: () => void;
}

export const BookedAppointmentModal: React.FC<Props> = ({
  booking, storeName = 'GeoSoft', businessPhone = '50672935612', onClose
}) => {
  const cleanPhone = (businessPhone || '50672935612').replace(/[^\d]/g, '');

  const openWhatsApp = () => {
    const text = `Hola ${storeName}, tengo reservada mi cita para el *${booking.date}* a las *${booking.timeSlot}* para el servicio *${booking.service?.title || 'Servicio'}* a nombre de *${booking.customerName}*. Deseo consultar detalles adicionales.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-md rounded-2xl bg-[#181717] border border-emerald-500/40 p-5 text-slate-100 shadow-2xl shadow-emerald-950/40 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-emerald-500/20 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Tu Cita Marcada</h3>
            <p className="text-xs text-emerald-400 font-medium">{storeName} • Confirmada</p>
          </div>
        </div>

        {/* Highlight Banner */}
        <div className="rounded-xl bg-gradient-to-br from-emerald-950/40 to-[#121111] border border-emerald-500/30 p-3.5 mb-4 text-center">
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-400 block mb-0.5">Espacio Reservado para Ti</span>
          <div className="text-lg font-black text-white">{booking.date}</div>
          <div className="text-sm font-bold text-emerald-300 flex items-center justify-center gap-1.5 mt-0.5">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{booking.timeSlot}</span>
          </div>
        </div>

        {/* Info Rows */}
        <div className="space-y-2 mb-5 text-xs text-zinc-300">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#121111] border border-white/[0.04]">
            <Briefcase className="w-4 h-4 text-zinc-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-zinc-500 block leading-none">Servicio</span>
              <span className="font-semibold text-white truncate block">{booking.service?.title || 'Servicio'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#121111] border border-white/[0.04]">
            <User className="w-4 h-4 text-zinc-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-zinc-500 block leading-none">Cliente</span>
              <span className="font-semibold text-white truncate block">{booking.customerName}</span>
            </div>
          </div>
          {booking.customerEmail && (
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#121111] border border-white/[0.04]">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-zinc-500 block leading-none">Correo Electrónico</span>
                <span className="font-semibold text-white truncate block">{booking.customerEmail}</span>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#121111] border border-white/[0.04]">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-zinc-500 block leading-none">WhatsApp de Contacto</span>
              <span className="font-semibold text-white block">{booking.customerPhone}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold mb-4 bg-emerald-500/10 py-1.5 rounded-lg border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Registrada y asegurada en el sistema</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openWhatsApp}
            className="flex-1 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Consultar por WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-[#262424] hover:bg-[#323030] text-zinc-300 hover:text-white font-bold text-xs transition active:scale-95 cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
