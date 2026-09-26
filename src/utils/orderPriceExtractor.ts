/**
 * Utilidad robusta para detectar acciones de agregado a la comanda
 * y extraer precios en CRC, USD o formatos monetarios internacionales.
 */

export function isCRCContext(text?: string, currency?: string): boolean {
  if (currency && currency.trim().toUpperCase() === 'CRC') return true;
  if (!text) return false;
  return /₡|CRC|colones|colón/i.test(text);
}

export function parsePriceNumber(raw: string | number | null | undefined, isCRC: boolean = false): number {
  if (raw === null || raw === undefined) return 0;
  if (typeof raw === 'number') {
    if (isNaN(raw)) return 0;
    if (isCRC && raw > 0 && raw < 50) return Math.round(raw * 1000);
    return isCRC ? Math.round(raw) : raw;
  }

  let clean = String(raw).trim();
  if (!clean) return 0;

  // 1. Separador de miles con punto y decimales con coma: "6.950,00" o "12.500,50"
  if (/^\d{1,3}(\.\d{3})+,\d{1,2}$/.test(clean)) {
    const val = parseFloat(clean.replace(/\./g, '').replace(',', '.'));
    return isCRC ? Math.round(val) : (val || 0);
  }

  // 2. Separador de miles con coma y decimales con punto: "6,950.00" o "12,500.50"
  if (/^\d{1,3}(,\d{3})+\.\d{1,2}$/.test(clean)) {
    const val = parseFloat(clean.replace(/,/g, ''));
    return isCRC ? Math.round(val) : (val || 0);
  }

  // 3. Separador de miles con punto (SIN decimales): "6.950", "12.500", "1.500", "1.250.000"
  if (/^\d{1,3}(\.\d{3})+$/.test(clean)) {
    return parseFloat(clean.replace(/\./g, '')) || 0;
  }

  // 4. Separador de miles con coma (SIN decimales): "6,950", "12,000", "1,250,000"
  if (/^\d{1,3}(,\d{3})+$/.test(clean)) {
    return parseFloat(clean.replace(/,/g, '')) || 0;
  }

  // 5. Coma decimal simple: "12,50" o "8,5"
  if (/^\d+,\d{1,2}$/.test(clean)) {
    const val = parseFloat(clean.replace(',', '.'));
    if (isCRC) {
      if (val > 0 && val < 50) return Math.round(val * 1000);
      return Math.round(val) || 0;
    }
    return val || 0;
  }

  // 6. Punto decimal simple: "8.50" o "12.99"
  if (/^\d+\.\d{1,2}$/.test(clean)) {
    const val = parseFloat(clean);
    if (isCRC) {
      if (val > 0 && val < 50) return Math.round(val * 1000);
      return Math.round(val) || 0;
    }
    return val || 0;
  }

  // 7. Número entero limpio: "6950", "12000"
  clean = clean.replace(/[,.]/g, '');
  let finalVal = parseFloat(clean) || 0;
  if (isCRC && finalVal > 0 && finalVal < 50) {
    finalVal = Math.round(finalVal * 1000);
  }
  return isCRC ? Math.round(finalVal) : finalVal;
}

export function extractPriceFromText(text: string, currencyHint?: string): number | null {
  if (!text) return null;
  const isCRC = isCRCContext(text, currencyHint);

  // 1. Extraer número dentro de paréntesis: ($12.50), (₡6.950), (₡6,950), (CRC 5000), (6.950)
  const parenMatch = text.match(/\(\s*(?:[\$₡€£]|CRC|USD|EUR)?\s*([\d,.]+)\s*(?:[\$₡€£]|CRC|USD|EUR)?\s*\)/i);
  if (parenMatch) {
    const parsed = parsePriceNumber(parenMatch[1], isCRC);
    if (parsed > 0) return parsed;
  }

  // 2. Extraer monto precedido o seguido de símbolo monetario
  const symbolMatch = text.match(/(?:[\$₡€£]|CRC|USD|EUR)\s*([\d,.]+)|([\d,.]+)\s*(?:[\$₡€£]|CRC|USD|EUR)/i);
  if (symbolMatch) {
    const raw = symbolMatch[1] || symbolMatch[2];
    const parsed = parsePriceNumber(raw, isCRC);
    if (parsed > 0) return parsed;
  }

  // 3. Fallback: buscar cualquier número con formato de miles o decimales
  const numMatch = text.match(/\b\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{1,2})?\b|\b\d+(?:[.,]\d{1,2})?\b/);
  if (numMatch) {
    const parsed = parsePriceNumber(numMatch[0], isCRC);
    if (parsed > 0) return parsed;
  }

  return null;
}

export function isAddOrderAction(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return /\b(agregar|sumar|anotar|anotame|agregame|sumame|quiero|ponme|dame|ordenar|pedir)\b/i.test(lower);
}
