import React, { useState } from 'react';
import { LoginFormData } from '../../types/auth';
import { Store, ShieldCheck, ArrowRight, UserPlus, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

interface ClientLoginProps {
  onLogin: (data: LoginFormData) => Promise<boolean>;
  onSwitchToRegister: () => void;
  error?: string | null;
}

export const ClientLogin: React.FC<ClientLoginProps> = ({
  onLogin,
  onSwitchToRegister,
  error
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    await onLogin({ email, password });
    setIsSubmitting(false);
  };

  const handleDemoAccess = async () => {
    setEmail('demo@clikchat.com');
    setPassword('demo1234');
    setIsSubmitting(true);
    await onLogin({ email: 'demo@clikchat.com', password: 'demo1234' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-full flex items-center justify-center p-4">
      <div className="w-full max-w-md onyx-card rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#282626]">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#1e1d1d] border border-[#2e2b2b] text-emerald-400 mx-auto mb-4">
          <Store className="w-6 h-6" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-center text-white tracking-tight">
          Portal del Negocio
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 text-center mt-1 mb-5">
          Ingresa a tu cuenta privada para gestionar tu catálogo, pedidos y entrenar a tu asistente virtual.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2.5 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              placeholder="tu@negocio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition active:scale-[0.98] cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verificando Credenciales...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Ingresar al Panel de Control</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#282626] flex flex-col items-center gap-2.5">
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-bold transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>¿Eres nuevo? Crea tu cuenta y tienda aquí</span>
          </button>

          <button
            type="button"
            onClick={handleDemoAccess}
            className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition cursor-pointer mt-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Acceso rápido demo: <strong>TechStore (demo@clikchat.com)</strong></span>
          </button>
        </div>
      </div>
    </div>
  );
};
