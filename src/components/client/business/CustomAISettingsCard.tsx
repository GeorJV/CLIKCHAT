import React, { useState, useEffect } from 'react';
import { Tenant } from '../../../types';
import { UtensilsCrossed, ShoppingBag, Calendar, Sparkles, Key, CheckCircle2, ShieldCheck, Eye, EyeOff, ChevronDown, ChevronUp, Bot, TrendingUp, Zap, Receipt } from 'lucide-react';

interface Props {
  tenant: Tenant | null; onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>; saveSuccess: boolean;
}

export const CustomAISettingsCard: React.FC<Props> = ({ tenant, onUpdateSettings, saveSuccess }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [aiMode, setAiMode] = useState<'system' | 'custom'>('system');
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('google');
  const [customModel, setCustomModel] = useState('');
  const [showKey, setShowKey] = useState(false); const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (tenant?.custom_llm_key) {
      const raw = tenant.custom_llm_key.trim();
      if (raw.startsWith('{')) {
        try {
          const parsed = JSON.parse(raw);
          setApiKey(parsed.key || ''); setProvider(parsed.provider || 'google');
          setCustomModel(parsed.model || ''); setAiMode('custom'); setShowAdvanced(true);
          return;
        } catch {}
      }
      setApiKey(raw); setAiMode('custom'); setShowAdvanced(true);
    }
  }, [tenant]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    let finalKey = null;
    if (aiMode === 'custom' && apiKey.trim()) finalKey = JSON.stringify({ provider, key: apiKey.trim(), model: customModel.trim() || undefined });
    await onUpdateSettings({ custom_llm_key: finalKey as any });
    setIsSaving(false);
  };

  const isRestaurant = !tenant?.business_type || tenant.business_type === 'restaurante';
  const isServices = tenant?.business_type === 'servicios';

  const cfg = isRestaurant ? {
    badge: 'Motor Gastronómico de Ventas: ACTIVO', icon: UtensilsCrossed,
    title: 'Especialista Gastronómico, Mesera Pro & Copywriting',
    desc: 'Calibrado para hospitalidad, venta sugestiva (upselling), cálculo de comanda y atención rápida de comensales.',
    skills: [
      { icon: Sparkles, title: 'Copywriting Apetitoso', text: 'Describe platillos, combos e ingredientes con lenguaje persuasivo y tentador.' },
      { icon: TrendingUp, title: 'Venta Cruzada Proactiva', text: 'Sugiere automáticamente acompañamientos y bebidas para elevar el ticket promedio.' },
      { icon: Receipt, title: 'Gestor de Comandas & Cuenta', text: 'Suma y calcula dinámicamente la cuenta del cliente en tiempo real.' },
      { icon: Zap, title: 'Velocidad en Hora Pico (<1s)', text: 'Respuestas instantáneas y naturales sin retrasos ni saturaciones.' }
    ]
  } : isServices ? {
    badge: 'Motor de Agendamiento & Servicios: ACTIVO', icon: Calendar,
    title: 'Especialista en Agendamiento, Citas & Calificación',
    desc: 'Calibrado para filtrado de prospectos, resolución de dudas y reserva guiada de citas.',
    skills: [
      { icon: Sparkles, title: 'Calificación de Prospectos', text: 'Identifica necesidades y perfila clientes potenciales para tu consulta.' },
      { icon: TrendingUp, title: 'Explicación de Procedimientos', text: 'Resuelve dudas sobre sesiones, duración, requisitos y valor del servicio.' },
      { icon: Receipt, title: 'Agendamiento Asistido', text: 'Coordina horarios y captura datos de contacto directamente al WhatsApp.' },
      { icon: Zap, title: 'Disponibilidad Continua', text: 'Atención 24/7 sin perder solicitudes fuera de horario de oficina.' }
    ]
  } : {
    badge: 'Motor Retail & Catálogo: ACTIVO', icon: ShoppingBag,
    title: 'Especialista en Ventas de Catálogo & Comercio',
    desc: 'Calibrado para recomendación de inventario, resolución de dudas y cierre ágil de ventas.',
    skills: [
      { icon: Sparkles, title: 'Recomendación Inteligente', text: 'Sugiere productos basados en preferencias, talla o presupuesto del cliente.' },
      { icon: TrendingUp, title: 'Manejo de Objeciones', text: 'Resuelve dudas de envíos, métodos de pago y garantías con seguridad.' },
      { icon: Receipt, title: 'Cierre Directo de Compra', text: 'Guía al cliente al botón de compra o enlace de checkout directo.' },
      { icon: Zap, title: 'Atención Simultánea 24/7', text: 'Capaz de atender cientos de clientes al mismo tiempo sin esperas.' }
    ]
  };

  const IconComponent = cfg.icon;

  return (
    <div className="onyx-card rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl border border-[#282626] bg-[#121111]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242323] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{cfg.title}</h3>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{cfg.desc}</p>
          </div>
        </div>
        <div className="self-start sm:self-auto shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {cfg.badge}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cfg.skills.map((s, idx) => {
          const SIcon = s.icon;
          return (
            <div key={idx} className="p-3.5 rounded-xl border border-[#252323] bg-[#171515] hover:border-emerald-500/30 transition">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400"><SIcon className="w-3.5 h-3.5" /></div>
                <h4 className="text-xs font-bold text-white">{s.title}</h4>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{s.text}</p>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl border border-[#252323] bg-gradient-to-r from-emerald-950/20 to-zinc-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><Bot className="w-4 h-4" /></div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>{tenant?.bot_name || 'Asesora Virtual'}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-mono">Mesera Gastronómica</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Asignada y activa para {tenant?.name || 'tu negocio'} • Mantenimiento automático 24/7</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Calibrado & Gestionado</span>
        </div>
      </div>

      <div className="pt-2 border-t border-[#222]">
        <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="text-[11px] text-zinc-500 hover:text-zinc-300 transition flex items-center gap-1.5 cursor-pointer">
          <Key className="w-3 h-3" />
          <span>{showAdvanced ? 'Ocultar ajustes avanzados de API' : '¿Deseas conectar tu propia clave API? (Ajustes Avanzados)'}</span>
          {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showAdvanced && (
          <form onSubmit={handleSave} className="mt-3.5 p-4 rounded-xl border border-[#2a2828] bg-[#161414] space-y-3 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Modo de Operación</label>
                <select value={aiMode} onChange={(e) => setAiMode(e.target.value as any)} className="w-full bg-[#111010] border border-[#333] rounded-lg px-2.5 py-1.5 text-xs text-white">
                  <option value="system">Modelo del Sistema (Recomendado)</option>
                  <option value="custom">Clave API Propia (Personalizada)</option>
                </select>
              </div>
              {aiMode === 'custom' && (
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Proveedor</label>
                  <select value={provider} onChange={(e) => setProvider(e.target.value)} className="w-full bg-[#111010] border border-[#333] rounded-lg px-2.5 py-1.5 text-xs text-white">
                    <option value="google">Google AI Studio (Gemini)</option>
                    <option value="openai">OpenAI (Directo GPT-4o)</option>
                    <option value="openrouter">OpenRouter (Multi-LLM)</option>
                  </select>
                </div>
              )}
            </div>
            {aiMode === 'custom' && (
              <div className="relative">
                <input type={showKey ? 'text' : 'password'} value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Pega tu clave API aquí..." className="w-full bg-[#111010] border border-[#333] rounded-lg px-2.5 py-1.5 pr-8 text-xs text-emerald-400 font-mono" />
                <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-2 top-2 text-zinc-500 hover:text-zinc-300">
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
            <div className="flex items-center justify-between pt-1">
              {saveSuccess ? <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Guardado</span> : <span />}
              <button type="submit" disabled={isSaving} className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white shadow transition disabled:opacity-50">{isSaving ? 'Guardando...' : 'Guardar Ajustes'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
