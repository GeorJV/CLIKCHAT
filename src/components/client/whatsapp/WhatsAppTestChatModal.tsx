import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertTriangle, Phone } from 'lucide-react';

interface WhatsAppTestChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantSlug: string;
  defaultPhone?: string;
}

export const WhatsAppTestChatModal: React.FC<WhatsAppTestChatModalProps> = ({
  isOpen,
  onClose,
  tenantSlug,
  defaultPhone = ''
}) => {
  const [recipient, setRecipient] = useState(defaultPhone);
  const [message, setMessage] = useState('¡Hola! 👋 Este es un mensaje de prueba de tu bot ClikChat conectado a WhatsApp.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/whatsapp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSlug,
          recipientPhone: recipient.trim().replace(/[^0-9]/g, ''),
          testMessage: message.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult({ success: true, message: data.message || 'Mensaje enviado con éxito a tu WhatsApp.' });
      } else {
        setResult({ success: false, message: data.error || 'Error al enviar mensaje. Revisa tu token y Phone Number ID.' });
      }
    } catch {
      setResult({ success: false, message: 'Fallo de red al conectar con el servidor.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#171616] border border-[#2b2929] w-full max-w-md rounded-2xl p-5 shadow-2xl text-zinc-100 relative">
        <div className="flex items-center justify-between border-b border-[#262424] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366]">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Probar Conexión WhatsApp en Vivo</h3>
              <p className="text-[11px] text-zinc-400">Envía un mensaje de prueba a tu propio teléfono.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSendTest} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Número de Teléfono Destino (con código de país) *</span>
            </label>
            <input
              type="tel"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Ej: 50688888888 o 5215512345678"
              className="w-full bg-[#111010] border border-[#2b2828] rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">
              Mensaje de prueba:
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#111010] border border-[#2b2828] rounded-xl p-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {result && (
            <div className={`p-3 rounded-xl border flex items-start gap-2 ${
              result.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {result.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />}
              <span className="text-[11px] leading-tight">{result.message}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#262424]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              Cerrar
            </button>
            <button
              type="submit"
              disabled={loading || !recipient.trim()}
              className="px-4 py-1.5 rounded-xl font-bold bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 shadow-lg shadow-[#25D366]/20 flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Enviando...' : 'Enviar Prueba'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
