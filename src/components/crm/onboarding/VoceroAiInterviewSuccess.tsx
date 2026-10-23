import React from 'react';
import { CheckCircle2, ShoppingBag, ShieldCheck, UserCog, ArrowRight, Sparkles } from 'lucide-react';
import { SetupPayload } from '../../../services/aiOnboardingService';

interface Props {
  payload: SetupPayload;
  onFinish: () => void;
}

export const VoceroAiInterviewSuccess: React.FC<Props> = ({ payload, onFinish }) => {
  const pCount = payload.products?.length || 0;
  const fCount = payload.faqs?.length || 0;

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans animate-in fade-in zoom-in-95 duration-300">
      <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-md">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Configurado con CLICKCHAT y GeoSoft.LAt
        </div>
        <h3 className="text-lg font-bold text-[#0a1730]">¡Tu Negocio y tu Bot Están Listos!</h3>
        <p className="text-xs text-[#62728d] max-w-md mx-auto mt-1">
          La IA recopiló la información de tu entrevista y ha autocompletado todos los módulos en tu CRM.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full max-w-lg text-left mt-2">
        <div className="p-3 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0a1730]">
            <UserCog className="w-4 h-4 text-[#0d5bff]" />
            <span>Perfil & Agente</span>
          </div>
          <p className="text-[11px] text-[#62728d] mt-1 line-clamp-1">
            {payload.tenant?.name || 'Negocio'}
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
            Bot: {payload.tenant?.bot_name || 'Asesor'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0a1730]">
            <ShoppingBag className="w-4 h-4 text-[#0d5bff]" />
            <span>Catálogo</span>
          </div>
          <p className="text-[11px] text-[#62728d] mt-1">
            {pCount} {pCount === 1 ? 'ítem cargado' : 'ítems cargados'}
          </p>
          <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded">
            Precios oficiales
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0a1730]">
            <ShieldCheck className="w-4 h-4 text-[#0d5bff]" />
            <span>FAQ IQ</span>
          </div>
          <p className="text-[11px] text-[#62728d] mt-1">
            {fCount} {fCount === 1 ? 'respuesta lista' : 'respuestas listas'}
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
            Memoria RAG
          </span>
        </div>
      </div>

      <button
        onClick={onFinish}
        className="w-full max-w-md py-3 rounded-xl bg-[#0d5bff] hover:bg-[#0047e1] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
      >
        <span>Entrar a Mi CRM y Ver Resultados</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
