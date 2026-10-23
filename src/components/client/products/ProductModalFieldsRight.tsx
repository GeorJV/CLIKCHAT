import React from 'react';
import { CheckCircle2, FileText } from 'lucide-react';
import { useVoceroMode } from '../../../hooks/useVoceroMode';

interface Props {
  benefits: string;
  setBenefits: (v: string) => void;
  details: string;
  setDetails: (v: string) => void;
  businessType?: string;
}

export const ProductModalFieldsRight: React.FC<Props> = ({
  benefits, setBenefits, details, setDetails, businessType = 'tienda',
}) => {
  const { isVoceroMode } = useVoceroMode();
  const isRestaurant = businessType === 'restaurante', isServices = businessType === 'servicios';

  const benefitsTitle = isRestaurant ? 'Ingredientes y Alérgenos' : isServices ? 'Beneficios y Qué Incluye' : 'Beneficios Clave';
  const detailsTitle = isRestaurant ? 'Notas de Cocina y Preparación' : isServices ? 'Requisitos y Metodología' : 'Detalle & Ficha Técnica';

  const labelCls = `flex items-center gap-1.5 text-[11px] font-bold ${isVoceroMode ? 'text-[#42506b]' : 'text-zinc-300'}`;
  const textareaCls = isVoceroMode
    ? 'w-full bg-[#f8fafc] border border-[#dde5f1] rounded-xl p-3 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:border-[#0d5bff] focus:bg-white resize-none leading-relaxed font-sans transition'
    : 'w-full bg-[#121111] border border-[#2c2a2a] rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:bg-[#151414] resize-none leading-relaxed font-sans transition';

  return (
    <div className="space-y-3 font-sans">
      {/* 1. Beneficios o Ingredientes */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className={labelCls}>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{benefitsTitle}</span>
          </label>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            isVoceroMode ? 'bg-[#ebf1ff] text-[#0038d8] border-[#d3e2ff]' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            Visible en Chat
          </span>
        </div>
        <textarea
          rows={4}
          value={benefits}
          onChange={(e) => setBenefits(e.target.value)}
          placeholder={
            isRestaurant
              ? "• 200g de carne angus de primera calidad\n• Queso cheddar fundido y tocino crujiente\n• Incluye papas rústicas y aderezo especial\n• Alérgenos: Contiene lácteos y gluten"
              : isServices
              ? "• Diagnóstico inicial personalizado\n• Entrega de plan de acción paso a paso\n• Soporte prioritario y garantía de satisfacción"
              : "• Garantía oficial y envío inmediato\n• Materiales de alta resistencia y durabilidad\n• Soporte prioritario"
          }
          className={textareaCls}
        />
        <p className={`text-[10.5px] mt-1 ${isVoceroMode ? 'text-[#8391aa]' : 'text-zinc-500'}`}>
          {isRestaurant
            ? 'Ingredientes, porción o alérgenos que el cliente verá junto al platillo.'
            : isServices
            ? 'Puntos fuertes y entregables que el cliente verá al cotizar el servicio.'
            : 'Puntos clave de valor que el cliente verá junto a la foto del producto.'}
        </p>
      </div>

      {/* 2. Detalle del Producto o Notas de Servicio */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className={labelCls}>
            <FileText className={`w-3.5 h-3.5 ${isVoceroMode ? 'text-[#0d5bff]' : 'text-emerald-400'}`} />
            <span>{detailsTitle}</span>
          </label>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            isVoceroMode ? 'bg-[#f1f5f9] text-[#62728d] border-[#dde5f1]' : 'bg-[#141313] text-zinc-400 border-[#262424]'
          }`}>
            Memoria IA
          </span>
        </div>
        <textarea
          rows={4}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder={
            isRestaurant
              ? "• Tiempo de cocina estimado: 15-20 minutos\n• Término de cocción sugerido: Medio\n• Opción vegetariana disponible bajo solicitud"
              : isServices
              ? "• Duración estimada: 60 minutos\n• Modalidad: Presencial o Virtual vía Meet\n• Requisitos previos: Documentación básica"
              : "• Especificaciones técnicas detalladas\n• Contenido del paquete original\n• Dimensiones y compatibilidad universal"
          }
          className={textareaCls}
        />
        <p className={`text-[10.5px] mt-1 ${isVoceroMode ? 'text-[#8391aa]' : 'text-zinc-500'}`}>
          {isRestaurant
            ? 'Indicaciones de cocina, tiempos y opciones de personalización.'
            : isServices
            ? 'Condiciones, duración y preparación necesaria para brindar el servicio.'
            : 'Ficha técnica y características para resolver dudas de los clientes.'}
        </p>
      </div>
    </div>
  );
};