import React, { useState } from 'react';
import { X, Calendar, Clock, User, Briefcase } from 'lucide-react';
import { AppointmentItem } from './VoceroAppointmentCard';

interface VoceroNewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBooking: (booking: AppointmentItem) => void;
}

export const VoceroNewBookingModal: React.FC<VoceroNewBookingModalProps> = ({
  isOpen,
  onClose,
  onAddBooking,
}) => {
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [notes, setNotes] = useState('');
  const [dateKey, setDateKey] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('10:00');
  const [channel, setChannel] = useState<'whatsapp' | 'instagram' | 'web'>('whatsapp');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !serviceName.trim()) return;

    const parsedDate = new Date(dateKey + 'T00:00:00');
    const displayDate = parsedDate.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
    const capitalizedDisplay = displayDate.charAt(0).toUpperCase() + displayDate.slice(1);

    const newAppointment: AppointmentItem = {
      id: 'apt-' + Date.now(),
      clientName: clientName.trim(),
      serviceName: serviceName.trim(),
      dateKey,
      displayDate: capitalizedDisplay,
      time,
      status: 'confirmed',
      channel,
      phone: phone.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    onAddBooking(newAppointment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 font-sans">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl border border-[#e2e8f0]">
        <div className="flex items-center justify-between pb-3 border-b border-[#e8edf6]">
          <h3 className="text-base font-bold text-[#0a1730]">Nueva Cita o Reservación</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-[#8391aa] hover:text-[#0a1730] cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-[#42506b] mb-1">Nombre del Cliente</label>
            <div className="flex items-center gap-2 rounded-xl border border-[#dde5f1] px-3 py-2 bg-[#f8fafc]">
              <User className="h-3.5 w-3.5 text-[#8391aa]" />
              <input
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="w-full text-xs text-[#0a1730] outline-none bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#42506b] mb-1">Servicio / Motivo</label>
            <div className="flex items-center gap-2 rounded-xl border border-[#dde5f1] px-3 py-2 bg-[#f8fafc]">
              <Briefcase className="h-3.5 w-3.5 text-[#8391aa]" />
              <input
                required
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Ej. Asesoría, Consulta o Servicio"
                className="w-full text-xs text-[#0a1730] outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-[#42506b] mb-1">Fecha</label>
              <div className="flex items-center gap-2 rounded-xl border border-[#dde5f1] px-3 py-2 bg-[#f8fafc]">
                <Calendar className="h-3.5 w-3.5 text-[#8391aa]" />
                <input
                  type="date"
                  required
                  value={dateKey}
                  onChange={(e) => setDateKey(e.target.value)}
                  className="w-full text-xs text-[#0a1730] outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#42506b] mb-1">Hora</label>
              <div className="flex items-center gap-2 rounded-xl border border-[#dde5f1] px-3 py-2 bg-[#f8fafc]">
                <Clock className="h-3.5 w-3.5 text-[#8391aa]" />
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full text-xs text-[#0a1730] outline-none bg-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#42506b] mb-1">Canal de Origen</label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as any)}
              className="w-full rounded-xl border border-[#dde5f1] px-3 py-2 text-xs text-[#0a1730] bg-[#f8fafc] outline-none"
            >
              <option value="whatsapp">WhatsApp Oficial</option>
              <option value="web">Chat Web</option>
              <option value="instagram">Instagram Direct</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e8edf6]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#dde5f1] text-xs font-semibold text-[#42506b] hover:bg-[#f6f8fc] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#0d5bff] hover:bg-[#0047e1] text-xs font-bold text-white shadow-xs cursor-pointer"
            >
              Agendar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
