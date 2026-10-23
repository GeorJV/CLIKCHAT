import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface Props {
  name: string;
  setName: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  price: string;
  setPrice: (v: string) => void;
  currency: string;
  setCurrency: (v: string) => void;
  sku: string;
  setSku: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  imageUrl: string;
  setImageUrl: (v: string) => void;
  externalUrl: string;
  setExternalUrl: (v: string) => void;
  isActive: boolean;
  setIsActive: (v: boolean) => void;
  businessType?: string;
}

export const ProductModalFieldsLeft: React.FC<Props> = ({
  name,
  setName,
  category,
  setCategory,
  price,
  setPrice,
  currency,
  setCurrency,
  sku,
  setSku,
  description,
  setDescription,
  imageUrl,
  setImageUrl,
  externalUrl,
  setExternalUrl,
  isActive,
  setIsActive,
  businessType = 'tienda',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isServices = businessType === 'servicios';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string' && setImageUrl(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3 font-sans">
      {/* Row 1: Nombre & Categoría */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        <div className="sm:col-span-3">
          <label className="block text-[11px] font-bold text-[#42506b] mb-1">
            {isServices ? 'Nombre del servicio *' : 'Nombre del producto *'}
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={isServices ? 'Ej. Consulta Especializada' : 'Ej. Hamburguesa Doble Queso'}
            className="w-full bg-[#f8fafc] border border-[#dde5f1] rounded-xl px-3 py-2 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:border-[#0d5bff] focus:bg-white transition"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold text-[#42506b] mb-1">Categoría</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="General"
            className="w-full bg-[#f8fafc] border border-[#dde5f1] rounded-xl px-3 py-2 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:border-[#0d5bff] focus:bg-white transition"
          />
        </div>
      </div>

      {/* Row 2: Precio, Moneda, SKU */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-[#42506b] mb-1">Precio</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="w-full bg-[#f8fafc] border border-[#dde5f1] rounded-xl px-3 py-2 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:border-[#0d5bff] focus:bg-white transition font-mono"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#42506b] mb-1">Moneda</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full bg-[#f8fafc] border border-[#dde5f1] rounded-xl px-2.5 py-2 text-xs text-[#0a1730] focus:outline-none focus:border-[#0d5bff] focus:bg-white transition"
          >
            <option value="CRC">CRC (₡ Colones)</option>
            <option value="USD">USD ($ Dólares)</option>
            <option value="MXN">MXN ($ Pesos)</option>
            <option value="EUR">EUR (€ Euros)</option>
            <option value="COP">COP ($)</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#42506b] mb-1">Código / SKU</label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="SKU-1002"
            className="w-full bg-[#f8fafc] border border-[#dde5f1] rounded-xl px-3 py-2 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:border-[#0d5bff] focus:bg-white transition font-mono"
          />
        </div>
      </div>

      {/* Row 3: Descripción */}
      <div>
        <label className="block text-[11px] font-bold text-[#42506b] mb-1">
          {isServices ? 'Descripción del servicio' : 'Descripción del producto'}
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe brevemente de qué se trata para que el bot asesore con precisión..."
          className="w-full bg-[#f8fafc] border border-[#dde5f1] rounded-xl px-3 py-2 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:border-[#0d5bff] focus:bg-white transition resize-none leading-relaxed"
        />
      </div>

      {/* Row 4: Imagen */}
      <div>
        <label className="block text-[11px] font-bold text-[#42506b] mb-1">Foto o Imagen (URL o Subir)</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://ejemplo.com/foto.jpg"
            className="flex-1 bg-[#f8fafc] border border-[#dde5f1] rounded-xl px-3 py-2 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:border-[#0d5bff] focus:bg-white transition font-mono"
          />
          <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileUpload} />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] border border-[#dde5f1] rounded-xl text-xs font-bold text-[#42506b] flex items-center gap-1.5 transition cursor-pointer shrink-0"
          >
            <Upload className="w-3.5 h-3.5 text-[#62728d]" />
            Subir
          </button>
        </div>

        {imageUrl && (
          <div className="mt-2 flex items-center justify-between p-2 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
            <div className="flex items-center gap-2 overflow-hidden">
              <img
                src={imageUrl}
                alt="Vista previa"
                className="w-8 h-8 object-cover rounded-lg border border-[#dde5f1] shrink-0"
                onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
              />
              <span className="text-[11px] text-[#42506b] truncate font-mono max-w-[220px] sm:max-w-xs">{imageUrl}</span>
            </div>
            <button
              type="button"
              onClick={() => setImageUrl('')}
              className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer transition"
              title="Eliminar imagen"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Row 5: URL externa & Checkbox activo */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center pt-1">
        <div className="sm:col-span-3">
          <label className="block text-[11px] font-bold text-[#42506b] mb-1">Enlace externo o pasarela (Opcional)</label>
          <input
            type="text"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            placeholder="https://wa.me/... o link de pago"
            className="w-full bg-[#f8fafc] border border-[#dde5f1] rounded-xl px-3 py-2 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:border-[#0d5bff] focus:bg-white transition font-mono"
          />
        </div>
        <div className="sm:col-span-2 flex items-center sm:pt-4">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#0a1730]">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-[#0d5bff] bg-white border-[#dde5f1] focus:ring-[#0d5bff] accent-[#0d5bff]"
            />
            <span>Activo en el Bot</span>
          </label>
        </div>
      </div>
    </div>
  );
};
