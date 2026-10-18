import React from 'react';
import { ShoppingBag, Calendar, Headphones, CheckCircle2 } from 'lucide-react';

export interface BusinessTypeOption {
  id: 'tienda' | 'servicios' | 'soporte' | string;
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  borderColor: string;
  activeBg: string;
}

export const BUSINESS_TYPE_OPTIONS: BusinessTypeOption[] = [
  {
    id: 'tienda',
    title: 'Vendo Productos / Comida',
    badge: 'Catálogo & Comanda',
    description: 'Catálogo con fotos, precios, venta cruzada de adicionales y comanda a WhatsApp.',
    icon: ShoppingBag,
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500',
    activeBg: 'bg-emerald-950/40'
  },
  {
    id: 'servicios',
    title: 'Vendo Servicios / Agendo Citas',
    badge: 'Citas & Horarios',
    description: 'Tarifas por servicio, consulta de disponibilidad de horarios y reservas.',
    icon: Calendar,
    accentColor: 'text-blue-400',
    borderColor: 'border-blue-500',
    activeBg: 'bg-blue-950/40'
  },
  {
    id: 'soporte',
    title: 'Servicio al Cliente / Asesor',
    badge: 'FAQ & Asesoría',
    description: 'Respuestas automáticas a dudas frecuentes, cotizaciones y derivación a asesor.',
    icon: Headphones,
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500',
    activeBg: 'bg-amber-950/40'
  }
];

interface BusinessTypeSelectorProps {
  value: string;
  onChange: (type: string) => void;
  compact?: boolean;
}

export const BusinessTypeSelector: React.FC<BusinessTypeSelectorProps> = ({
  value,
  onChange,
  compact = false
}) => {
  // Mapear variantes existentes como 'restaurante' a 'tienda' si fuera necesario para selección visual
  const normalizedValue = value === 'restaurante' ? 'tienda' : value;

  return (
    <div className="space-y-1.5 w-full">
      <div className={`grid grid-cols-1 ${compact ? 'gap-2' : 'sm:grid-cols-3 gap-2.5'}`}>
        {BUSINESS_TYPE_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = normalizedValue === opt.id || value === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative group ${
                isSelected
                  ? `${opt.borderColor} ${opt.activeBg} ring-1.5 ${opt.borderColor} shadow-lg shadow-black/40`
                  : 'bg-[#121111] border-[#262424] hover:border-zinc-700 hover:bg-[#161515]'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 ${
                    isSelected ? 'bg-white/10' : 'bg-[#181717]'
                  }`}>
                    <Icon className={`w-4 h-4 ${opt.accentColor}`} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isSelected
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}>
                    {opt.badge}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition">
                    {opt.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-snug line-clamp-2">
                    {opt.description}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 mt-2.5 pt-1.5 border-t border-white/5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Seleccionado</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
