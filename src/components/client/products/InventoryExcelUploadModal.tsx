import React, { useState, useRef } from 'react';
import { X, FileSpreadsheet, Upload, Check, AlertCircle, Sparkles } from 'lucide-react';
import { parseInventoryFile, ParsedInventoryItem } from '../../../utils/excelParser';

interface InventoryExcelUploadModalProps {
  isOpen: boolean;
  tenantId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const InventoryExcelUploadModal: React.FC<InventoryExcelUploadModalProps> = ({
  isOpen,
  tenantId,
  onClose,
  onSuccess
}) => {
  const [items, setItems] = useState<ParsedInventoryItem[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsParsing(true);
    setStatusMsg(null);
    setFileName(file.name);
    try {
      const parsed = await parseInventoryFile(file);
      if (parsed.length === 0) throw new Error('No se encontraron filas válidas de productos en el archivo.');
      setItems(parsed);
      setStatusMsg({ type: 'ok', text: `¡Se leyeron ${parsed.length} productos listos para importar!` });
    } catch (err: any) {
      setStatusMsg({ type: 'err', text: err.message || 'Error al procesar el archivo Excel.' });
      setItems([]);
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleImport = async () => {
    if (!tenantId || items.length === 0 || isUploading) return;
    setIsUploading(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/products/bulk-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, products: items })
      });
      if (!res.ok) throw new Error('Error al guardar los productos en Cloudflare D1.');
      setStatusMsg({ type: 'ok', text: `¡${items.length} productos importados exitosamente!` });
      setTimeout(() => { onSuccess(); onClose(); setItems([]); setFileName(''); }, 1200);
    } catch (err: any) {
      setStatusMsg({ type: 'err', text: err.message || 'Error importando inventario.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-[#121111] border border-[#2b2828] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-[#242222] flex items-center justify-between bg-[#171616]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <span>Importar Inventario desde Excel / CSV</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-extrabold">Instantáneo</span>
              </h3>
              <p className="text-xs text-zinc-400">Carga masiva de stock, precios y SKUs para que el chatbot responda consultas exactas.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-[#343030] hover:border-emerald-500/50 bg-[#161515] rounded-xl p-4 text-center cursor-pointer transition group">
            <input type="file" ref={fileInputRef} onChange={handleFile} accept=".xlsx,.xls,.csv" className="hidden" />
            <div className="flex items-center justify-center gap-2 text-zinc-300 text-xs font-semibold">
              <Upload className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
              <span>Arrastra o sube tu archivo: <strong className="text-emerald-300">.xlsx, .xls o .csv</strong></span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Columnas reconocidas: Nombre, Precio, Stock, SKU, Categoría, Descripción.</p>
          </div>

          {isParsing && <div className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-950/30 p-2 rounded-lg border border-emerald-800/30 animate-pulse">Leyendo filas del archivo...</div>}
          {statusMsg && (
            <div className={`text-xs flex items-center gap-1.5 p-2 rounded-lg border ${statusMsg.type === 'ok' ? 'text-emerald-400 bg-emerald-950/30 border-emerald-800/30' : 'text-rose-400 bg-rose-950/30 border-rose-800/30'}`}>
              {statusMsg.type === 'ok' ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {items.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span className="font-bold uppercase tracking-wider">Previsualización de Datos ({items.length} productos):</span>
                <span className="text-emerald-400 font-mono text-[10px]">{fileName}</span>
              </div>
              <div className="max-h-48 overflow-y-auto border border-[#2b2929] rounded-xl bg-[#161515]">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#1e1c1c] text-zinc-400 sticky top-0 border-b border-[#2b2929]">
                    <tr>
                      <th className="p-2">Producto</th>
                      <th className="p-2">Precio</th>
                      <th className="p-2">Stock</th>
                      <th className="p-2">SKU</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222020] text-zinc-300">
                    {items.slice(0, 20).map((it, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="p-2 font-medium text-white">{it.name}</td>
                        <td className="p-2 text-emerald-400">${it.price}</td>
                        <td className="p-2">{it.stock ?? 0} u.</td>
                        <td className="p-2 text-zinc-500 font-mono text-[10px]">{it.sku || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {items.length > 20 && <p className="text-[10px] text-zinc-500 italic text-right">+ {items.length - 20} productos adicionales se importarán...</p>}
            </div>
          )}
        </div>

        <div className="p-3.5 border-t border-[#242222] bg-[#171616] flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} disabled={isUploading} className="px-3 py-1.5 text-xs text-zinc-300 hover:text-white bg-[#222020] hover:bg-[#2b2828] rounded-xl border border-[#2e2c2c] transition">
            Cancelar
          </button>
          <button type="button" onClick={handleImport} disabled={items.length === 0 || isUploading} className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 rounded-xl transition flex items-center gap-1.5 shadow-md disabled:opacity-40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isUploading ? 'Importando...' : `Confirmar e Importar (${items.length})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
