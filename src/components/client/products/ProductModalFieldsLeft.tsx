import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface Props {
  name: string; setName: (v: string) => void;
  category: string; setCategory: (v: string) => void;
  price: string; setPrice: (v: string) => void;
  currency: string; setCurrency: (v: string) => void;
  sku: string; setSku: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  imageUrl: string; setImageUrl: (v: string) => void;
  externalUrl: string; setExternalUrl: (v: string) => void;
  isActive: boolean; setIsActive: (v: boolean) => void;
}

export const ProductModalFieldsLeft: React.FC<Props> = ({
  name, setName, category, setCategory, price, setPrice,
  currency, setCurrency, sku, setSku, description, setDescription,
  imageUrl, setImageUrl, externalUrl, setExternalUrl, isActive, setIsActive
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string' && setImageUrl(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2.5">
      {/* Row 1: Nombre & Categoría */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        <div className="sm:col-span-3">
          <label className="block text-[11px] font-semibold text-zinc-300 mb-0.5">Nombre del producto *</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Chatbot con IA para Negocios" className="w-full bg-[#121111] border border-[#282626] rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-semibold text-zinc-300 mb-0.5">Categoría</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="General" className="w-full bg-[#121111] border border-[#282626] rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" />
        </div>
      </div>

      {/* Row 2: Precio, Moneda, SKU */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div>
          <label className="block text-[11px] font-semibold text-zinc-300 mb-0.5">Precio (Opcional)</label>
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00 (Opcional)" className="w-full bg-[#121111] border border-[#282626] rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-zinc-300 mb-0.5">Moneda</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-[#121111] border border-[#282626] rounded-lg px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500">
            <option value="CRC">CRC (₡ Colones)</option>
            <option value="USD">USD ($ Dólares)</option>
            <option value="EUR">EUR (€ Euros)</option>
            <option value="MXN">MXN ($)</option>
            <option value="COP">COP ($)</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-zinc-300 mb-0.5">SKU (Código)</label>
          <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU-1789412737" className="w-full bg-[#121111] border border-[#282626] rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono" />
        </div>
      </div>

      {/* Row 3: Descripción del producto */}
      <div>
        <label className="block text-[11px] font-semibold text-zinc-300 mb-0.5">Descripción del producto</label>
        <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Automatiza la atención al cliente, califica leads y aumenta las ventas de tu negocio..." className="w-full bg-[#121111] border border-[#282626] rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed" />
      </div>

      {/* Row 4: Imagen del producto */}
      <div>
        <label className="block text-[11px] font-semibold text-zinc-300 mb-0.5">Imagen del producto (URL o Subir archivo)</label>
        <div className="flex gap-2">
          <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="flex-1 bg-[#121111] border border-[#282626] rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono" />
          <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileUpload} />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-[#201f1f] hover:bg-[#282727] border border-[#2e2b2b] rounded-lg text-xs font-semibold text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0">
            <Upload className="w-3.5 h-3.5 text-zinc-400" />
            Subir
          </button>
        </div>

        {imageUrl && (
          <div className="mt-1.5 flex items-center justify-between p-1.5 rounded-lg bg-[#141313] border border-[#262424]">
            <div className="flex items-center gap-2 overflow-hidden">
              <img src={imageUrl} alt="Vista previa" className="w-7 h-7 object-cover rounded border border-[#2e2b2b] shrink-0" onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }} />
              <span className="text-[11px] text-zinc-300 truncate font-mono max-w-[220px] sm:max-w-xs">{imageUrl}</span>
            </div>
            <button type="button" onClick={() => setImageUrl('')} className="text-red-400 hover:text-red-300 p-1 cursor-pointer transition-colors" title="Eliminar imagen">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Row 5: URL externa & Checkbox activo */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-center pt-0.5">
        <div className="sm:col-span-3">
          <label className="block text-[11px] font-semibold text-zinc-300 mb-0.5">URL externa opcional</label>
          <input type="text" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} placeholder="https://..." className="w-full bg-[#121111] border border-[#282626] rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono" />
        </div>
        <div className="sm:col-span-2 flex items-center sm:pt-4">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-300">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-3.5 h-3.5 rounded text-emerald-500 bg-[#121111] border-[#2e2b2b] focus:ring-emerald-500 accent-emerald-500" />
            <span>Producto activo en IA</span>
          </label>
        </div>
      </div>
    </div>
  );
};
