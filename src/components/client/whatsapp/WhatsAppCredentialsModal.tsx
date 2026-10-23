import React, { useState, useEffect } from 'react';
import { WhatsAppConfig } from '../../../types/whatsapp';
import { X, CheckCircle2, ShieldCheck, Key, Phone, Hash } from 'lucide-react';
import { useVoceroMode } from '../../../hooks/useVoceroMode';

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
  const { isVoceroMode } = useVoceroMode();
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

  const inputCls = isVoceroMode
    ? 'w-full bg-[#f8fafc] rounded-xl px-3.5 py-2 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:bg-white shadow-2xs transition'
    : 'w-full bg-[#121111] border border-[#2c2a2a] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:bg-[#151414] shadow-2xs transition';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
      <div className={`w-full max-w-lg rounded-2xl p-5 sm:p-6 shadow-2xl relative space-y-4 ${
        isVoceroMode ? 'bg-white text-[#0a1730]' : 'bg-[#181717] border border-[#282626] text-white'
      }`}>
        {/* Cabecera del Modal */}
        <div className={`flex items-start justify-between pb-3 border-b ${isVoceroMode ? 'border-[#f1f5f9]' : 'border-[#262424]'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-2xs shrink-0 ${
              isVoceroMode ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>Credenciales de Meta Cloud API</h3>
              <p className={`text-xs ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'} mt-0.5`}>Vincula tu cuenta oficial de WhatsApp Business a ClikChat.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              isVoceroMode ? 'text-[#8391aa] hover:text-[#0a1730] hover:bg-[#f1f5f9]' : 'text-zinc-400 hover:text-white hover:bg-[#222020]'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className={`block font-bold mb-1.5 flex items-center gap-1.5 ${isVoceroMode ? 'text-[#0a1730]' : 'text-zinc-300'}`}>
              <Hash className={`w-3.5 h-3.5 ${isVoceroMode ? 'text-[#0d5bff]' : 'text-emerald-400'}`} />
              <span>Phone Number ID (Identificador de Teléfono) *</span>
            </label>
            <input
              type="text"
              required
              value={phoneNumberId}
              onChange={(e) => setPhoneNumberId(e.target.value)}
              placeholder="Ej: 104928374928174"
              className={inputCls}
            />
          </div>

          <div>
            <label className={`block font-bold mb-1.5 flex items-center gap-1.5 ${isVoceroMode ? 'text-[#0a1730]' : 'text-zinc-300'}`}>
              <Phone className="w-3.5 h-3.5 text-emerald-500" />
              <span>Número de WhatsApp Business Oficial *</span>
            </label>
            <input
              type="text"
              required
              value={businessPhone}
              onChange={(e) => setBusinessPhone(e.target.value)}
              placeholder="Ej: +506 8888-8888 o +52 1 55 1234 5678"
              className={inputCls}
            />
          </div>

          <div>
            <label className={`block font-bold mb-1.5 flex items-center gap-1.5 ${isVoceroMode ? 'text-[#0a1730]' : 'text-zinc-300'}`}>
              <Key className={`w-3.5 h-3.5 ${isVoceroMode ? 'text-[#0d5bff]' : 'text-emerald-400'}`} />
              <span>Token de Acceso Permanente (System User Token) *</span>
            </label>
            <textarea
              required
              rows={3}
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="EAABw..."
              className={`w-full rounded-xl p-3 text-xs font-mono shadow-2xs transition resize-none leading-relaxed focus:outline-none ${
                isVoceroMode
                  ? 'bg-[#f8fafc] text-[#0a1730] placeholder-[#8391aa] focus:ring-2 focus:ring-[#0d5bff]/20 focus:bg-white'
                  : 'bg-[#121111] border border-[#2c2a2a] text-white placeholder-zinc-500 focus:border-emerald-500 focus:bg-[#151414]'
              }`}
            />
          </div>

          <div>
            <label className={`block font-bold mb-1.5 ${isVoceroMode ? 'text-[#0a1730]' : 'text-zinc-300'}`}>
              Token de Verificación Personalizado (Opcional)
            </label>
            <input
              type="text"
              value={verifyToken}
              onChange={(e) => setVerifyToken(e.target.value)}
              placeholder="clikchat_wa_token"
              className={inputCls}
            />
          </div>

          <div className={`flex items-center justify-end gap-2 pt-2 border-t ${isVoceroMode ? 'border-[#f1f5f9]' : 'border-[#262424]'}`}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                isVoceroMode ? 'text-[#62728d] hover:text-[#0a1730] hover:bg-[#f1f5f9]' : 'text-zinc-400 hover:text-white hover:bg-[#222020]'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !phoneNumberId.trim() || !accessToken.trim()}
              className={`px-5 py-2 rounded-xl font-bold text-xs text-white shadow-sm hover:shadow flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer ${
                isVoceroMode ? 'bg-[#0d5bff] hover:bg-[#0047e1]' : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{loading ? 'Guardando...' : 'Guardar y Vincular'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};