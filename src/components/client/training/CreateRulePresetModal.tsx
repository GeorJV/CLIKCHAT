import React, { useState } from 'react';
import { RulePreset } from './rulesPresets';
import { ShieldAlert, Plus, X, Save } from 'lucide-react';
import { useVoceroMode } from '../../../hooks/useVoceroMode';

interface CreateRulePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preset: RulePreset, activateNow: boolean) => Promise<void>;
  tenantName?: string;
}

const CATEGORY_SUGGESTIONS = ['Anti-Alucinación & Stock', 'Garantías & Devoluciones', 'Políticas de Pago & Cobro', 'Horarios & Citas', 'Protección de Marca'];

export const CreateRulePresetModal: React.FC<CreateRulePresetModalProps> = ({ isOpen, onClose, onSave, tenantName = 'Mi Negocio' }) => {
  const { isVoceroMode } = useVoceroMode();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [template, setTemplate] = useState('');
  const [activateNow, setActivateNow] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !template.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const newPreset: RulePreset = { id: `custom_${Date.now()}`, title: title.trim(), category: category.trim() || 'Restricción Personalizada', template: template.trim() };
    try {
      await onSave(newPreset, activateNow);
      setTitle(''); setCategory(''); setTemplate('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = isVoceroMode
    ? 'w-full bg-[#f8fafc] rounded-xl px-3.5 py-2 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:bg-white shadow-2xs transition'
    : 'w-full bg-[#121111] border border-[#2c2a2a] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:bg-[#151414] shadow-2xs transition';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
      <div className={`rounded-2xl w-full max-w-lg shadow-2xl p-5 sm:p-6 space-y-4 relative ${
        isVoceroMode ? 'bg-white text-[#0a1730]' : 'bg-[#181717] border border-[#282626] text-white'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-2xs shrink-0 ${
              isVoceroMode ? 'bg-blue-50 text-[#0d5bff]' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>Nueva Plantilla de Restricción</h3>
              <p className={`text-[11.5px] ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'}`}>Agrega una regla rápida para blindar las respuestas del bot</p>
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

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className={`block text-xs font-bold mb-1 ${isVoceroMode ? 'text-[#0a1730]' : 'text-zinc-300'}`}>Nombre de la Restricción *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Cero Descuentos en Temporada Alta"
              className={inputCls}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={`block text-xs font-bold ${isVoceroMode ? 'text-[#0a1730]' : 'text-zinc-300'}`}>Subtítulo / Categoría</label>
              <span className={`text-[10.5px] ${isVoceroMode ? 'text-[#8391aa]' : 'text-zinc-500'}`}>Sugerencias rápidas</span>
            </div>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ej: Anti-Alucinación & Descuentos"
              className={inputCls}
            />
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {CATEGORY_SUGGESTIONS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-2 py-0.5 rounded-lg text-[10.5px] font-semibold transition cursor-pointer shadow-2xs ${
                    isVoceroMode
                      ? 'bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569]'
                      : 'bg-[#141313] hover:bg-[#222020] text-zinc-400 hover:text-zinc-200 border border-[#282626]'
                  }`}
                >
                  + {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-xs font-bold mb-1 ${isVoceroMode ? 'text-[#0a1730]' : 'text-zinc-300'}`}>Descripción & Reglas a Inyectar *</label>
            <textarea
              required
              rows={4}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              placeholder={`REGLAS DE OPERACIÓN:\n- Queda estrictamente prohibido aplicar descuentos que no figuren en la lista oficial de ${tenantName}.\n- Si el cliente insiste, invítalo amablemente a consultar por WhatsApp.`}
              className={`w-full rounded-xl p-3 text-xs shadow-2xs transition leading-relaxed resize-none ${
                isVoceroMode
                  ? 'bg-[#f8fafc] text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:bg-white'
                  : 'bg-[#121111] border border-[#2c2a2a] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:bg-[#151414]'
              }`}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-0.5 select-none">
            <input
              type="checkbox"
              checked={activateNow}
              onChange={(e) => setActivateNow(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
            />
            <span className={`text-xs font-bold ${isVoceroMode ? 'text-[#0a1730]' : 'text-zinc-200'}`}>
              Activar y añadir de inmediato a las reglas activas del bot
            </span>
          </label>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                isVoceroMode ? 'text-[#62728d] hover:text-[#0a1730] hover:bg-[#f1f5f9]' : 'text-zinc-400 hover:text-white hover:bg-[#222020]'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !template.trim() || isSubmitting}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:shadow transition disabled:opacity-50 cursor-pointer ${
                isVoceroMode ? 'bg-[#0d5bff] hover:bg-[#0047e1]' : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              {isSubmitting ? <span>Guardando...</span> : <><Save className="w-3.5 h-3.5" /><span>Guardar Plantilla</span></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
