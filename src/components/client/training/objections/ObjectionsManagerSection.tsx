import React, { useState, useMemo } from 'react';
import { FAQ, Tenant } from '../../../../types';
import { ObjectionCard } from './ObjectionCard';
import { ObjectionModal } from './ObjectionModal';
import { OBJECTION_PRESETS } from './objectionPresets';
import { ShieldCheck, Plus, Search, Zap } from 'lucide-react';
import { useVoceroMode } from '../../../../hooks/useVoceroMode';

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
  const { isVoceroMode } = useVoceroMode();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const isService = tenant?.business_type === 'servicios';
  const relevantPresets = useMemo(() => OBJECTION_PRESETS.filter(p => p.businessType === 'all' || (isService ? p.businessType === 'services' : p.businessType === 'products')), [isService]);
  const categories = useMemo(() => ['all', ...Array.from(new Set(faqs.map(f => f.category?.trim()).filter(Boolean) as string[]))], [faqs]);

  const filteredFaqs = useMemo(() => faqs.filter(f => {
    const matchSearch = !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === 'all' || f.category?.trim().toLowerCase() === selectedCat.toLowerCase();
    return matchSearch && matchCat;
  }), [faqs, search, selectedCat]);

  const handleApplyPreset = (p: typeof OBJECTION_PRESETS[0]) => onCreateFaq(p.trigger, p.answer, p.category);
  const handleSaveModal = async (q: string, a: string, c: string, id?: string) => (id && onUpdateFaq) ? onUpdateFaq(id, a) : onCreateFaq(q, a, c);

  return (
    <div className={`space-y-4 font-sans ${isVoceroMode ? 'text-[#0a1730]' : 'text-slate-100'}`}>
      {/* Cabecera Principal */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl ${
        isVoceroMode ? 'bg-white shadow-sm' : 'bg-[#181717] border border-[#282626] shadow-lg'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
            isVoceroMode ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`text-sm font-bold ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>Manejador de Objeciones (Q&A de Alta Precisión)</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs ${
                isVoceroMode ? 'bg-emerald-50 text-emerald-700' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                <Zap className="w-3 h-3 text-emerald-500" /> Nivel 2: $0 Costo / &lt;50ms
              </span>
            </div>
            <p className={`text-xs ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'} mt-0.5`}>
              Respuestas blindadas a dudas frecuentes ({isService ? 'citas, tarifas, parqueo' : 'envíos, pagos, garantía'}).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => { setEditingFaq(null); setModalOpen(true); }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:shadow transition shrink-0 cursor-pointer ${
            isVoceroMode ? 'bg-[#0d5bff] hover:bg-[#0047e1]' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/40'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Regla de Objeción</span>
        </button>
      </div>

      {/* Barra de Plantillas Rápidas con 1 Clic */}
      <div className={`p-3.5 rounded-2xl flex items-center gap-2 overflow-x-auto text-xs ${
        isVoceroMode ? 'bg-white shadow-sm' : 'bg-[#181717] border border-[#282626] shadow-md'
      }`}>
        <span className={`text-[11px] font-bold shrink-0 ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'}`}>
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
                    ? (isVoceroMode ? 'bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed' : 'bg-[#141313] text-zinc-600 cursor-not-allowed border border-[#222]')
                    : (isVoceroMode ? 'bg-[#f8fafc] hover:bg-[#ebf1ff] text-[#334155] hover:text-[#0d5bff] shadow-2xs' : 'bg-[#141313] hover:bg-[#201f1f] text-zinc-300 hover:text-white border border-[#282626]')
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
          <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${isVoceroMode ? 'text-[#8391aa]' : 'text-zinc-500'}`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar regla u objeción..."
            className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs shadow-xs transition focus:outline-none ${
              isVoceroMode ? 'bg-white text-[#0a1730] placeholder-[#8391aa] focus:ring-2 focus:ring-[#0d5bff]/20' : 'bg-[#181717] border border-[#2a2828] text-white placeholder-zinc-500 focus:border-emerald-500'
            }`}
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
                  ? (isVoceroMode ? 'bg-[#0d5bff] text-white font-bold shadow-sm' : 'bg-emerald-600 text-white font-bold shadow-sm')
                  : (isVoceroMode ? 'bg-white text-[#62728d] hover:text-[#0a1730] hover:bg-[#f8fafc] shadow-xs' : 'bg-[#181717] text-zinc-400 hover:text-white border border-[#282626]')
              }`}
            >
              {cat === 'all' ? 'Todas' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Tarjetas */}
      {filteredFaqs.length === 0 ? (
        <div className={`p-8 text-center rounded-2xl shadow-sm space-y-2 ${isVoceroMode ? 'bg-white' : 'bg-[#181717] border border-[#282626]'}`}>
          <ShieldCheck className={`w-7 h-7 mx-auto ${isVoceroMode ? 'text-[#8391aa]' : 'text-zinc-600'}`} />
          <h4 className={`text-xs font-bold ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>No hay reglas de objeción registradas</h4>
          <p className={`text-[11px] max-w-md mx-auto ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'}`}>
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
