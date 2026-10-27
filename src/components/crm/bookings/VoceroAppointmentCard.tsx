import React from 'react';
import { Clock, CheckCircle2, AlertCircle, User, Trash2 } from 'lucide-react';

export interface AppointmentItem {
  id: string;
  clientName: string;
  serviceName: string;
  dateKey: string;
  displayDate: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  channel: 'whatsapp' | 'instagram' | 'web';
  phone?: string;
  notes?: string;
  price?: number;
}

interface Props {
  appointment: AppointmentItem;
  onToggleStatus?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSelectAppointment?: (appointment: AppointmentItem) => void;
  isHighlighted?: boolean;
  onHover?: () => void;
}

export const VoceroAppointmentCard: React.FC<Props> = ({
  appointment: apt,
  onToggleStatus,
  onDelete,
  onSelectAppointment,
  isHighlighted = false,
  onHover,
}) => {
  return (
    <div
      id={`vocero-apt-${apt.id}`}
      onMouseEnter={() => { if (isHighlighted && onHover) onHover(); }}
      className={`rounded-2xl p-4 shadow-xs flex items-center justify-between gap-4 transition-all duration-500 font-sans ${
        isHighlighted
          ? 'bg-gradient-to-r from-amber-50/95 via-orange-50/80 to-white border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-2 ring-amber-400/30 scale-[1.01]'
          : 'border border-[#e2e8f0] bg-white hover:border-[#b8cced]'
      }`}
    >
      <div
        onClick={() => onSelectAppointment && onSelectAppointment(apt)}
        className="flex items-center gap-3 cursor-pointer group"
        title="Haz clic para ver el detalle de la cita"
      >
        <div className={`h-10 w-10 rounded-xl transition flex items-center justify-center font-bold text-xs shrink-0 ${isHighlighted ? 'bg-amber-100 text-amber-700' : 'bg-[#ebf1ff] group-hover:bg-[#d8e6ff] text-[#0d5bff]'}`}>
          <User className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs font-bold text-[#0a1730] group-hover:text-[#0d5bff] transition">
              {apt.clientName}
            </h4>
            <span className="text-[10px] text-[#8391aa] uppercase font-mono">({apt.channel})</span>
            {isHighlighted && (
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-black animate-pulse font-mono shadow-xs">
                ✨ NUEVA CITA · Pasa el cursor aquí
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#62728d]">{apt.serviceName}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <span className="font-semibold text-[#0a1730] flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-[#8391aa]" /> {apt.displayDate} · {apt.time}
        </span>

        <button
          onClick={() => onToggleStatus && onToggleStatus(apt.id)}
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition cursor-pointer ${
            apt.status === 'confirmed' ? 'bg-[#eaf7ef] text-[#0f8b44] hover:bg-[#d5eedf]' : 'bg-[#fff5e6] text-[#b36b00] hover:bg-[#ffeac4]'
          }`}
          title="Haz clic para cambiar estado"
        >
          {apt.status === 'confirmed' ? (
            <><CheckCircle2 className="h-3 w-3" /> Confirmada</>
          ) : (
            <><AlertCircle className="h-3 w-3" /> Pendiente</>
          )}
        </button>

        {onDelete && (
          <button
            onClick={() => onDelete(apt.id)}
            className="p-1 rounded-lg text-[#8391aa] hover:text-rose-500 hover:bg-rose-50 transition cursor-pointer"
            title="Eliminar cita"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
