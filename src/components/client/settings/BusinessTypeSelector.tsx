import React from 'react';
import { ShoppingBag, Calendar, Headphones, CheckCircle2 } from 'lucide-react';

export interface BusinessTypeOption {
  id: 'tienda' | 'servicios' | 'soporte' | string;
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const BUSINESS_TYPE_OPTIONS: BusinessTypeOption[] = [
  {
    id: 'tienda',
    title: 'Vendo Productos / Comida',
    badge: 'Catálogo & Comanda',
    description: 'Catálogo con fotos, precios, venta cruzada de adicionales y comanda a WhatsApp.',
    icon: ShoppingBag,
  },
  {
    id: 'servicios',
    title: 'Vendo Servicios / Agendo Citas',
    badge: 'Citas & Horarios',
    description: 'Tarifas por servicio, consulta de disponibilidad de horarios y reservas.',
    icon: Calendar,
  },
  {
    id: 'soporte',
    title: 'Servicio al Cliente / Asesor',
    badge: 'FAQ & Asesoría',
    description: 'Respuestas automáticas a dudas frecuentes, cotizaciones y derivación a asesor.',
    icon: Headphones,
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
  const normalizedValue = value === 'restaurante' ? 'tienda' : value;

  return (
    <div className="space-y-1.5 w-full font-sans">
      <div className={`grid grid-cols-1 ${compact ? 'gap-2' : 'sm:grid-cols-3 gap-3'}`}>
        {BUSINESS_TYPE_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = normalizedValue === opt.id || value === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                if (opt.id === 'tienda' && value === 'restaurante') {
                  onChange('restaurante');
                } else {
                  onChange(opt.id);
                }
              }}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative group ${
                isSelected
                  ? 'border-[#0d5bff] bg-blue-50/80 ring-2 ring-[#0d5bff]/25 shadow-md text-[#0a1730]'
                  : 'bg-white border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#f8fafc] text-[#334155]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                    isSelected ? 'bg-[#0d5bff] text-white shadow-xs' : 'bg-[#f1f5f9] text-[#0d5bff]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full border transition ${
                    isSelected
                      ? 'bg-[#0d5bff] text-white border-transparent'
                      : 'bg-[#f1f5f9] border-[#e2e8f0] text-[#62728d]'
                  }`}>
                    {opt.badge}
                  </span>
                </div>

                <div>
                  <h4 className={`text-xs font-black tracking-tight transition ${
                    isSelected ? 'text-[#0a1730]' : 'text-[#1e293b]'
                  }`}>
                    {opt.title}
                  </h4>
                  <p className={`text-[11px] mt-1 leading-relaxed line-clamp-2 transition ${
                    isSelected ? 'text-[#334155] font-medium' : 'text-[#62728d]'
                  }`}>
                    {opt.description}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-[#0d5bff] mt-3 pt-2 border-t border-[#0d5bff]/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0d5bff]" />
                  <span>Modalidad Seleccionada</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
