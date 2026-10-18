import React, { useState, useEffect } from 'react';
import { WhatsAppConfig } from '../../../types/whatsapp';
import { X, CheckCircle, ShieldCheck, Key, Phone, Hash } from 'lucide-react';

interface WhatsAppCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WhatsAppConfig;
  onSave: (newConfig: Partial<WhatsAppConfig>) => Promise<boolean>;
}

export const WhatsAppCredentialsModal: React.FC<WhatsAppCredentialsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave
}) => {
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (config) {
      setPhoneNumberId(config.phone_number_id || '');
      setBusinessPhone(config.business_phone || '');
      setAccessToken(config.access_token || '');
      setVerifyToken(config.verify_token || '');
    }
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await onSave({
      phone_number_id: phoneNumberId.trim(),
      business_phone: businessPhone.trim(),
      access_token: accessToken.trim(),
      verify_token: verifyToken.trim() || undefined,
      status: phoneNumberId.trim() && accessToken.trim() ? 'connected' : 'disconnected'
    });
    setLoading(false);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#171616] border border-[#2b2929] w-full max-w-lg rounded-2xl p-5 shadow-2xl text-zinc-100 relative">
        <div className="flex items-center justify-between border-b border-[#262424] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Credenciales de Meta Cloud API</h3>
              <p className="text-[11px] text-zinc-400">Vincular tu cuenta oficial de WhatsApp Business a ClikChat.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-emerald-400" />
              <span>Phone Number ID (Identificador de Número de Teléfono) *</span>
            </label>
            <input
              type="text"
              required
              value={phoneNumberId}
              onChange={(e) => setPhoneNumberId(e.target.value)}
              placeholder="Ej: 104928374928174"
              className="w-full bg-[#111010] border border-[#2b2828] rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Número de WhatsApp Business *</span>
            </label>
            <input
              type="text"
              required
              value={businessPhone}
              onChange={(e) => setBusinessPhone(e.target.value)}
              placeholder="Ej: +506 8888-8888 o +52 1 55 1234 5678"
              className="w-full bg-[#111010] border border-[#2b2828] rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              <span>Token de Acceso Permanente (System User Token) *</span>
            </label>
            <textarea
              required
              rows={3}
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="EAABw..."
              className="w-full bg-[#111010] border border-[#2b2828] rounded-xl p-2.5 text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">
              Token de Verificación Personalizado (Opcional)
            </label>
            <input
              type="text"
              value={verifyToken}
              onChange={(e) => setVerifyToken(e.target.value)}
              placeholder="clikchat_wa_token"
              className="w-full bg-[#111010] border border-[#2b2828] rounded-xl px-3 py-1.5 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#262424]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 rounded-xl font-bold bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 shadow-lg shadow-[#25D366]/20 flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{loading ? 'Guardando...' : 'Guardar y Vincular'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
