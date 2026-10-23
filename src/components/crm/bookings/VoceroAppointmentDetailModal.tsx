import React from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  FileText,
  DollarSign,
  Phone,
  Trash2,
} from 'lucide-react';
import { AppointmentItem } from './VoceroAppointmentCard';

interface VoceroAppointmentDetailModalProps {
  appointment: AppointmentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleStatus: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const VoceroAppointmentDetailModal: React.FC<VoceroAppointmentDetailModalProps> = ({
  appointment: apt,
  isOpen,
  onClose,
  onToggleStatus,
  onDelete,
}) => {
  if (!isOpen || !apt) return null;

  const cleanPhone = (apt.phone || '').replace(/[^0-9]/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 font-sans animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#e2e8f0] space-y-5">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#e8edf6]">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#ebf1ff] flex items-center justify-center text-[#0d5bff]">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0a1730]">Detalle de la Cita</h3>
              <p className="text-[11px] text-[#62728d]">Ficha de servicio y procedimiento programado</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8391aa] hover:bg-[#f6f8fc] hover:text-[#0a1730] transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Resumen del Cliente y Estado */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#ebf1ff] border border-[#d3e2ff] flex items-center justify-center text-[#0d5bff] font-bold text-sm">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-[13.5px] font-bold text-[#0a1730]">{apt.clientName}</h4>
              <div className="flex items-center gap-2 text-[11px] text-[#62728d] mt-0.5">
                <span className="font-mono text-[#0038d8] font-bold uppercase">{apt.channel}</span>
                {apt.phone && <span>· {apt.phone}</span>}
              </div>
            </div>
          </div>

          <button
            onClick={() => onToggleStatus(apt.id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer shadow-xs ${
              apt.status === 'confirmed'
                ? 'bg-[#eaf7ef] text-[#0f8b44] border border-[#b2e5c6] hover:bg-[#d5eedf]'
                : 'bg-[#fff5e6] text-[#b36b00] border border-[#ffd599] hover:bg-[#ffeac4]'
            }`}
            title="Haz clic para cambiar estado"
          >
            {apt.status === 'confirmed' ? (
              <><CheckCircle2 className="h-3.5 w-3.5" /> Confirmada</>
            ) : (
              <><AlertCircle className="h-3.5 w-3.5" /> Pendiente</>
            )}
          </button>
        </div>

        {/* Detalle del Procedimiento: Qué es lo que se va a hacer */}
        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl border border-[#dde5f1] bg-white space-y-2">
            <div className="flex items-center justify-between text-[#8391aa] text-[11px] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-[#0d5bff]">
                <Briefcase className="h-3.5 w-3.5" /> Servicio o Motivo
              </span>
              {apt.price && (
                <span className="font-mono font-bold text-[#0a1730] text-xs">
                  ${apt.price.toLocaleString()} MXN
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-[#0a1730]">{apt.serviceName}</p>
            <div className="pt-2 border-t border-[#f0f4fa] text-[11.5px] text-[#50617e] leading-relaxed">
              <span className="font-bold text-[#0a1730] block mb-0.5 flex items-center gap-1">
                <FileText className="h-3 w-3 text-[#8391aa]" /> Descripción & Procedimiento:
              </span>
              {apt.notes || 'Cita de atención comercial programada. Se llevará a cabo la revisión de requerimientos, asesoría personalizada y cierre de servicio.'}
            </div>
          </div>

          {/* Horario y Fecha */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl border border-[#dde5f1] bg-[#f8fafc] flex items-center gap-2.5">
              <Calendar className="h-4 w-4 text-[#0d5bff] shrink-0" />
              <div>
                <span className="text-[10px] text-[#8391aa] font-bold uppercase block">Fecha</span>
                <span className="font-bold text-[#0a1730] text-xs">{apt.displayDate}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-[#dde5f1] bg-[#f8fafc] flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-[#0d5bff] shrink-0" />
              <div>
                <span className="text-[10px] text-[#8391aa] font-bold uppercase block">Horario</span>
                <span className="font-bold text-[#0a1730] text-xs font-mono">{apt.time} hrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones del Modal */}
        <div className="flex items-center justify-between pt-3 border-t border-[#e8edf6]">
          {onDelete ? (
            <button
              onClick={() => {
                onDelete(apt.id);
                onClose();
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Eliminar Cita</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            {cleanPhone && (
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#eaf7ef] text-[#0f8b44] hover:bg-[#d5eedf] text-xs font-bold transition cursor-pointer border border-[#c9ebd6]"
              >
                <span>WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#0d5bff] hover:bg-[#0047e1] text-xs font-bold text-white shadow-xs transition cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
