import React from 'react';
import { ExternalLink, HelpCircle, CheckCircle } from 'lucide-react';
import { useVoceroMode } from '../../../hooks/useVoceroMode';

export const WhatsAppSetupGuide: React.FC = () => {
  const { isVoceroMode } = useVoceroMode();

  return (
    <div className={`rounded-2xl p-5 sm:p-6 space-y-4 font-sans ${
      isVoceroMode ? 'bg-white shadow-sm text-[#0a1730]' : 'bg-[#181717] border border-[#282626] text-white shadow-lg'
    }`}>
      <div className="flex items-center gap-2">
        <HelpCircle className={`w-4 h-4 ${isVoceroMode ? 'text-[#0d5bff]' : 'text-emerald-400'}`} />
        <h4 className={`text-xs font-bold uppercase tracking-wider ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>
          Guía Rápida de Vinculación en 3 Pasos (Meta Cloud API)
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
        {/* Paso 1 */}
        <div className={`p-4 rounded-2xl space-y-2 shadow-2xs ${isVoceroMode ? 'bg-[#f8fafc]' : 'bg-[#141313] border border-[#262424]'}`}>
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full font-black flex items-center justify-center text-[10px] ${
              isVoceroMode ? 'bg-blue-100 text-[#0d5bff]' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              1
            </span>
            <span className={`font-bold ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>Crea tu App en Meta</span>
          </div>
          <p className={`text-[11px] leading-relaxed ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'}`}>
            Ingresa a <strong>developers.facebook.com</strong> con tu cuenta de Facebook, crea una App de tipo <em>"Otro / Negocios"</em> y agrega el producto <strong>WhatsApp</strong>.
          </p>
          <a
            href="https://developers.facebook.com/apps"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 text-[11px] hover:underline font-bold pt-1 ${
              isVoceroMode ? 'text-[#0d5bff]' : 'text-emerald-400'
            }`}
          >
            <span>Abrir Meta Developers</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Paso 2 */}
        <div className={`p-4 rounded-2xl space-y-2 shadow-2xs ${isVoceroMode ? 'bg-[#f8fafc]' : 'bg-[#141313] border border-[#262424]'}`}>
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full font-black flex items-center justify-center text-[10px] ${
              isVoceroMode ? 'bg-blue-100 text-[#0d5bff]' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              2
            </span>
            <span className={`font-bold ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>Configura el Webhook</span>
          </div>
          <p className={`text-[11px] leading-relaxed ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'}`}>
            En WhatsApp &gt; Configuración, pega la <strong>URL de Webhook</strong> y tu <strong>Token de Verificación</strong> generados arriba. Suscríbete al campo <code>messages</code>.
          </p>
          <div className={`flex items-center gap-1 text-[10.5px] font-bold pt-1 ${isVoceroMode ? 'text-emerald-700' : 'text-emerald-400'}`}>
            <CheckCircle className="w-3 h-3" />
            <span>Verificado automático en Cloudflare</span>
          </div>
        </div>

        {/* Paso 3 */}
        <div className={`p-4 rounded-2xl space-y-2 shadow-2xs ${isVoceroMode ? 'bg-[#f8fafc]' : 'bg-[#141313] border border-[#262424]'}`}>
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full font-black flex items-center justify-center text-[10px] ${
              isVoceroMode ? 'bg-blue-100 text-[#0d5bff]' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              3
            </span>
            <span className={`font-bold ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>Copia tus Credenciales</span>
          </div>
          <p className={`text-[11px] leading-relaxed ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'}`}>
            Copia el <strong>Identificador de número de teléfono</strong> y tu <strong>Token de acceso permanente</strong> y pégalos en el botón <em>"Configurar Credenciales"</em>.
          </p>
          <span className={`text-[10.5px] block pt-1 ${isVoceroMode ? 'text-[#8391aa]' : 'text-zinc-500'}`}>
            🔒 Claves encriptadas y protegidas
          </span>
        </div>
      </div>
    </div>
  );
};