import React from 'react';
import { LifeBuoy, MessageCircle, Mail, ShieldCheck, Zap, ExternalLink, HelpCircle } from 'lucide-react';

interface SupportTabProps {
  ownerEmail?: string;
  tenantName?: string;
}

export const SupportTab: React.FC<SupportTabProps> = ({ ownerEmail, tenantName }) => {
  const whatsappSupportUrl = 'https://wa.me/50688888888?text=Hola,%20necesito%20soporte%20tecnico%20con%20mi%20bot%20ClikChat';

  return (
    <div className="space-y-4 max-w-5xl text-slate-100 font-sans animate-fade-in">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242323] pb-3.5">
        <div>
          <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-emerald-400" />
            <span>Centro de Soporte & Asistencia</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Estamos disponibles para ayudarte a configurar, calibrar y escalar tu asistente comercial.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Soporte Prioritario Activo</span>
        </div>
      </div>

      {/* Grid de Canales de Contacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* WhatsApp Directo */}
        <div className="onyx-card rounded-2xl p-5 space-y-3.5 border-emerald-500/20 bg-gradient-to-br from-[#161515] to-[#111010]">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">WhatsApp de Soporte VIP</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Atención inmediata con un ingeniero especialista para resolver dudas de integración, prompts y catálogo.
            </p>
          </div>
          <a
            href={whatsappSupportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <span>Contactar por WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Correo y Ticket */}
        <div className="onyx-card rounded-2xl p-5 space-y-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Mesa de Ayuda por Correo</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Envíanos tus consultas técnicas o requerimientos especiales. Respuesta garantizada en menos de 2 horas.
            </p>
          </div>
          <a
            href={`mailto:soporte@clikchat.com?subject=Soporte%20ClikChat%20-%20${encodeURIComponent(tenantName || 'Mi Negocio')}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#201e1e] hover:bg-[#2a2828] border border-[#2e2c2c] text-zinc-200 text-xs font-bold transition cursor-pointer"
          >
            <span>soporte@clikchat.com</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>
        </div>
      </div>

      {/* Estado del Sistema */}
      <div className="onyx-card rounded-2xl p-4 sm:p-5 space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Infraestructura & Estado Operativo</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-[#121111] p-3 rounded-xl border border-[#262424] flex items-center justify-between">
            <span className="text-zinc-400">Cloudflare D1 SQL:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">● 100% Operativo</span>
          </div>
          <div className="bg-[#121111] p-3 rounded-xl border border-[#262424] flex items-center justify-between">
            <span className="text-zinc-400">Workers AI Whisper:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">● 100% Operativo</span>
          </div>
          <div className="bg-[#121111] p-3 rounded-xl border border-[#262424] flex items-center justify-between">
            <span className="text-zinc-400">CDN Edge & SSL:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">● Activo 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
};
