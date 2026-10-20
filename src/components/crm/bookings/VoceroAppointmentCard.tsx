import React from 'react';
import { Clock, CheckCircle2, AlertCircle, User } from 'lucide-react';

export interface AppointmentItem {
  id: string;
  clientName: string;
  serviceName: string;
  dateKey: string;
  displayDate: string;
  time: string;
  status: 'confirmed' | 'pending';
  channel: 'whatsapp' | 'instagram' | 'web';
}

interface Props {
  appointment: AppointmentItem;
}

export const VoceroAppointmentCard: React.FC<Props> = ({ appointment: apt }) => {
  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs flex items-center justify-between gap-4 hover:border-[#b8cced] transition font-sans">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-[#ebf1ff] flex items-center justify-center text-[#0d5bff] font-bold text-xs">
          <User className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#0a1730]">{apt.clientName}</h4>
          <p className="text-[11px] text-[#62728d]">{apt.serviceName}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <span className="font-semibold text-[#0a1730] flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-[#8391aa]" /> {apt.displayDate} · {apt.time}
        </span>

        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
          apt.status === 'confirmed' ? 'bg-[#eaf7ef] text-[#0f8b44]' : 'bg-[#fff5e6] text-[#b36b00]'
        }`}>
          {apt.status === 'confirmed' ? (
            <><CheckCircle2 className="h-3 w-3" /> Confirmada</>
          ) : (
            <><AlertCircle className="h-3 w-3" /> Pendiente</>
          )}
        </span>
      </div>
    </div>
  );
};
