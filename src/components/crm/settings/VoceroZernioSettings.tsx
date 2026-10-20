import React, { useState, useEffect } from 'react';
import { ZernioConfig } from '../../../types/zernio';
import { Network, Copy, Check, ShieldCheck, Key, Radio, Zap, ExternalLink, RefreshCw } from 'lucide-react';

export const VoceroZernioSettings: React.FC<{ tenantSlug: string }> = ({ tenantSlug }) => {
  const [config, setConfig] = useState<ZernioConfig>({
    api_key: '',
    account_id: '',
    webhook_url: `https://clikchat.pages.dev/api/zernio/webhook?tenant=${tenantSlug}`,
    status: 'disconnected',
    channels: ['whatsapp', 'instagram', 'messenger', 'tiktok'],
    auto_reply: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch(`/api/zernio/config?tenantSlug=${tenantSlug}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.config) setConfig(prev => ({ ...prev, ...d.config, webhook_url: `https://clikchat.pages.dev/api/zernio/webhook?tenant=${tenantSlug}` }));
      })
      .catch(() => {});
  }, [tenantSlug]);

  const handleCopy = () => {
    navigator.clipboard.writeText(config.webhook_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/zernio/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantSlug, ...config, status: config.api_key && config.account_id ? 'connected' : 'disconnected' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConfig(prev => ({ ...prev, status: config.api_key && config.account_id ? 'connected' : 'disconnected' }));
        setStatusMsg({ type: 'success', text: '¡Configuración de Zernio guardada con éxito!' });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Error al guardar' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/zernio/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantSlug, apiKey: config.api_key, accountId: config.account_id })
      });
      const data = await res.json();
      setStatusMsg({ type: data.success ? 'success' : 'error', text: data.message || data.error });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4 max-w-4xl font-sans">
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f1f5f9] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0d5bff]/10 text-[#0d5bff]">
              <Network className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0a1730]">Zernio Multichannel Infrastructure</h3>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  config.status === 'connected' ? 'bg-[#eaf7ef] text-[#0f8b44]' : 'bg-[#fff5e6] text-[#b36b00]'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${config.status === 'connected' ? 'bg-[#0f8b44]' : 'bg-[#b36b00]'}`} />
                  {config.status === 'connected' ? 'Conectado a Zernio' : 'Sin Conectar'}
                </span>
              </div>
              <p className="text-xs text-[#62728d]">Conecta WhatsApp, Instagram, Messenger y TikTok en una sola infraestructura centralizada.</p>
            </div>
          </div>
          <a href="https://zernio.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-lg border border-[#d8e2f0] bg-[#f8fafc] px-3 py-1.5 text-xs font-semibold text-[#0a1730] hover:bg-[#edf2f9]">
            <span>Zernio.com</span>
            <ExternalLink className="h-3.5 w-3.5 text-[#8391aa]" />
          </a>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#42506b] mb-1 flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-[#0d5bff]" /> Zernio API Key (Bearer Token)
            </label>
            <input
              type="password"
              value={config.api_key}
              onChange={(e) => setConfig({ ...config, api_key: e.target.value })}
              placeholder="sk_zernio_live_..."
              className="w-full rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3 py-2 text-xs font-mono text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#42506b] mb-1 flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5 text-[#0d5bff]" /> Zernio Account ID (Canal)
            </label>
            <input
              type="text"
              value={config.account_id}
              onChange={(e) => setConfig({ ...config, account_id: e.target.value })}
              placeholder="acc_abc123xyz..."
              className="w-full rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3 py-2 text-xs font-mono text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <span className="block text-xs font-semibold text-[#42506b] mb-1">URL de Webhook para Zernio Settings</span>
            <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-[#0a1730] bg-[#f8fafc] p-2 rounded-xl border border-[#e2e8f0]">
              <span className="truncate">{config.webhook_url}</span>
              <button type="button" onClick={handleCopy} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#d8e2f0] text-xs font-semibold text-[#0d5bff] hover:bg-[#edf2f9] cursor-pointer shrink-0">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar URL'}</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-2 flex items-center justify-between p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
            <div>
              <p className="text-xs font-bold text-[#0a1730]">Auto-respuesta IA en canales Zernio</p>
              <p className="text-[11px] text-[#62728d]">La IA responderá automáticamente con el embudo comercial en 4 pasos.</p>
            </div>
            <input type="checkbox" checked={config.auto_reply} onChange={(e) => setConfig({ ...config, auto_reply: e.target.checked })} className="h-4 w-4 rounded text-[#0d5bff] focus:ring-[#0d5bff] cursor-pointer" />
          </div>
        </div>

        {statusMsg && (
          <div className={`mt-3 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            statusMsg.type === 'success' ? 'bg-[#eaf7ef] text-[#0f8b44] border border-[#d7eede]' : 'bg-[#fff0f0] text-[#e11d48] border border-[#ffd5d5]'
          }`}>
            <ShieldCheck className="h-4 w-4" />
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-[#f1f5f9] flex items-center justify-end gap-2">
          <button type="button" onClick={handleTest} disabled={isTesting || !config.api_key} className="flex items-center gap-1.5 rounded-xl border border-[#d8e2f0] bg-white px-4 py-2 text-xs font-semibold text-[#0a1730] hover:bg-[#f8fafc] transition cursor-pointer disabled:opacity-50">
            <RefreshCw className={`h-3.5 w-3.5 text-[#0d5bff] ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Verificando...' : 'Probar Conexión'}</span>
          </button>
          <button type="submit" disabled={isSaving} className="flex items-center gap-1.5 rounded-xl bg-[#0d5bff] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0047e1] transition cursor-pointer disabled:opacity-50">
            <Zap className="h-3.5 w-3.5" />
            <span>{isSaving ? 'Guardando...' : 'Guardar Zernio'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};
