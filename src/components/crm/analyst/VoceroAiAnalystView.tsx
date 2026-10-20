import React, { useState } from 'react';
import { Bot, Send, Sparkles, TrendingUp, DollarSign, Users, ShoppingCart, ArrowRight } from 'lucide-react';

interface AiAnalystMessage {
  id: string; sender: 'owner' | 'analyst'; text: string; timestamp: string;
  kpis?: { totalLeads: number; wonLeads: number; wonValue: number; views: number; buyClicks: number };
}

interface VoceroAiAnalystViewProps { tenantSlug: string; tenantId?: string; currency?: string; }

const PRESET_QUERIES = [
  '¿Cuánto hemos vendido y cuántos pedidos van?',
  '¿Cuál es el canal de tráfico que mejor convierte?',
  '¿Cuántos prospectos tenemos en el pipeline?',
  '¿Qué acción recomiendas para acelerar ventas hoy?',
];

export const VoceroAiAnalystView: React.FC<VoceroAiAnalystViewProps> = ({ tenantSlug, tenantId, currency = '₡' }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AiAnalystMessage[]>([
    {
      id: 'init-1', sender: 'analyst',
      text: '¡Hola! Soy tu **Analista IA Ejecutivo**. Puedes hacerme cualquier consulta sobre tus ventas, pedidos, canales de atribución o salud de tu negocio.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const handleAsk = async (textToAsk?: string) => {
    const q = (textToAsk || query).trim();
    if (!q || loading) return;
    const userMsg: AiAnalystMessage = { id: `u-${Date.now()}`, sender: 'owner', text: q, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/crm/ai-analyst', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q, tenantSlug, tenantId }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, {
        id: `a-${Date.now()}`, sender: 'analyst', text: data?.answer || 'No se pudo obtener el análisis.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), kpis: data?.kpis,
      }]);
    } catch {
      setMessages((prev) => [...prev, { id: `e-${Date.now()}`, sender: 'analyst', text: 'Error de conexión con el motor de IA.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f6f8fc] font-sans overflow-hidden">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-6 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#0d5bff] border border-blue-200">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#0a1730] flex items-center gap-1.5">
              Analista IA Gerencial <span className="text-[10px] bg-blue-100 text-[#0d5bff] font-bold px-1.5 py-0.2 rounded-full">Zolutium Edge</span>
            </h1>
            <p className="text-[11px] text-[#62728d]">Inteligencia conversacional sobre tus datos de Cloudflare D1</p>
          </div>
        </div>
      </header>

      {/* Suggested Pills */}
      <div className="p-4 bg-white/60 border-b border-[#e8edf6] flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-bold text-[#8391aa] flex items-center gap-1 shrink-0">
          <TrendingUp className="w-3.5 h-3.5 text-[#0d5bff]" /> Sugerencias:
        </span>
        {PRESET_QUERIES.map((pq) => (
          <button
            key={pq}
            onClick={() => handleAsk(pq)}
            className="shrink-0 px-3 py-1 rounded-full border border-[#dde5f1] bg-white hover:bg-blue-50 hover:border-blue-300 text-xs text-[#0a1730] font-medium transition cursor-pointer flex items-center gap-1"
          >
            <span>{pq}</span>
            <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
          </button>
        ))}
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m) => {
          const isOwner = m.sender === 'owner';
          return (
            <div key={m.id} className={`flex flex-col ${isOwner ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-2xl rounded-2xl p-4 text-[13px] leading-relaxed shadow-sm ${
                  isOwner
                    ? 'bg-[#0d5bff] text-white rounded-br-sm'
                    : 'bg-white border border-[#dde5f1] text-[#0a1730] rounded-bl-sm space-y-2'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                {m.kpis && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
                    <div className="bg-slate-50 p-2 rounded-xl text-center border border-slate-100">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Leads</p>
                      <p className="text-sm font-black text-[#0a1730]">{m.kpis.totalLeads}</p>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-xl text-center border border-emerald-100">
                      <p className="text-[10px] text-emerald-700 font-bold uppercase">Ganados</p>
                      <p className="text-sm font-black text-emerald-700">{m.kpis.wonLeads}</p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-xl text-center border border-blue-100">
                      <p className="text-[10px] text-blue-700 font-bold uppercase">Ventas</p>
                      <p className="text-sm font-black text-[#0d5bff]">{currency}{m.kpis.wonValue.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-50 p-2 rounded-xl text-center border border-purple-100">
                      <p className="text-[10px] text-purple-700 font-bold uppercase">Vistas</p>
                      <p className="text-sm font-black text-purple-700">{m.kpis.views}</p>
                    </div>
                  </div>
                )}
              </div>
              <span className="font-mono text-[9.5px] text-[#8391aa] mt-1 px-1">{m.timestamp}</span>
            </div>
          );
        })}
        {loading && (
          <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 text-xs text-slate-600 max-w-xs animate-pulse">
            <Bot className="w-4 h-4 text-[#0d5bff] animate-spin" />
            <span>Consultando Cloudflare D1 y analizando métricas...</span>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="p-4 bg-white border-t border-[#e8edf6]">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Pregunta sobre ingresos, conversión, pedidos o canales..."
            className="flex-1 rounded-full border border-[#dde5f1] bg-[#f6f8fc] px-4 py-2.5 text-xs text-[#0a1730] outline-none focus:border-[#0d5bff] focus:bg-white"
          />
          <button
            onClick={() => handleAsk()}
            disabled={!query.trim() || loading}
            className="flex h-10 px-4 items-center gap-1.5 rounded-full bg-[#0d5bff] hover:bg-[#0a4de6] disabled:opacity-40 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Preguntar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
