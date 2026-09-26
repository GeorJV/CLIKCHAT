import React from 'react';
import { Sparkles, FileText } from 'lucide-react';

interface Props {
  benefits: string;
  setBenefits: (v: string) => void;
  details: string;
  setDetails: (v: string) => void;
  businessType?: string;
}

export const ProductModalFieldsRight: React.FC<Props> = ({
  benefits,
  setBenefits,
  details,
  setDetails,
  businessType = 'tienda'
}) => {
  const isRestaurant = businessType === 'restaurante';

  return (
    <div className="space-y-2.5">
      {/* 1. Beneficios o Ingredientes */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isRestaurant ? 'Ingredientes y Alérgenos' : 'Beneficios Clave'}</span>
          </label>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#0c2419] text-emerald-400 border border-emerald-500/40">
            Al lado de la foto
          </span>
        </div>
        <textarea
          rows={4}
          value={benefits}
          onChange={(e) => setBenefits(e.target.value)}
          placeholder={
            isRestaurant
              ? "• 200g de carne angus de primera calidad\n• Queso cheddar fundido y tocino crujiente\n• Incluye porción de papas rústicas y salsa especial\n• Alérgenos: Contiene lácteos y gluten"
              : "• Garantía oficial y envío inmediato\n• Materiales de alta resistencia y durabilidad\n• Soporte prioritario"
          }
          className="w-full bg-[#121111] border border-[#282626] rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed font-sans"
        />
        <p className="text-[10px] text-zinc-500 mt-0.5">
          {isRestaurant ? 'Ingredientes, porción o alérgenos que el comensal verá junto al plato.' : 'Puntos clave de valor que el cliente verá junto a la foto del producto.'}
        </p>
      </div>

      {/* 2. Detalle del Producto o Notas de Cocina */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-300">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>{isRestaurant ? 'Notas de Cocina y Preparación' : 'Detalle del Producto'}</span>
          </label>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#141f2d] text-blue-400 border border-blue-500/40">
            Al lado de la foto
          </span>
        </div>
        <textarea
          rows={4}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder={
            isRestaurant
              ? "• Tiempo de preparación: 15-20 minutos\n• Término de cocción sugerido: Término medio\n• Opción vegetariana disponible bajo solicitud"
              : "• Especificaciones técnicas detalladas\n• Contenido del paquete\n• Dimensiones y compatibilidad"
          }
          className="w-full bg-[#121111] border border-[#282626] rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed font-sans"
        />
        <p className="text-[10px] text-zinc-500 mt-0.5">
          {isRestaurant ? 'Indicaciones de cocina, tiempos y opciones de personalización.' : 'Ficha técnica y características que se mostrarán junto a la foto.'}
        </p>
      </div>
    </div>
  );
};
