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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
      <div className="bg-white w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl text-[#0a1730] relative space-y-4">
        <div className="flex items-start justify-between pb-3 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0d5bff] shadow-2xs shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0a1730]">Probar Conexión WhatsApp en Vivo</h3>
              <p className="text-xs text-[#62728d] mt-0.5">Envía un mensaje de prueba a tu propio teléfono.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8391aa] hover:text-[#0a1730] p-1.5 rounded-lg hover:bg-[#f1f5f9] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSendTest} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-[#0a1730] mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Número de Teléfono Destino (con código de país) *</span>
            </label>
            <input
              type="tel"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Ej: 50688888888 o 5215512345678"
              className="w-full bg-[#f8fafc] rounded-xl px-3.5 py-2 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:bg-white shadow-2xs transition"
            />
          </div>

          <div>
            <label className="block font-bold text-[#0a1730] mb-1.5">
              Mensaje de prueba:
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#f8fafc] rounded-xl p-3 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:bg-white shadow-2xs transition resize-none leading-relaxed"
            />
          </div>

          {result && (
            <div className={`p-3 rounded-xl flex items-start gap-2 shadow-2xs ${
              result.success
                ? 'bg-emerald-50 text-emerald-800'
                : 'bg-rose-50 text-rose-800'
            }`}>
              {result.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              )}
              <span className="text-[11.5px] font-semibold leading-tight">{result.message}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#62728d] hover:text-[#0a1730] hover:bg-[#f1f5f9] transition cursor-pointer"
            >
              Cerrar
            </button>
            <button
              type="submit"
              disabled={loading || !recipient.trim()}
              className="px-5 py-2 rounded-xl font-bold text-xs bg-[#0d5bff] hover:bg-[#0047e1] text-white shadow-sm hover:shadow flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Enviando...' : 'Enviar Mensaje de Prueba'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
