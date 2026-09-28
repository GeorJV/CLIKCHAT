import React, { useState } from 'react';
import { Terminal, Play, Plus, RefreshCw, CheckCircle2 } from 'lucide-react';
import { PlatformAIModelManager } from './PlatformAIModelManager';

interface Props {
  onTenantCreated?: () => void;
}

export const AdminAiConsoleTab: React.FC<Props> = ({ onTenantCreated }) => {
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantEmail, setNewTenantEmail] = useState('');
  const [newTenantBizType, setNewTenantBizType] = useState('restaurante');
  const [newTenantCurrency, setNewTenantCurrency] = useState('CRC');
  const [isCreatingTenant, setIsCreatingTenant] = useState(false);
  const [createTenantSuccess, setCreateTenantSuccess] = useState(false);

  const [playgroundPrompt, setPlaygroundPrompt] = useState('¿Cuáles son los 3 factores que más convierten a un visitante indeciso en comprador?');
  const [playgroundSystem, setPlaygroundSystem] = useState('Eres el bot asesor principal de ClikChat. Responde de forma ejecutiva.');
  const [playgroundModel, setPlaygroundModel] = useState('z-ai/glm-5.3-flash');
  const [playgroundOutput, setPlaygroundOutput] = useState('');
  const [isExecutingPlayground, setIsExecutingPlayground] = useState(false);

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName || !newTenantEmail || isCreatingTenant) return;
    setIsCreatingTenant(true);
    try {
      const res = await fetch('/api/admin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTenantName,
          owner_email: newTenantEmail,
          plan: 'pro',
          monthly_price: 79,
          business_type: newTenantBizType,
          currency: newTenantCurrency
        })
      });
      if (res.ok) {
        setNewTenantName('');
        setNewTenantEmail('');
        setCreateTenantSuccess(true);
        setTimeout(() => setCreateTenantSuccess(false), 3000);
        if (onTenantCreated) onTenantCreated();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingTenant(false);
    }
  };

  const handleRunPlayground = async () => {
    if (!playgroundPrompt.trim() || isExecutingPlayground) return;
    setIsExecutingPlayground(true);
    setPlaygroundOutput('Consultando modelo en vivo...');
    try {
      const res = await fetch('/api/admin/playground', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: playgroundPrompt, systemPrompt: playgroundSystem, model: playgroundModel })
      });
      const data = await res.json();
      setPlaygroundOutput(res.ok ? data.output || 'Sin respuesta.' : `Error: ${data.error}`);
    } catch (err: any) {
      setPlaygroundOutput(`Error de conexión: ${err.message}`);
    } finally {
      setIsExecutingPlayground(false);
    }
  };

  return (
    <div className="space-y-6">
      <PlatformAIModelManager />

      {/* Playground */}
      <div className="p-5 md:p-6 rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-sm font-bold text-white">Consola de Pruebas Multi-Modelo</h2>
              <p className="text-xs text-slate-400">Verifica respuestas con GLM 5.3 Flash y GPT-4o Mini</p>
            </div>
          </div>
          <select
            value={playgroundModel}
            onChange={(e) => setPlaygroundModel(e.target.value)}
            className="text-xs bg-slate-800 text-indigo-300 border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="z-ai/glm-5.3-flash">GLM-5.3-Flash (Principal)</option>
            <option value="deepseek/deepseek-chat">DeepSeek V3 (Respaldo)</option>
            <option value="openai/gpt-4o-mini">OpenAI GPT-4o Mini (Respaldo Final)</option>
          </select>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">System Prompt</label>
            <input
              type="text"
              value={playgroundSystem}
              onChange={(e) => setPlaygroundSystem(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Prompt de Prueba</label>
            <textarea
              rows={2}
              value={playgroundPrompt}
              onChange={(e) => setPlaygroundPrompt(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleRunPlayground}
              disabled={isExecutingPlayground}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition flex items-center space-x-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isExecutingPlayground ? 'Consultando...' : 'Ejecutar Prueba en Vivo'}</span>
            </button>
          </div>
          {playgroundOutput && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1">Respuesta ({playgroundModel})</span>
              <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">{playgroundOutput}</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Create Tenant */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Alta Rápida de Comercio</h3>
        <form onSubmit={handleCreateTenant} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-5 gap-2.5 items-end">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Nombre Negocio</label>
            <input
              type="text" required placeholder="Ej: Pizzería Costa Rica" value={newTenantName}
              onChange={(e) => setNewTenantName(e.target.value)} className="w-full text-xs p-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Email Dueño</label>
            <input
              type="email" required placeholder="dueno@negocio.com" value={newTenantEmail}
              onChange={(e) => setNewTenantEmail(e.target.value)} className="w-full text-xs p-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Tipo & Moneda</label>
            <div className="flex gap-1">
              <select value={newTenantBizType} onChange={(e) => setNewTenantBizType(e.target.value)} className="w-1/2 text-xs p-2 rounded-xl bg-slate-950 border border-slate-700 text-white">
                <option value="restaurante">🍔 Rest</option>
                <option value="tienda">🛍️ Tienda</option>
                <option value="servicios">📅 Citas</option>
              </select>
              <select value={newTenantCurrency} onChange={(e) => setNewTenantCurrency(e.target.value)} className="w-1/2 text-xs p-2 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-bold">
                <option value="CRC">CRC</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={isCreatingTenant} className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white transition flex items-center justify-center space-x-1.5 disabled:opacity-50">
            {isCreatingTenant ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : createTenantSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-4 h-4" />}
            <span>{isCreatingTenant ? 'Creando...' : createTenantSuccess ? '¡Creado!' : 'Crear Negocio'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
