import React from 'react';
import { ExternalLink, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

export const WhatsAppSetupGuide: React.FC = () => {
  return (
    <div className="bg-[#151414] border border-[#262424] rounded-2xl p-5 space-y-4 text-zinc-100">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
          Guía Rápida de Vinculación en 3 Pasos (Meta Cloud API)
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Paso 1 */}
        <div className="bg-[#1b1a1a] border border-[#2b2828] p-3.5 rounded-xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-[10px]">
              1
            </span>
            <span className="font-bold text-white">Crea tu App en Meta</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Ingresa a <strong>developers.facebook.com</strong> con tu cuenta de Facebook, crea una App de tipo <em>"Otro / Negocios"</em> y agrega el producto <strong>WhatsApp</strong>.
          </p>
          <a
            href="https://developers.facebook.com/apps"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline font-semibold pt-1"
          >
            <span>Abrir Meta Developers</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Paso 2 */}
        <div className="bg-[#1b1a1a] border border-[#2b2828] p-3.5 rounded-xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-[10px]">
              2
            </span>
            <span className="font-bold text-white">Configura el Webhook</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            En la sección <strong>WhatsApp ➔ Configuración</strong>, pega la <strong>URL del Webhook</strong> y el <strong>Verify Token</strong> de arriba. Suscríbete al evento de <code>messages</code>.
          </p>
          <div className="text-[10px] text-emerald-400 bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
            ✓ Activación instantánea &lt;10ms
          </div>
        </div>

        {/* Paso 3 */}
        <div className="bg-[#1b1a1a] border border-[#2b2828] p-3.5 rounded-xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-[10px]">
              3
            </span>
            <span className="font-bold text-white">Copia tus Credenciales</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Copia el <strong>Identificador de número de teléfono</strong> y tu <strong>Token de acceso temporal o de usuario de sistema</strong> y pégalos en el botón <em>"Configurar Credenciales"</em>.
          </p>
          <div className="text-[10px] text-zinc-400 bg-zinc-900/60 p-1.5 rounded-lg border border-zinc-800">
            ¡Tu bot responderá al instante por WhatsApp!
          </div>
        </div>
      </div>
    </div>
  );
};
