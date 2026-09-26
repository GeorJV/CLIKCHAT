/**
 * Utilidad robusta para detectar acciones de agregado a la comanda
 * y extraer precios en CRC, USD o formatos monetarios internacionales.
 */

export function extractPriceFromText(text: string): number | null {
  if (!text) return null;

  // 1. Extraer número dentro de paréntesis con símbolo monetario: ($12.50), (₡6,500), (CRC 5000)
  const parenMatch = text.match(/\(\s*(?:[\$₡€£]|CRC|USD|EUR)?\s*([\d,.]+)\s*(?:[\$₡€£]|CRC|USD|EUR)?\s*\)/i);
  if (parenMatch) {
    const parsed = parsePriceNumber(parenMatch[1]);
    if (parsed > 0) return parsed;
  }

  // 2. Extraer monto precedido o seguido de símbolo monetario
  const symbolMatch = text.match(/(?:[\$₡€£]|CRC|USD|EUR)\s*([\d,.]+)|([\d,.]+)\s*(?:[\$₡€£]|CRC|USD|EUR)/i);
  if (symbolMatch) {
    const raw = symbolMatch[1] || symbolMatch[2];
    const parsed = parsePriceNumber(raw);
    if (parsed > 0) return parsed;
  }

  // 3. Fallback: buscar cualquier número decimal o entero en el texto
  const numMatch = text.match(/\b\d+(?:[.,]\d{1,2})?\b/);
  if (numMatch) {
    const parsed = parsePriceNumber(numMatch[0]);
    if (parsed > 0) return parsed;
  }

  return null;
}

function parsePriceNumber(raw: string): number {
  if (!raw) return 0;
  let clean = raw.trim();

  // Si tiene formato como "6,500" o "12,000" (sin decimales, coma de miles)
  if (/^\d{1,3}(,\d{3})+$/.test(clean)) {
    clean = clean.replace(/,/g, '');
    return parseFloat(clean) || 0;
  }

  // Si tiene coma como separador decimal: "12,50"
  if (/^\d+,\d{1,2}$/.test(clean)) {
    clean = clean.replace(',', '.');
    return parseFloat(clean) || 0;
  }

  // Si tiene punto como miles y coma como decimal: "6.500,00"
  if (/^\d{1,3}(\.\d{3})+,\d{1,2}$/.test(clean)) {
    clean = clean.replace(/\./g, '').replace(',', '.');
    return parseFloat(clean) || 0;
  }

  // Si tiene coma como miles y punto como decimal: "6,500.00"
  if (/^\d{1,3}(,\d{3})+\.\d{1,2}$/.test(clean)) {
    clean = clean.replace(/,/g, '');
    return parseFloat(clean) || 0;
  }

  clean = clean.replace(/,/g, '');
  return parseFloat(clean) || 0;
}

export function isAddOrderAction(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return /\b(agregar|sumar|anotar|anotame|agregame|sumame|quiero|ponme|dame|ordenar|pedir)\b/i.test(lower);
}
