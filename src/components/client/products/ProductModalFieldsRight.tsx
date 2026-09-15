import React from 'react';
import { Sparkles, FileText } from 'lucide-react';

interface Props {
  benefits: string;
  setBenefits: (v: string) => void;
  details: string;
  setDetails: (v: string) => void;
}

export const ProductModalFieldsRight: React.FC<Props> = ({
  benefits,
  setBenefits,
  details,
  setDetails
}) => {
  return (
    <div className="space-y-2.5">
      {/* 1. Beneficios */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Beneficios</span>
          </label>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#0c2419] text-emerald-400 border border-emerald-500/40">
            Al lado de la foto
          </span>
        </div>
        <textarea
          rows={4}
          value={benefits}
          onChange={(e) => setBenefits(e.target.value)}
          placeholder="• Atención al cliente inmediata y disponible 24/7&#10;• Reducción de hasta un 80% en los tiempos de respuesta&#10;• Captación y calificación de clientes potenciales en piloto automático"
          className="w-full bg-[#121111] border border-[#282626] rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed font-sans"
        />
        <p className="text-[10px] text-zinc-500 mt-0.5">
          Puntos clave de valor que el cliente verá junto a la foto del producto.
        </p>
      </div>

      {/* 2. Detalle del Producto */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-300">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Detalle del Producto</span>
          </label>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#141f2d] text-blue-400 border border-blue-500/40">
            Al lado de la foto
          </span>
        </div>
        <textarea
          rows={4}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Tecnología: IA generativa avanzada y Procesamiento de Lenguaje Natural (NLP)&#10;• Canales: Integrable en sitios web, WhatsApp, Facebook Messenger o Instagram&#10;• Idiomas: Soporte multilingüe (Español, Inglés, etc.)"
          className="w-full bg-[#121111] border border-[#282626] rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed font-sans"
        />
        <p className="text-[10px] text-zinc-500 mt-0.5">
          Ficha técnica y características que se mostrarán junto a la foto.
        </p>
      </div>
    </div>
  );
};
