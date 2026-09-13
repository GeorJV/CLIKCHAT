import React, { useState, useEffect } from 'react';
import { Product, FAQ, UnresolvedQuery, Tenant } from '../../types';
import { Package, HelpCircle, Settings, BarChart3, Plus, CheckCircle, Trash2, Send, Sparkles, RefreshCw } from 'lucide-react';

interface ClientDashboardProps {
  tenantSlug?: string;
  onOpenLiveChat?: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  tenantSlug = 'demo-store',
  onOpenLiveChat
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'audit' | 'faqs' | 'settings'>('audit');
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [unresolved, setUnresolved] = useState<UnresolvedQuery[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // New product state
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductBenefit, setNewProductBenefit] = useState('');
  const [newProductImage, setNewProductImage] = useState('');

  // Unresolved resolution state
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  // Bot settings state
  const [botName, setBotName] = useState('');
  const [welcomeMsg, setWelcomeMsg] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [customKey, setCustomKey] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch tenant data
  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Tenant info
      const tRes = await fetch(`/api/tenants/${tenantSlug}`);
      if (tRes.ok) {
        const tData = await tRes.json();
        setTenant(tData.tenant);
        setProducts(tData.products || []);
        setFaqs(tData.faqs || []);

        setBotName(tData.tenant.bot_name || '');
        setWelcomeMsg(tData.tenant.welcome_message || '');
        setSystemPrompt(tData.tenant.system_prompt || '');
      }

      // 2. Unresolved queries for this tenant
      if (tenant?.id) {
        const uRes = await fetch(`/api/audit/unresolved?tenantId=${tenant.id}`);
        if (uRes.ok) {
          const uData = await uRes.json();
          setUnresolved(uData.unresolved || []);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tenantSlug, tenant?.id]);

