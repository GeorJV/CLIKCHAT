/**
 * Client-Side Excel (.xlsx) and CSV Inventory Parser
 * Extracts inventory items directly in the browser with ZERO token cost.
 */

export interface ParsedInventoryItem {
  name: string;
  price: number;
  currency?: string;
  stock?: number;
  sku?: string;
  category?: string;
  short_description?: string;
  full_description?: string;
}

declare global {
  interface Window {
    XLSX?: any;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`No se pudo cargar XLSX desde ${src}`));
    document.head.appendChild(script);
  });
}

function normalizeHeader(h: string): string {
  return h.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function mapRowToItem(row: Record<string, any>): ParsedInventoryItem | null {
  const keys = Object.keys(row);
  if (keys.length === 0) return null;

  let name = '';
  let price = 0;
  let stock = 10;
  let sku = '';
  let category = 'General';
  let description = '';

  for (const k of keys) {
    const norm = normalizeHeader(k);
    const val = row[k];
    if (val === undefined || val === null || val === '') continue;

    if (['nombre', 'producto', 'articulo', 'item', 'title', 'name'].includes(norm)) {
      name = String(val).trim();
    } else if (['precio', 'price', 'costo', 'valor', 'pvp'].includes(norm)) {
      const num = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
      if (!isNaN(num)) price = num;
    } else if (['stock', 'cantidad', 'qty', 'existencias', 'cant'].includes(norm)) {
      const num = parseInt(String(val).replace(/[^0-9]/g, ''), 10);
      if (!isNaN(num)) stock = num;
    } else if (['sku', 'codigo', 'cod', 'id', 'referencia'].includes(norm)) {
      sku = String(val).trim();
    } else if (['categoria', 'category', 'tipo', 'departamento'].includes(norm)) {
      category = String(val).trim();
    } else if (['descripcion', 'description', 'detalle', 'detalles'].includes(norm)) {
      description = String(val).trim();
    }
  }

  if (!name) return null;

  return {
    name,
    price: price > 0 ? price : 0,
    currency: 'USD',
    stock,
    sku: sku || `SKU-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    category,
    short_description: description ? description.slice(0, 160) : `Producto: ${name}`,
    full_description: description || `Producto de inventario: ${name} (Stock: ${stock} unidades)`
  };
}

export async function parseInventoryFile(file: File): Promise<ParsedInventoryItem[]> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  if (ext === 'csv') {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length < 2) return [];

    const delimiter = lines[0].includes(';') ? ';' : lines[0].includes('\t') ? '\t' : ',';
    const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, ''));

    const items: ParsedInventoryItem[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, ''));
      const row: Record<string, any> = {};
      headers.forEach((h, idx) => { row[h] = cols[idx]; });
      const item = mapRowToItem(row);
      if (item) items.push(item);
    }
    return items;
  }

  if (['xlsx', 'xls'].includes(ext)) {
    if (!window.XLSX) {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
    }
    const buffer = await file.arrayBuffer();
    const workbook = window.XLSX.read(buffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rawJson = window.XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    const items: ParsedInventoryItem[] = [];
    for (const row of rawJson) {
      const item = mapRowToItem(row);
      if (item) items.push(item);
    }
    return items;
  }

  throw new Error(`Formato no compatible (.${ext}). Usa archivos .xlsx, .xls o .csv`);
}
