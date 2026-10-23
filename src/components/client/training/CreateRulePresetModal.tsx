import React, { useState } from 'react';
import { RulePreset } from './rulesPresets';
import { ShieldAlert, Plus, X, Save } from 'lucide-react';

interface CreateRulePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preset: RulePreset, activateNow: boolean) => Promise<void>;
  tenantName?: string;
}

const CATEGORY_SUGGESTIONS = [
  'Anti-Alucinación & Stock',
  'Garantías & Devoluciones',
  'Políticas de Pago & Cobro',
  'Horarios & Citas',
  'Protección de Marca',
  'Soporte Técnico'
];

export const CreateRulePresetModal: React.FC<CreateRulePresetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  tenantName = 'Mi Negocio'
}) => {
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
    const newPreset: RulePreset = {
      id: `custom_${Date.now()}`,
      title: title.trim(),
      category: category.trim() || 'Restricción Personalizada',
      template: template.trim(),
    };

    try {
      await onSave(newPreset, activateNow);
      setTitle('');
      setCategory('');
      setTemplate('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-5 sm:p-6 space-y-4 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0d5bff] shadow-2xs shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0a1730]">Nueva Plantilla de Restricción</h3>
              <p className="text-[11.5px] text-[#62728d]">Agrega una regla rápida para blindar las respuestas del bot</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8391aa] hover:text-[#0a1730] hover:bg-[#f1f5f9] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#0a1730] mb-1">Nombre de la Restricción *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Cero Descuentos en Temporada Alta"
              className="w-full bg-[#f8fafc] rounded-xl px-3.5 py-2 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:bg-white shadow-2xs transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-[#0a1730]">Subtítulo / Categoría</label>
              <span className="text-[10.5px] text-[#8391aa]">Sugerencias rápidas</span>
            </div>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ej: Anti-Alucinación & Descuentos"
              className="w-full bg-[#f8fafc] rounded-xl px-3.5 py-2 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:bg-white shadow-2xs transition"
            />
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {CATEGORY_SUGGESTIONS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className="px-2 py-0.5 rounded-lg bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[10.5px] font-semibold text-[#475569] transition cursor-pointer shadow-2xs"
                >
                  + {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0a1730] mb-1">Descripción & Reglas a Inyectar *</label>
            <textarea
              required
              rows={4}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              placeholder={`REGLAS DE OPERACIÓN:\n- Queda estrictamente prohibido aplicar descuentos que no figuren en la lista oficial de ${tenantName}.\n- Si el cliente insiste, invítalo amablemente a consultar por WhatsApp.`}
              className="w-full bg-[#f8fafc] rounded-xl p-3 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:bg-white shadow-2xs transition leading-relaxed resize-none"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-0.5 select-none">
            <input
              type="checkbox"
              checked={activateNow}
              onChange={(e) => setActivateNow(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#0d5bff] focus:ring-[#0d5bff]"
            />
            <span className="text-xs font-bold text-[#0a1730]">
              Activar y añadir de inmediato a las reglas activas del bot
            </span>
          </label>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#62728d] hover:text-[#0a1730] hover:bg-[#f1f5f9] transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !template.trim() || isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0d5bff] hover:bg-[#0047e1] text-white shadow-sm hover:shadow transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Guardando...</span>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Plantilla</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