  // Handle resolving a query (Human-in-the-loop auto-injection to L2 FAQ)
  const handleResolveQuery = async (queryId: string) => {
    if (!resolutionText.trim()) return;

    try {
      const res = await fetch(`/api/audit/resolve/${queryId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answer: resolutionText.trim(),
          autoInjectToFaq: true
        })
      });

      if (res.ok) {
        setResolvingId(null);
        setResolutionText('');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add new product (Feeds Level 3 RAG)
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice || !tenant?.id) return;

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenant.id,
          name: newProductName,
          price: parseFloat(newProductPrice),
          short_description: newProductDesc,
          images: newProductImage ? [newProductImage] : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
          benefits: newProductBenefit ? [newProductBenefit] : ['Garantía oficial y envío inmediato'],
          cta_label: 'Comprar ' + newProductName
        })
      });

      if (res.ok) {
        setNewProductName('');
        setNewProductPrice('');
        setNewProductDesc('');
        setNewProductBenefit('');
        setNewProductImage('');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Bot Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant?.id) return;

    try {
      const res = await fetch(`/api/tenants/${tenant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bot_name: botName,
          welcome_message: welcomeMsg,
          system_prompt: systemPrompt,
          custom_llm_key: customKey || undefined
        })
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-lg">
            {tenant?.name?.substring(0, 2).toUpperCase() || 'CK'}
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-extrabold text-white">{tenant?.name || 'Panel de Cliente'}</h1>
            <p className="text-xs text-slate-400">Dueño: {tenant?.owner_name} • Asistente: <span className="text-indigo-400 font-semibold">{tenant?.bot_name}</span></p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenLiveChat && (
            <button
              onClick={onOpenLiveChat}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Abrir Chat Móvil en Vivo</span>
            </button>
          )}
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Auditoría RAG & Consultas Pendientes ({unresolved.filter(u => u.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Package className="w-4 h-4 text-emerald-400" />
          <span>Mis Productos (RAG Nivel 3) ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'faqs'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-blue-400" />
          <span>FAQs & Reglas (RAG Nivel 2) ({faqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Configuración de Marca & Bot</span>
        </button>
      </div>

      {/* TAB 1: AUDITORÍA RAG & CONSULTAS PENDIENTES (Human-in-the-Loop) */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs">
            <span className="font-bold">Bandeja Human-in-the-Loop:</span> Aquí llegan las preguntas de clientes que el RAG no respondió con 100% de certeza. Cuando escribes la respuesta y haces clic en <span className="font-bold underline">Aprobar y Entrenar Bot</span>, el sistema inyecta automáticamente la solución en el <span className="font-bold">Nivel 2 (FAQs)</span> para que el bot nunca vuelva a fallar en esa pregunta.
          </div>

          <div className="space-y-3">
            {unresolved.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-900/50 rounded-2xl border border-slate-800">
                🎉 No hay consultas no resueltas pendientes. Tu bot está respondiendo con alta certeza.
              </div>
            ) : (
              unresolved.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {item.status === 'pending' ? 'Pendiente de Respuesta' : 'Resuelto y Auto-Inyectado'}
                      </span>
                      <h3 className="text-sm font-bold text-white">"{item.user_question}"</h3>
                    </div>

                    {item.user_lead_info && (
                      <div className="text-right text-xs text-slate-400 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                        <span className="block font-semibold text-slate-200">{item.user_lead_info.name || 'Usuario Anónimo'}</span>
                        <span>{item.user_lead_info.phone || item.user_lead_info.email || 'Sin contacto directo'}</span>
                      </div>
                    )}
                  </div>

                  {item.status === 'pending' && (
                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      {resolvingId === item.id ? (
                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            placeholder="Escribe la respuesta oficial definitiva para este cliente y para entrenar el bot..."
                            value={resolutionText}
                            onChange={(e) => setResolutionText(e.target.value)}
                            className="w-full text-xs p-3 rounded-xl bg-slate-950 border border-indigo-500/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setResolvingId(null)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleResolveQuery(item.id)}
                              disabled={!resolutionText.trim()}
                              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-bold text-white flex items-center space-x-1.5 shadow-md shadow-emerald-600/30"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Aprobar y Auto-Inyectar en FAQs (Nivel 2)</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setResolvingId(item.id);
                            setResolutionText('');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition flex items-center space-x-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Responder y Entrenar Bot</span>
                        </button>
                      )}
                    </div>
                  )}

                  {item.status === 'resolved' && item.resolution_answer && (
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
                      <span className="font-semibold text-emerald-400">Respuesta Oficial Registrada:</span>
                      <p>{item.resolution_answer}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MIS PRODUCTOS (RAG Nivel 3) */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Create Product Form */}
          <form onSubmit={handleCreateProduct} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Agregar Nuevo Producto al Catálogo (Alimenta RAG Nivel 3)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Nombre del Producto (Ej: Reloj Smart Pro)"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                className="text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
              <input
                type="number"
                step="0.01"
                required
                placeholder="Precio en USD (Ej: 199.00)"
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(e.target.value)}
                className="text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
              <input
                type="url"
                placeholder="URL de Imagen Principal (https://...)"
                value={newProductImage}
                onChange={(e) => setNewProductImage(e.target.value)}
                className="text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
              <input
                type="text"
                placeholder="Beneficio Clave (Ej: Batería de 14 días y sumergible 50m)"
                value={newProductBenefit}
                onChange={(e) => setNewProductBenefit(e.target.value)}
                className="text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <textarea
              rows={2}
              placeholder="Descripción completa del producto para que la IA responda preguntas de clientes..."
              value={newProductDesc}
              onChange={(e) => setNewProductDesc(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white transition shadow-md shadow-indigo-600/30"
            >
              Guardar y Auto-Indexar en RAG Nivel 3
            </button>
          </form>

          {/* Product List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((p) => (
              <div key={p.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex space-x-3.5">
                <img
                  src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                  alt={p.name}
                  className="w-20 h-20 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                    <span className="text-xs font-extrabold text-indigo-400">${p.price}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{p.short_description || p.full_description}</p>
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                    Activo en RAG
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FAQS (RAG Nivel 2) */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Preguntas Frecuentes Activas (Búsqueda Vectorial Estricta)
            </h3>
            <div className="space-y-3">
              {faqs.map((f) => (
                <div key={f.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{f.question}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      {f.source === 'hitl_audit' ? '💡 Aprendido de Consulta Fallida' : 'Manual'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONFIGURACIÓN DE MARCA & BOT */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Identidad del Asistente y Prompts Comerciales</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Asistente IA</label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">API Key Propia del Tenant (Opcional)</label>
              <input
                type="password"
                placeholder="sk-or-v1-... (Dejar vacío para usar clave general)"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Mensaje de Bienvenida</label>
            <input
              type="text"
              value={welcomeMsg}
              onChange={(e) => setWelcomeMsg(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">System Prompt (Directrices del Negocio)</label>
            <textarea
              rows={4}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white transition"
            >
              Guardar Cambios
            </button>
            {saveSuccess && (
              <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>¡Configuración guardada exitosamente!</span>
              </span>
            )}
          </div>
        </form>
      )}

    </div>
  );
};
