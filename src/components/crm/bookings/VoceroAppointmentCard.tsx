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
}

interface Props {
  appointment: AppointmentItem;
  onToggleStatus?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const VoceroAppointmentCard: React.FC<Props> = ({ appointment: apt, onToggleStatus, onDelete }) => {
  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs flex items-center justify-between gap-4 hover:border-[#b8cced] transition font-sans">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-[#ebf1ff] flex items-center justify-center text-[#0d5bff] font-bold text-xs">
          <User className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-[#0a1730]">{apt.clientName}</h4>
            <span className="text-[10px] text-[#8391aa] uppercase font-mono">({apt.channel})</span>
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
