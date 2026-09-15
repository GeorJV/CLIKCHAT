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
    <div className="space-y-4">
      {/* 1. Beneficios */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Beneficios</span>
          </label>
          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-500/40">
            Al lado de la foto
          </span>
        </div>
        <textarea
          rows={5}
          value={benefits}
          onChange={(e) => setBenefits(e.target.value)}
          placeholder="• Atención al cliente inmediata y disponible 24/7&#10;• Reducción de hasta un 80% en los tiempos de respuesta&#10;• Captación y calificación de clientes potenciales en piloto automático"
          className="w-full bg-[#16202e] border border-slate-700/70 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500 resize-y leading-relaxed font-sans"
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Puntos clave de valor que el cliente verá junto a la foto del producto.
        </p>
      </div>

      {/* 2. Detalle del Producto */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Detalle del Producto</span>
          </label>
          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-950/70 text-blue-400 border border-blue-500/40">
            Al lado de la foto
          </span>
        </div>
        <textarea
          rows={5}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Tecnología: IA generativa avanzada y Procesamiento de Lenguaje Natural (NLP)&#10;• Canales: Integrable en sitios web, WhatsApp, Facebook Messenger o Instagram&#10;• Idiomas: Soporte multilingüe (Español, Inglés, etc.)"
          className="w-full bg-[#16202e] border border-slate-700/70 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500 resize-y leading-relaxed font-sans"
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Ficha técnica y características que se mostrarán junto a la foto.
        </p>
      </div>
    </div>
  );
};
