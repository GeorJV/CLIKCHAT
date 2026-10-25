import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, CheckCircle2, Send, Sparkles } from 'lucide-react';
import { ServiceBookingData } from '../../../types/serviceChat';

interface Props {
  bookingData: ServiceBookingData;
  isConfirmed?: boolean;
  businessPhone?: string;
  storeName?: string;
  onConfirm: (data: ServiceBookingData) => void;
}

export const BookingCardBubble: React.FC<Props> = ({
  bookingData, isConfirmed = false, businessPhone = '50672935612', storeName = 'GeoSoft', onConfirm
}) => {
  const [confirmed, setConfirmed] = useState(isConfirmed);
  const [isRevealed, setIsRevealed] = useState(isConfirmed);
  const cleanPhone = (businessPhone || '50672935612').replace(/[^\d]/g, '');

  useEffect(() => {
    if (isRevealed) return;
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 2800);
    return () => clearTimeout(timer);
  }, [isRevealed]);

  const openWhatsAppConfirmation = () => {
    const text = `📅 *CONFIRMACIÓN DE CITA - ${storeName.toUpperCase()}*\n\n` +
      `• *Servicio:* ${bookingData.service?.title || 'Servicio Especializado'}\n` +
      `• *Fecha:* ${bookingData.date}\n` +
      `• *Horario:* ${bookingData.timeSlot}\n` +
      `• *Cliente:* ${bookingData.customerName}\n` +
      (bookingData.customerEmail ? `• *Correo:* ${bookingData.customerEmail}\n` : '') +
      `• *WhatsApp:* ${bookingData.customerPhone}\n` +
      `• *Modalidad:* ${bookingData.service?.serviceModality === 'presencial' ? 'Presencial' : 'Online (Google Meet)'}\n` +
      (bookingData.service?.price ? `• *Inversión:* $${bookingData.service.price} ${bookingData.service.currency || 'USD'}\n` : '') +
      `\n✅ Cita confirmada y registrada en ClikChat. ¡Nos vemos en la sesión!`;
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleConfirmClick = () => {
    setConfirmed(true);
    onConfirm(bookingData);
    openWhatsAppConfirmation();
  };

  if (!isRevealed) {
    return (
      <div className="w-full mt-2 py-2 px-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300 font-sans animate-pulse">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span className="text-[11px] font-medium text-emerald-200">Verificando disponibilidad en agenda oficial...</span>
        </div>
        <span className="text-[10px] text-zinc-400 font-mono">D1 fast query</span>
      </div>
    );
  }

  return (
    <div className="w-full mt-2.5 rounded-2xl bg-[#181717] border border-emerald-500/30 p-3.5 sm:p-4 text-slate-100 shadow-xl shadow-black/60 font-sans transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] animate-in fade-in slide-in-from-bottom-2">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <span>Resumen de tu Cita</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </h4>
            <p className="text-[10px] text-zinc-400">Datos completos y disponibilidad verificada</p>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${confirmed ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'}`}>
          {confirmed ? 'Confirmada' : 'Pendiente'}
        </span>
      </div>

      {/* Details Grid */}
      <div className="space-y-1.5 text-xs text-zinc-300">
        <div className="flex items-start gap-2 bg-[#121111] p-2 rounded-xl border border-white/[0.04]">
          <span className="font-semibold text-emerald-400 shrink-0">📌 Servicio:</span>
          <span className="font-bold text-white truncate">{bookingData.service?.title || 'Servicio Profesional'}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          <div className="flex items-center gap-1.5 bg-[#121111] px-2.5 py-1.5 rounded-lg border border-white/[0.04]">
            <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] text-zinc-200 truncate">{bookingData.date}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#121111] px-2.5 py-1.5 rounded-lg border border-white/[0.04]">
            <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] text-zinc-200">{bookingData.timeSlot}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          <div className="flex items-center gap-1.5 bg-[#121111] px-2.5 py-1.5 rounded-lg border border-white/[0.04]">
            <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="text-[11px] text-zinc-200 truncate">{bookingData.customerName}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#121111] px-2.5 py-1.5 rounded-lg border border-white/[0.04]">
            <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] text-zinc-200 truncate">{bookingData.customerPhone}</span>
          </div>
        </div>
        {bookingData.customerEmail && (
          <div className="flex items-center gap-2 bg-[#121111] px-2.5 py-1.5 rounded-lg border border-white/[0.04]">
            <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-[11px] text-zinc-200 truncate">{bookingData.customerEmail}</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-3 pt-2.5 border-t border-white/[0.08]">
        {!confirmed ? (
          <button
            type="button"
            onClick={handleConfirmClick}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all active:scale-[0.98] cursor-pointer ring-1 ring-emerald-300/30"
          >
            <Calendar className="w-4 h-4" />
            <span>📅 Confirmo cita y guardar</span>
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex-1 w-full py-2 px-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Cita Guardada y Confirmada</span>
            </div>
            <button
              type="button"
              onClick={openWhatsAppConfirmation}
              className="w-full sm:w-auto py-2 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shrink-0"
              title="Abrir en WhatsApp"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ver en WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
