import React, { useState, useEffect } from 'react';
import { SaasMetrics, Tenant } from '../../types';
import { ShieldAlert, TrendingUp, Users, DollarSign, Bot, Terminal, Play, Plus, CheckCircle2, RefreshCw, Trash2, ExternalLink, MessageSquare } from 'lucide-react';
import { PlatformAIModelManager } from './PlatformAIModelManager';

export const SuperAdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SaasMetrics | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // New Tenant Modal state
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantEmail, setNewTenantEmail] = useState('');
  const [newTenantPlan, setNewTenantPlan] = useState('pro');
  const [newTenantPrice, setNewTenantPrice] = useState('0.00');
  const [newTenantBizType, setNewTenantBizType] = useState('restaurante');
  const [newTenantCurrency, setNewTenantCurrency] = useState('CRC');

  // Multi-Model Playground state
  const [playgroundPrompt, setPlaygroundPrompt] = useState('¿Cuáles son los 3 factores que más convierten a un visitante indeciso en comprador?');
  const [playgroundSystem, setPlaygroundSystem] = useState('Eres el bot asesor principal de la plataforma ClikChat. Responde de forma ejecutiva.');
  const [playgroundModel, setPlaygroundModel] = useState('deepseek/deepseek-chat');
  const [playgroundOutput, setPlaygroundOutput] = useState('');
  const [isExecutingPlayground, setIsExecutingPlayground] = useState(false);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/metrics');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
        setTenants(data.tenants || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const [isCreatingTenant, setIsCreatingTenant] = useState(false);
  const [createTenantSuccess, setCreateTenantSuccess] = useState(false);

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
          plan: newTenantPlan,
          monthly_price: parseFloat(newTenantPrice) || 0,
          business_type: newTenantBizType,
          currency: newTenantCurrency
        })
      });

      if (res.ok) {
        setNewTenantName('');
        setNewTenantEmail('');
        setCreateTenantSuccess(true);
        setTimeout(() => setCreateTenantSuccess(false), 3000);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingTenant(false);
    }
  };

  const handleDeleteTenant = async (tenantId: string, tenantName: string) => {
    if (!window.confirm(`¿Eliminar la cuenta "${tenantName}" y todos sus productos/datos?`)) return;
    try {
      const res = await fetch(`/api/admin/tenants/${tenantId}`, { method: 'DELETE' });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunPlayground = async () => {
    if (!playgroundPrompt.trim() || isExecutingPlayground) return;

    setIsExecutingPlayground(true);
    setPlaygroundOutput('Conectando con Google AI Studio (Gemini)...');

    try {
      const res = await fetch('/api/admin/playground', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: playgroundPrompt,
          systemPrompt: playgroundSystem,
          model: playgroundModel
        })
      });

      const data = await res.json();
      if (res.ok) {
        setPlaygroundOutput(data.output || 'Sin respuesta del modelo.');
      } else {
        setPlaygroundOutput(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setPlaygroundOutput(`Error de conexión: ${err.message}`);
    } finally {
      setIsExecutingPlayground(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Super Admin Panel ClikChat</h1>
            <p className="text-xs text-slate-400">Control Multi-Tenant B2B2C, Facturación MRR y AI Studio</p>
          </div>
        </div>

        <button
          onClick={fetchAdminData}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Financial Metrics Cards (MRR, ARR, Tenants, Messages) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>MRR Recurrente</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">${metrics?.mrr || '0.00'}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">+14% vs mes anterior</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>ARR Proyectado</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white">${metrics?.arr || '0.00'}</p>
          <span className="text-[10px] text-indigo-300 font-semibold">Tasa de retención 98%</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Inquilinos Activos</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white">{metrics?.activeTenantsCount || '0'}</p>
          <span className="text-[10px] text-slate-400 font-medium">De {metrics?.totalTenants || '0'} registrados</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Consultas Procesadas</span>
            <Bot className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white">{metrics?.totalMessagesProcessed || '0'}</p>
          <span className="text-[10px] text-amber-300 font-medium">{metrics?.pendingUnresolvedQueries || 0} pendientes HITL</span>
        </div>
      </div>
      
      {/* SECTION: PLATFORM AI ENGINE STRATEGY (SUPER ADMIN ONLY) */}
      <PlatformAIModelManager />

      {/* SECTION: MULTI-MODEL AI PLAYGROUND */}
      <div className="p-5 md:p-6 rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-sm font-bold text-white">Consola de Pruebas Multi-Modelo</h2>
              <p className="text-xs text-slate-400">Verifica respuestas en tiempo real con DeepSeek V3 (90%) y GPT-4o Mini (10%)</p>
            </div>
          </div>

          <select
            value={playgroundModel}
            onChange={(e) => setPlaygroundModel(e.target.value)}
            className="text-xs bg-slate-800 text-indigo-300 border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="deepseek/deepseek-chat">DeepSeek V3 (Chat - Principal 90%)</option>
            <option value="openai/gpt-4o-mini">OpenAI GPT-4o Mini (Razonamiento 10%)</option>
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
              <span>{isExecutingPlayground ? 'Consultando modelo...' : 'Ejecutar Prueba en Vivo'}</span>
            </button>
          </div>

          {playgroundOutput && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1">
                Respuesta del Modelo ({playgroundModel})
              </span>
              <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                {playgroundOutput}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION: TENANTS CRUD */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Gestión de Inquilinos y Suscripciones ({tenants.length})
          </h2>
        </div>

        {/* Create Tenant Form */}
        <form onSubmit={handleCreateTenant} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-6 gap-2.5 items-end">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Nombre Negocio</label>
            <input
              type="text"
              required
              placeholder="Ej: Comida Callejera XL"
              value={newTenantName}
              onChange={(e) => setNewTenantName(e.target.value)}
              className="w-full text-xs p-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Email Dueño</label>
            <input
              type="email"
              required
              placeholder="dueno@negocio.com"
              value={newTenantEmail}
              onChange={(e) => setNewTenantEmail(e.target.value)}
              className="w-full text-xs p-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Tipo de Negocio</label>
            <select
              value={newTenantBizType}
              onChange={(e) => setNewTenantBizType(e.target.value)}
              className="w-full text-xs p-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
            >
              <option value="restaurante">🍔 Restaurante / Comida</option>
              <option value="tienda">🛍️ Tienda / Catálogo</option>
              <option value="servicios">📅 Servicios / Citas</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Moneda Oficial</label>
            <select
              value={newTenantCurrency}
              onChange={(e) => setNewTenantCurrency(e.target.value)}
              className="w-full text-xs p-2 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-bold"
            >
              <option value="CRC">₡ Colones (CRC)</option>
              <option value="USD">$ Dólares (USD)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isCreatingTenant}
            className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            {isCreatingTenant ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : createTenantSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-4 h-4" />}
            <span>{isCreatingTenant ? 'Creando...' : createTenantSuccess ? '¡Negocio Creado!' : 'Crear Negocio'}</span>
          </button>
        </form>

        {/* Tenant Table */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Tienda / Slug</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Precio Mensual</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Fecha Registro</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-semibold text-white">
                    {t.name}
                    <span className="block text-[10px] font-normal text-slate-400">/{t.slug}</span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 uppercase">
                      {t.plan}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-white">${t.monthly_price} USD/mes</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">
                    {new Date(t.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <a
                        href={`/chat?t=${t.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Abrir Chat Bot"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`/dashboard?t=${t.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Abrir Panel Cliente"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleDeleteTenant(t.id, t.name)}
                        title="Eliminar Inquilino"
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
