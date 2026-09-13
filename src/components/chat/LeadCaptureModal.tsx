import React, { useState } from 'react';
import { UserCheck, Bell, Send, CheckCircle, Smartphone } from 'lucide-react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  sessionId: string;
  tenantId: string;
  onClose: () => void;
  onSaved: () => void;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  isOpen,
  sessionId,
  tenantId,
  onClose,
  onSaved
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (!phone && !email)) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/chat/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          tenantId,
          name,
          phone,
          email,
          pwaPushToken: 'pwa_token_' + Math.random().toString(36).substring(2)
        })
      });
      setIsDone(true);
      setTimeout(() => {
        onSaved();
        onClose();
      }, 1800);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-3xl p-6 glass-card-frosted border border-indigo-500/30 text-white shadow-2xl">
        
        {isDone ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold">¡Datos Notificados con Éxito!</h3>
            <p className="text-xs text-slate-300">
              Nuestro asesor comercial ha recibido tu consulta. Recibirás la respuesta directamente en tu WhatsApp o notificación.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="inline-flex p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-1 ring-1 ring-indigo-500/40">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-white">
                Respuesta Personalizada del Asesor
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Para responderte con exactitud, déjanos tu contacto. También activaremos las notificaciones push de la PWA.
              </p>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">Tu Nombre</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Laura Méndez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">WhatsApp o Teléfono</label>
                <input
                  type="tel"
                  placeholder="+506 8888-8888"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">Correo Electrónico (Opcional)</label>
                <input
                  type="email"
                  placeholder="laura@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                />
              </div>
            </div>

            <div className="flex items-center p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-indigo-200 text-[11px]">
              <Bell className="w-4 h-4 mr-2 text-indigo-400 shrink-0" />
              <span>Te avisaremos por notificación push en tu móvil en cuanto responda el dueño.</span>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Omitir
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !name}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-lg shadow-indigo-600/30"
              >
                <span>{isSubmitting ? 'Enviando...' : 'Avisarme'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
