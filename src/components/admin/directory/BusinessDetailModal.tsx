import React from 'react';
import { X, CheckCircle2, Store } from 'lucide-react';
import { MerchantAdminItem, EditSubFormData } from '../../../types/adminDirectory';

interface Props {
  isOpen: boolean;
  merchant: MerchantAdminItem | null;
  form: EditSubFormData;
  setForm: React.Dispatch<React.SetStateAction<EditSubFormData>>;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  isSaving: boolean;
}

export const BusinessDetailModal: React.FC<Props> = ({
  isOpen,
  merchant,
  form,
  setForm,
  onClose,
  onSave,
  isSaving
}) => {
  if (!isOpen || !merchant) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow shrink-0">
              <Store size={16} />
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-xs text-white truncate max-w-[220px]">{merchant.name}</p>
              <p className="text-[10px] text-slate-400 font-mono truncate max-w-[220px]">{merchant.owner_email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[9px] text-slate-400 font-bold block uppercase">Slug</span>
              <p className="font-mono font-bold text-emerald-400 text-xs truncate">/{merchant.slug}</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[9px] text-slate-400 font-bold block uppercase">Mensualidad</span>
              <p className="font-mono font-bold text-indigo-400 text-xs">${form.monthlyPrice}/mes</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[9px] text-slate-400 font-bold block uppercase">Consultas</span>
              <p className="font-mono font-bold text-purple-400 text-xs">{merchant.total_messages || 0}</p>
            </div>
          </div>

          <form onSubmit={onSave} className="space-y-2.5 text-xs" id="sub-form">
            <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Plan & Facturación D1</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-300">Nivel de Plan</label>
                <select value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg border bg-slate-950 border-slate-700 text-white font-semibold text-xs">
                  <option value="free">Free ($0)</option>
                  <option value="basic">Básico ($29/mes)</option>
                  <option value="pro">Pro ($79/mes)</option>
                  <option value="enterprise">Enterprise ($199/mes)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-300">Ciclo</label>
                <select value={form.billingCycle} onChange={e => setForm({ ...form, billingCycle: e.target.value as any })} className="w-full px-2.5 py-1.5 rounded-lg border bg-slate-950 border-slate-700 text-white font-semibold text-xs">
                  <option value="monthly">Mensual</option>
                  <option value="yearly">Anual</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-300">Monto Mensual</label>
                <input type="number" step="0.01" value={form.monthlyPrice} onChange={e => setForm({ ...form, monthlyPrice: parseFloat(e.target.value) || 0 })} className="w-full px-2.5 py-1.5 rounded-lg border bg-slate-950 border-slate-700 text-white font-mono text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-300">Moneda Oficial</label>
                <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg border bg-slate-950 border-slate-700 text-emerald-400 font-bold text-xs">
                  <option value="CRC">₡ Colones (CRC)</option>
                  <option value="USD">$ Dólares (USD)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-300">Tipo de Negocio</label>
                <select value={form.businessType} onChange={e => setForm({ ...form, businessType: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg border bg-slate-950 border-slate-700 text-white text-xs">
                  <option value="restaurante">🍔 Restaurante</option>
                  <option value="tienda">🛍️ Tienda</option>
                  <option value="servicios">📅 Servicios</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-300">Estado</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg border bg-slate-950 border-slate-700 text-white font-semibold text-xs">
                  <option value="active">Activo</option>
                  <option value="past_due">En Mora</option>
                  <option value="cancelled">Cancelado</option>
                  <option value="suspended">Suspendido</option>
                </select>
              </div>
            </div>

            <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider pt-1">Límites de IA Asignados ($ USD/mes)</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-teal-400">GLM-5.3-Flash ($/mes)</label>
                <input type="number" step="0.5" min="0" value={form.glmLimit} onChange={e => setForm({ ...form, glmLimit: parseFloat(e.target.value) || 0 })} className="w-full px-2.5 py-1.5 rounded-lg border bg-slate-950 border-slate-700 text-teal-300 font-mono font-bold text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-purple-400">GPT-4o Mini ($/mes)</label>
                <input type="number" step="0.5" min="0" value={form.gptLimit} onChange={e => setForm({ ...form, gptLimit: parseFloat(e.target.value) || 0 })} className="w-full px-2.5 py-1.5 rounded-lg border bg-slate-950 border-slate-700 text-purple-300 font-mono font-bold text-xs" />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-800 flex justify-end gap-2 bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="sub-form"
            disabled={isSaving}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <CheckCircle2 size={13} />
            <span>{isSaving ? 'Guardando en D1...' : 'Guardar en D1'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
