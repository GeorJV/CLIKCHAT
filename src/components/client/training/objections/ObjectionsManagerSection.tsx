import React, { useState, useMemo } from 'react';
import { FAQ, Tenant } from '../../../../types';
import { ObjectionCard } from './ObjectionCard';
import { ObjectionModal } from './ObjectionModal';
import { OBJECTION_PRESETS } from './objectionPresets';
import { ShieldCheck, Plus, Search, Zap } from 'lucide-react';

interface ObjectionsManagerSectionProps {
  tenant: Tenant | null;
  faqs: FAQ[];
  onCreateFaq: (question: string, answer: string, category?: string) => Promise<boolean>;
  onUpdateFaq?: (id: string, newAnswer: string) => Promise<boolean>;
  onDeleteFaq: (id: string) => Promise<boolean>;
  onTestInSimulator?: (trigger: string) => void;
}

export const ObjectionsManagerSection: React.FC<ObjectionsManagerSectionProps> = ({
  tenant, faqs, onCreateFaq, onUpdateFaq, onDeleteFaq, onTestInSimulator
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const isService = tenant?.business_type === 'servicios';

  const relevantPresets = useMemo(() => {
    return OBJECTION_PRESETS.filter(p => {
      if (p.businessType === 'all') return true;
      return isService ? p.businessType === 'services' : p.businessType === 'products';
    });
  }, [isService]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    faqs.forEach(f => {
      if (f.category?.trim()) set.add(f.category.trim());
    });
    return ['all', ...Array.from(set)];
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter(f => {
      const matchSearch = !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat === 'all' || f.category?.trim().toLowerCase() === selectedCat.toLowerCase();
      return matchSearch && matchCat;
    });
  }, [faqs, search, selectedCat]);

  const handleApplyPreset = async (preset: typeof OBJECTION_PRESETS[0]) => {
    await onCreateFaq(preset.trigger, preset.answer, preset.category);
  };

  const handleSaveModal = async (question: string, answer: string, category: string, id?: string) => {
    if (id && onUpdateFaq) return await onUpdateFaq(id, answer);
    return await onCreateFaq(question, answer, category);
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Cabecera Principal - Sin bordes, limpia y resaltadita */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-[#0a1730]">Manejador de Objeciones (Q&A de Alta Precisión)</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 flex items-center gap-1 shadow-2xs">
                <Zap className="w-3 h-3 text-emerald-600" /> Nivel 2: $0 Costo / &lt;50ms
              </span>
            </div>
            <p className="text-xs text-[#62728d] mt-0.5">
              Respuestas blindadas a dudas frecuentes ({isService ? 'citas, tarifas, parqueo' : 'envíos, pagos, garantía'}).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => { setEditingFaq(null); setModalOpen(true); }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0d5bff] hover:bg-[#0047e1] text-white shadow-sm hover:shadow transition shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Regla de Objeción</span>
        </button>
      </div>

      {/* Barra de Plantillas Rápidas con 1 Clic - Sin bordes */}
      <div className="bg-white p-3.5 rounded-2xl shadow-sm flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] font-bold text-[#62728d] shrink-0">
          Añadir rápido:
        </span>
        <div className="flex items-center gap-1.5 flex-nowrap">
          {relevantPresets.map(preset => {
            const alreadyExists = faqs.some(f => f.question.toLowerCase().includes(preset.trigger.toLowerCase().slice(0, 15)));
            return (
              <button
                key={preset.id}
                type="button"
                disabled={alreadyExists}
                onClick={() => handleApplyPreset(preset)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                  alreadyExists
                    ? 'bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed'
                    : 'bg-[#f8fafc] hover:bg-[#ebf1ff] text-[#334155] hover:text-[#0d5bff] shadow-2xs hover:shadow-xs'
                }`}
              >
                + {preset.category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Buscador & Categorías */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#8391aa] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar regla u objeción..."
            className="w-full bg-white rounded-xl pl-9 pr-3 py-2 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 shadow-xs transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition cursor-pointer shrink-0 ${
                selectedCat === cat
                  ? 'bg-[#0d5bff] text-white font-bold shadow-sm'
                  : 'bg-white text-[#62728d] hover:text-[#0a1730] hover:bg-[#f8fafc] shadow-xs'
              }`}
            >
              {cat === 'all' ? 'Todas' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Tarjetas */}
      {filteredFaqs.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl shadow-sm space-y-2">
          <ShieldCheck className="w-7 h-7 text-[#8391aa] mx-auto" />
          <h4 className="text-xs font-bold text-[#0a1730]">No hay reglas de objeción registradas</h4>
          <p className="text-[11px] text-[#62728d] max-w-md mx-auto">
            Añade preguntas frecuentes o usa las plantillas de arriba para que el bot responda al instante en Nivel 2.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredFaqs.map(faq => (
            <ObjectionCard
              key={faq.id}
              faq={faq}
              onEdit={(f) => { setEditingFaq(f); setModalOpen(true); }}
              onDelete={onDeleteFaq}
              onTestInSimulator={onTestInSimulator}
            />
          ))}
        </div>
      )}

      {/* Modal Crear / Editar */}
      <ObjectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveModal}
        editingFaq={editingFaq}
        defaultCategory={isService ? 'Citas & Servicios' : 'Objeciones'}
      />
    </div>
  );
};
