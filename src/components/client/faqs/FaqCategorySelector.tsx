import React, { useState, useMemo } from 'react';
import { Plus, Check, X, Tag } from 'lucide-react';

interface FaqCategorySelectorProps {
  value: string;
  onChange: (category: string) => void;
  existingCategories?: string[];
}

const DEFAULT_CATS = ['general', 'pagos', 'envíos', 'horarios', 'servicios', 'productos', 'garantías', 'soporte'];

export const FaqCategorySelector: React.FC<FaqCategorySelectorProps> = ({
  value,
  onChange,
  existingCategories = []
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCatInput, setNewCatInput] = useState('');
  const [customCats, setCustomCats] = useState<string[]>([]);

  const categoryOptions = useMemo(() => {
    const list: string[] = [];
    const seen = new Set<string>();
    const add = (cat: string) => {
      const norm = cat.trim();
      if (norm && !seen.has(norm.toLowerCase())) {
        seen.add(norm.toLowerCase());
        list.push(norm);
      }
    };
    DEFAULT_CATS.forEach(add);
    existingCategories.forEach(add);
    customCats.forEach(add);
    if (value) add(value);
    return list;
  }, [existingCategories, customCats, value]);

  const handleSaveNew = () => {
    const clean = newCatInput.trim();
    if (clean) {
      if (!categoryOptions.some(c => c.toLowerCase() === clean.toLowerCase())) {
        setCustomCats(prev => [...prev, clean]);
      }
      onChange(clean.toLowerCase());
    }
    setNewCatInput('');
    setIsAdding(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
          <Tag className="w-3 h-3 text-emerald-400" />
          <span>Categoría</span>
        </label>
        {!isAdding && (
          <span className="text-[10px] text-zinc-500 font-mono">
            {value ? `Seleccionada: ${value}` : 'Por defecto: general'}
          </span>
        )}
      </div>

      {isAdding ? (
        <div className="flex items-center gap-1.5 bg-[#121111] p-1 rounded-lg border border-emerald-500/70 shadow-sm">
          <input
            type="text"
            autoFocus
            value={newCatInput}
            onChange={e => setNewCatInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); handleSaveNew(); }
              if (e.key === 'Escape') { setIsAdding(false); setNewCatInput(''); }
            }}
            placeholder="Ej: devoluciones, promociones..."
            className="flex-1 bg-transparent px-2 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSaveNew}
            className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition shadow"
            title="Guardar y seleccionar esta categoría"
          >
            <Check className="w-3 h-3" />
            <span>Agregar</span>
          </button>
          <button
            type="button"
            onClick={() => { setIsAdding(false); setNewCatInput(''); }}
            className="p-1 text-zinc-400 hover:text-white rounded hover:bg-[#222020] cursor-pointer"
            title="Cancelar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <select
              value={value.toLowerCase()}
              onChange={e => e.target.value === '__new__' ? setIsAdding(true) : onChange(e.target.value)}
              className="w-full bg-[#121111] border border-[#282626] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer capitalize appearance-none pr-8"
            >
              {categoryOptions.map(c => (
                <option key={c} value={c.toLowerCase()} className="bg-[#181717] text-white">
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
              <option value="__new__" className="bg-[#1f1e1e] text-emerald-400 font-bold">
                ➕ Agregar otra categoría...
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="px-2.5 py-1.5 rounded-lg bg-[#201f1f] hover:bg-[#2a2828] border border-[#2e2b2b] text-emerald-400 hover:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-sm"
            title="Agregar nueva categoría"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nueva</span>
          </button>
        </div>
      )}
    </div>
  );
};
