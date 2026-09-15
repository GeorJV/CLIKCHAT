import React, { useRef } from 'react';
import { Upload, Clipboard, Trash2, Image as ImageIcon } from 'lucide-react';

interface Props {
  label: string;
  sublabel?: string;
  value?: string;
  onChange: (value: string) => void;
  aspectRatio?: 'square' | 'any';
}

export const ImageUploadField: React.FC<Props> = ({
  label, sublabel = 'Subir archivo o pegar imagen', value, onChange, aspectRatio = 'any'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string' && onChange(reader.result);
    reader.readAsDataURL(file);
  };

  const handlePasteEvent = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) { processFile(file); e.preventDefault(); break; }
      }
    }
  };

  const handlePasteClick = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    try {
      if (navigator.clipboard?.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const imgType = item.types.find((t) => t.startsWith('image/'));
          if (imgType) {
            const blob = await item.getType(imgType);
            processFile(new File([blob], 'pasted_image.png', { type: imgType }));
            return;
          }
        }
      }
    } catch (err) { console.warn('Clipboard read error:', err); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-bold text-zinc-300">{label}</label>
        <button
          type="button" onClick={handlePasteClick}
          className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition"
          title="Pegar imagen copiada en portapapeles"
        >
          <Clipboard className="w-2.5 h-2.5" /> Pegar imagen
        </button>
      </div>

      <div
        tabIndex={0} onPaste={handlePasteEvent}
        className="relative border border-dashed border-[#282626] hover:border-[#3e3b3b] focus:border-emerald-500/80 bg-[#111010] rounded-xl p-2.5 transition flex items-center gap-3 outline-none"
      >
        {value ? (
          <div className="flex items-center gap-3 w-full">
            <div className={`relative ${aspectRatio === 'square' ? 'w-12 h-12' : 'w-16 h-12'} rounded-lg overflow-hidden bg-black/40 border border-white/10 shrink-0`}>
              <img src={value} alt={label} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-medium text-zinc-200 block truncate">Imagen cargada</span>
              <span className="text-[10px] text-zinc-400 block">Clic para cambiar o pega una nueva</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button" onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 transition cursor-pointer text-xs" title="Cambiar imagen"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
              <button
                type="button" onClick={() => onChange('')}
                className="p-1.5 rounded-lg hover:bg-rose-950/40 text-rose-400 transition cursor-pointer text-xs" title="Eliminar imagen"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-between cursor-pointer py-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-medium text-zinc-200 block">{sublabel}</span>
                <span className="text-[10px] text-zinc-500">Arrastra, selecciona o presiona Ctrl+V / Pegar</span>
              </div>
            </div>
            <span className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold text-zinc-200 rounded-lg transition">
              Explorar
            </span>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }} className="hidden" />
      </div>
    </div>
  );
};
