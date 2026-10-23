import React, { useState, useEffect } from 'react';
import { Tenant } from '../../../types';
import { GREETING_PRESETS, applyGreetingTemplate } from './greetingPresets';
import { GreetingDropzone } from './GreetingDropzone';
import { Save, CheckCircle2, MessageSquare, User, RefreshCw } from 'lucide-react';

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
    <div className="space-y-4 max-w-4xl text-[#0a1730] font-sans">
      {/* 1. Selector de Sugerencias Predefinidas - Sin bordes, limpio y resaltadito */}
      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#0d5bff]" />
          <h3 className="text-sm font-bold text-[#0a1730]">Sugerencias y Plantillas Rápidas</h3>
        </div>
        <p className="text-xs text-[#62728d]">
          Elige una plantilla lista para usar. El nombre de tu negocio (<span className="text-[#0d5bff] font-semibold">{tenant?.name || 'Mi Negocio'}</span>) se adaptará automáticamente.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          {GREETING_PRESETS.map((p) => (
            <div
              key={p.id}
              className="bg-[#f8fafc] hover:bg-white rounded-xl p-3.5 flex flex-col justify-between transition shadow-2xs hover:shadow-sm group"
            >
              <div>
                <span className="text-[10px] font-mono uppercase text-[#0d5bff] font-bold tracking-wider block mb-1">
                  {p.category}
                </span>
                <p className="text-xs text-[#334155] line-clamp-3 leading-relaxed">
                  {applyGreetingTemplate(p.template, tenant?.name || 'Mi Negocio')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleApplyPreset(p.template)}
                className="mt-3 w-full py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-[#0d5bff] text-[#0d5bff] hover:text-white text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
              >
                <span>Usar esta plantilla</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Editor Personalizado + Carga de Archivo - Sin bordes */}
      <div className="bg-white rounded-2xl p-5 space-y-3.5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#0d5bff]" />
            <h3 className="text-sm font-bold text-[#0a1730]">Saludo Inicial Personalizado</h3>
          </div>
          <span className="text-[10px] text-[#8391aa] font-mono">
            {greetingText.length} caracteres
          </span>
        </div>

        {/* Zona Drag & Drop */}
        <GreetingDropzone onTextLoaded={(text) => setGreetingText(text)} />

        {/* Textarea Manual */}
        <div>
          <label className="block text-[11px] font-bold text-[#0a1730] uppercase tracking-wider mb-1.5">
            Texto del Saludo que verá el cliente
          </label>
          <textarea
            rows={4}
            value={greetingText}
            onChange={(e) => setGreetingText(e.target.value)}
            placeholder="Escribe aquí el saludo inicial exacto que dará el asistente al iniciar cada conversación..."
            className="w-full bg-[#f8fafc] rounded-xl p-3 text-xs sm:text-sm text-[#0a1730] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 resize-y leading-relaxed shadow-2xs"
          />
        </div>

        {/* 3. Vista Previa en Vivo WhatsApp Style */}
        <div className="pt-2">
          <span className="text-[10px] font-bold text-[#8391aa] uppercase tracking-wider block mb-2">
            Vista Previa en el Chat (Simulación)
          </span>
          <div className="bg-[#f8fafc] p-3.5 rounded-2xl flex items-start gap-2.5 max-w-lg shadow-2xs">
            <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-[#0d5bff] shrink-0 mt-0.5 shadow-xs">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white text-[#0a1730] rounded-2xl rounded-tl-none p-3 text-xs leading-relaxed shadow-xs break-words flex-1">
              <p className="whitespace-pre-wrap">{greetingText || 'Escribe un saludo arriba...'}</p>
              <span className="text-[9px] text-[#8391aa] block text-right mt-1 font-mono">12:00 PM</span>
            </div>
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ¡Saludo inicial actualizado con éxito!
            </span>
          ) : <span />}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !greetingText.trim()}
            className="px-5 py-2.5 rounded-xl bg-[#0d5bff] hover:bg-[#0047e1] text-white font-bold text-xs flex items-center gap-2 shadow-sm hover:shadow transition disabled:opacity-50 cursor-pointer ml-auto"
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
