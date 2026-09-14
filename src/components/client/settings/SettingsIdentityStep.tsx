import React from 'react';
import { Store, Save, CheckCircle2, ExternalLink } from 'lucide-react';

interface SettingsIdentityStepProps {
  name: string;
  setName: (val: string) => void;
  slug: string;
  setSlug: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  agentName: string;
  setAgentName: (val: string) => void;
  agentRole: string;
  setAgentRole: (val: string) => void;
  faqBase: string;
  setFaqBase: (val: string) => void;
  isSaving: boolean;
  saveSuccess: boolean;
  onSave: (e: React.FormEvent) => void;
  onLivePreview?: () => void;
}

export const SettingsIdentityStep: React.FC<SettingsIdentityStepProps> = ({
  name, setName,
  slug, setSlug,
  phone, setPhone,
  agentName, setAgentName,
  agentRole, setAgentRole,
  faqBase, setFaqBase,
  isSaving,
  saveSuccess,
  onSave,
  onLivePreview
}) => {
  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
          <Store className="w-4 h-4 text-emerald-400" />
          <span>2. Datos de Identidad Comercial & Cobro Sinpe / WhatsApp</span>
        </h3>
        <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 font-bold text-[10px] rounded-full border border-emerald-500/20">
          Paso 2 de 3
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
        <div>
          <label className="block font-bold mb-1 text-slate-300">Nombre Comercial del Negocio *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-bold focus:outline-none focus:border-emerald-500"
            placeholder="Ej. Boutique Bella Costa Rica"
          />
        </div>

        <div>
          <label className="block font-bold mb-1 text-slate-300">Número Q Oficial / Identificador *</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().trim())}
            className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
            placeholder="Ej. 222 o mi-tienda"
          />
        </div>

        <div>
          <label className="block font-bold mb-1 text-slate-300">Teléfono WhatsApp / Sinpe Móvil *</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
            placeholder="8888-9999 o +506..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs pt-1">
        <div>
          <label className="block font-bold mb-1 text-slate-300">Nombre del Asesor IA</label>
          <input
            type="text"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-bold focus:outline-none focus:border-emerald-500"
            placeholder="Ej. Jessy o Sofía"
          />
        </div>

        <div>
          <label className="block font-bold mb-1 text-slate-300">Rol o Especialidad del Asesor</label>
          <input
            type="text"
            value={agentRole}
            onChange={(e) => setAgentRole(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-bold focus:outline-none focus:border-emerald-500"
            placeholder="Ej. Asesor Comercial & Ventas"
          />
        </div>
      </div>

      <div className="text-xs pt-1">
        <label className="block font-bold mb-1 text-slate-300">Información del Negocio, Horarios & FAQ Base</label>
        <textarea
          rows={3}
          value={faqBase}
          onChange={(e) => setFaqBase(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-200 font-normal focus:outline-none focus:border-emerald-500 leading-relaxed text-xs"
          placeholder="Horario: Lunes a Sábado de 9am a 6pm. Entregas a todo el país. Métodos de pago: Sinpe Móvil y efectivo."
        />
      </div>

      <div className="pt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Guardando en D1...' : '✓ Guardar y Sincronizar Configuración'}</span>
        </button>

        {onLivePreview && (
          <button
            type="button"
            onClick={onLivePreview}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-2 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-emerald-400" />
            <span>Probar Chatbot en Vivo</span>
          </button>
        )}

        {saveSuccess && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" /> ¡Sincronizado con éxito en D1!
          </span>
        )}
      </div>
    </div>
  );
};
