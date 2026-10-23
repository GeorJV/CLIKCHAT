import React from 'react';
import { ExternalLink, HelpCircle, CheckCircle } from 'lucide-react';

export const WhatsAppSetupGuide: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 space-y-4 text-[#0a1730] font-sans shadow-sm">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-[#0d5bff]" />
        <h4 className="text-xs font-bold text-[#0a1730] uppercase tracking-wider">
          Guía Rápida de Vinculación en 3 Pasos (Meta Cloud API)
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
        {/* Paso 1 */}
        <div className="bg-[#f8fafc] p-4 rounded-2xl space-y-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0d5bff] font-black flex items-center justify-center text-[10px]">
              1
            </span>
            <span className="font-bold text-[#0a1730]">Crea tu App en Meta</span>
          </div>
          <p className="text-[11px] text-[#62728d] leading-relaxed">
            Ingresa a <strong>developers.facebook.com</strong> con tu cuenta de Facebook, crea una App de tipo <em>"Otro / Negocios"</em> y agrega el producto <strong>WhatsApp</strong>.
          </p>
          <a
            href="https://developers.facebook.com/apps"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-[#0d5bff] hover:underline font-bold pt-1"
          >
            <span>Abrir Meta Developers</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Paso 2 */}
        <div className="bg-[#f8fafc] p-4 rounded-2xl space-y-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0d5bff] font-black flex items-center justify-center text-[10px]">
              2
            </span>
            <span className="font-bold text-[#0a1730]">Configura el Webhook</span>
          </div>
          <p className="text-[11px] text-[#62728d] leading-relaxed">
            En WhatsApp &gt; Configuración, pega la <strong>URL de Webhook</strong> y tu <strong>Token de Verificación</strong> generados arriba. Suscríbete al campo <code>messages</code>.
          </p>
          <div className="flex items-center gap-1 text-[10.5px] text-emerald-700 font-bold pt-1">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>Verificado automático en Cloudflare</span>
          </div>
        </div>

        {/* Paso 3 */}
        <div className="bg-[#f8fafc] p-4 rounded-2xl space-y-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0d5bff] font-black flex items-center justify-center text-[10px]">
              3
            </span>
            <span className="font-bold text-[#0a1730]">Copia tus Credenciales</span>
          </div>
          <p className="text-[11px] text-[#62728d] leading-relaxed">
            Copia el <strong>Identificador de número de teléfono</strong> y tu <strong>Token de acceso permanente</strong> y pégalos en el botón <em>"Configurar Credenciales"</em>.
          </p>
          <span className="text-[10.5px] text-[#8391aa] block pt-1">
            🔒 Claves encriptadas y protegidas
          </span>
        </div>
      </div>
    </div>
  );
};
