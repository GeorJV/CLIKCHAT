import React from 'react';
import { X, Sparkles, ShieldCheck, Check, Clock, Globe } from 'lucide-react';
import { ServiceItem } from '../../../types/serviceChat';

interface Props {
  service: ServiceItem | null;
  mode: 'includes' | 'requirements';
  onClose: () => void;
  onProceedBooking: (s: ServiceItem) => void;
}

export const ServiceDetailModal: React.FC<Props> = ({
  service,
  mode,
  onClose,
  onProceedBooking,
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#181717] border border-[#282626] rounded-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#282626] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              {mode === 'includes' ? <Sparkles className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {mode === 'includes' ? '¿Qué incluye la sesión?' : 'Requisitos y Garantía'}
              </h3>
              <p className="text-[11px] text-zinc-400 truncate max-w-[240px]">{service.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#222020] hover:bg-[#2c2929] text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-3 text-xs pr-1">
          {mode === 'includes' ? (
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-[#141313] border border-[#242222] flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-zinc-300 font-semibold"><Clock className="w-3.5 h-3.5 text-emerald-400" />{service.duration || '45 min'}</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase text-[10px]"><Globe className="w-3.5 h-3.5" />{service.serviceModality || 'Online'}</span>
              </div>
              {(service.benefits && service.benefits.length > 0 ? service.benefits : [
                'Diagnóstico personalizado 1 a 1.',
                'Plan de recomendaciones en PDF.',
                'Soporte de dudas durante 30 días.'
              ]).map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#141313] border border-[#242222] text-zinc-200">
                  <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {(service.requirements && service.requirements.length > 0 ? service.requirements : [
                'Puntualidad en el enlace de videollamada.',
                'Dispositivo con cámara y audio activos.',
                'Garantía de satisfacción: si no quedas conforme, reagendamos sin costo adicional.'
              ]).map((req, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#141313] border border-[#242222] text-zinc-200">
                  <span className="w-5 h-5 rounded-full bg-teal-950 text-teal-400 border border-teal-800/60 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">ℹ</span>
                  <span className="leading-relaxed">{req}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center gap-2 border-t border-[#282626]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#222020] hover:bg-[#2c2929] text-zinc-300 font-bold text-xs transition cursor-pointer"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => onProceedBooking(service)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition cursor-pointer"
          >
            Agendar Cita
          </button>
        </div>
      </div>
    </div>
  );
};
