import React from 'react';
import { DollarSign, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

export const LandingTrustBar: React.FC = () => {
  const stats = [
    {
      icon: DollarSign,
      color: 'text-[#194c37]',
      value: '$0.00',
      title: 'En comisiones a Meta',
      desc: 'Sin pagar por cada mensaje enviado ni plantillas de WhatsApp.'
    },
    {
      icon: Clock,
      color: 'text-[#9c783c]',
      value: '< 2 seg',
      title: 'Velocidad de respuesta',
      desc: 'Atención instantánea sin dejar que el cliente se enfríe.'
    },
    {
      icon: CheckCircle2,
      color: 'text-[#2a2620]',
      value: '95%',
      title: 'Dudas resueltas en piloto automático',
      desc: 'Horarios, precios, stock y políticas respondidas con precisión.'
    },
    {
      icon: TrendingUp,
      color: 'text-[#9c783c]',
      value: '3.8x',
      title: 'Más conversiones de venta',
      desc: 'Llegan a tu WhatsApp solo clientes decididos con carrito armado.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="p-7 rounded-3xl bg-white border border-[#e5dfd5] shadow-[0_4px_24px_rgba(25,23,20,0.03)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="space-y-1.5 border-l-2 border-[#caa461]/50 pl-4">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${s.color}`} />
                <span className="font-cinzel text-xl sm:text-2xl font-bold text-[#181716] tracking-tight">{s.value}</span>
              </div>
              <p className="text-xs font-bold text-[#2a2620]">{s.title}</p>
              <p className="text-[11px] text-[#6b6459] leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
