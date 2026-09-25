import React, { useState, useEffect } from 'react';
import { Tenant } from '../../../types';
import { GREETING_PRESETS, applyGreetingTemplate } from './greetingPresets';
import { GreetingDropzone } from './GreetingDropzone';
import { Sparkles, Save, CheckCircle2, MessageSquare, Bot, RefreshCw } from 'lucide-react';

interface InitialGreetingSectionProps {
  tenant: Tenant | null;
  onUpdateSettings?: (updates: Partial<Tenant>) => Promise<boolean>;
}

export const InitialGreetingSection: React.FC<InitialGreetingSectionProps> = ({ tenant, onUpdateSettings }) => {
  const [greetingText, setGreetingText] = useState(tenant?.welcome_message || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (tenant?.welcome_message) {
      setGreetingText(tenant.welcome_message);
    }
  }, [tenant?.welcome_message]);

  const handleApplyPreset = (template: string) => {
    const formatted = applyGreetingTemplate(template, tenant?.name || 'Mi Negocio');
    setGreetingText(formatted);
  };

  const handleSave = async () => {
    if (!onUpdateSettings || !greetingText.trim()) return;
    setIsSaving(true);
    setSaveSuccess(false);
    const ok = await onUpdateSettings({ welcome_message: greetingText.trim() });
    setIsSaving(false);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl text-slate-100">
      {/* 1. Selector de Sugerencias Predefinidas */}
      <div className="onyx-card rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Sugerencias y Plantillas Rápidas</h3>
        </div>
        <p className="text-xs text-zinc-400">
          Elige una plantilla lista para usar. El nombre de tu negocio (<span className="text-emerald-400 font-semibold">{tenant?.name || 'Mi Negocio'}</span>) se adaptará automáticamente.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          {GREETING_PRESETS.map((p) => (
            <div
              key={p.id}
              className="bg-[#141313] hover:bg-[#181717] border border-[#262424] hover:border-emerald-500/40 rounded-xl p-3 flex flex-col justify-between transition group"
            >
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold tracking-wider block mb-1">
                  {p.category}
                </span>
                <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
                  {applyGreetingTemplate(p.template, tenant?.name || 'Mi Negocio')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleApplyPreset(p.template)}
                className="mt-2.5 w-full py-1 px-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Usar esta plantilla</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Editor Personalizado + Carga de Archivo */}
      <div className="onyx-card rounded-2xl p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Saludo Inicial Personalizado</h3>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">
            {greetingText.length} caracteres
          </span>
        </div>

        {/* Zona Drag & Drop */}
        <GreetingDropzone onTextLoaded={(text) => setGreetingText(text)} />

        {/* Textarea Manual */}
        <div>
          <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
            Texto del Saludo que verá el cliente
          </label>
          <textarea
            rows={4}
            value={greetingText}
            onChange={(e) => setGreetingText(e.target.value)}
            placeholder="Escribe aquí el saludo inicial exacto que dará el bot al iniciar cada conversación..."
            className="w-full bg-[#121111] border border-[#282626] rounded-xl p-3 text-xs sm:text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/60 resize-y leading-relaxed"
          />
        </div>

        {/* 3. Vista Previa en Vivo WhatsApp Style */}
        <div className="pt-2 border-t border-[#262424]">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">
            Vista Previa en el Chat (Simulación)
          </span>
          <div className="bg-[#0e0d0d] p-3 rounded-xl border border-[#222020] flex items-start gap-2.5 max-w-lg">
            <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-[#181717] border border-[#282626] text-zinc-200 rounded-2xl rounded-tl-none p-3 text-xs leading-relaxed shadow-sm break-words flex-1">
              <p className="whitespace-pre-wrap">{greetingText || 'Escribe un saludo arriba...'}</p>
              <span className="text-[9px] text-zinc-500 block text-right mt-1 font-mono">12:00 PM</span>
            </div>
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ¡Saludo inicial actualizado en Cloudflare D1!
            </span>
          ) : <span />}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !greetingText.trim()}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition disabled:opacity-50 cursor-pointer ml-auto"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Saludo Inicial</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
