/**
 * Utilidad robusta para detectar acciones de agregado a la comanda
 * y extraer precios en CRC, USD o formatos monetarios internacionales.
 */

export function isCRCContext(text?: string, currency?: string): boolean {
  if (currency && currency.trim().toUpperCase() === 'CRC') return true;
  if (!text) return false;
  return /[₡¢]|CRC|colones|colón/i.test(text);
}

export function parsePriceNumber(raw: string | number | null | undefined, isCRC: boolean = false): number {
  if (raw === null || raw === undefined) return 0;
  if (typeof raw === 'number') {
    if (isNaN(raw)) return 0;
    if (isCRC && raw > 0 && raw < 50) return Math.round(raw * 1000);
    return isCRC ? Math.round(raw) : raw;
  }

  let clean = String(raw).replace(/[*_]/g, '').trim().replace(/[.,;:\s]+$/, '');
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

  // 1. Extraer número dentro de paréntesis: ($12.50), (₡6.950), (¢12.400), (CRC 5000), (6.950)
  const parenMatch = text.match(/\(\s*(?:[\$₡¢€£]|CRC|USD|EUR)?\s*[*_]*([\d,.]+)[*_]*\s*(?:[\$₡¢€£]|CRC|USD|EUR)?\s*\)/i);
  if (parenMatch) {
    const raw = parenMatch[1].replace(/[*_]/g, '').replace(/[.,;:\s]+$/, '');
    const parsed = parsePriceNumber(raw, isCRC);
    if (parsed > 0) return parsed;
  }

  // 2. Extraer monto precedido o seguido de símbolo monetario (soporta markdown **): **¢12.400**, ¢12.400, $2.500
  const symbolMatch = text.match(/[*_]*(?:[\$₡¢€£]|CRC|USD|EUR)[*_]*\s*[*_]*([\d,.]+)[*_]*|[*_]*([\d,.]+)[*_]*\s*[*_]*(?:[\$₡¢€£]|CRC|USD|EUR)[*_]*/i);
  if (symbolMatch) {
    const raw = (symbolMatch[1] || symbolMatch[2]).replace(/[*_]/g, '').replace(/[.,;:\s]+$/, '');
    const parsed = parsePriceNumber(raw, isCRC);
    if (parsed > 0) return parsed;
  }

  // 3. Extraer monto después de palabras clave de precio: "precio oficial es de **¢12.400**", "precio de $2.500"
  const pricePhraseMatch = text.match(/(?:precio|valor|cuesta|vale|costo)\s*(?:oficial)?\s*(?:es\s*de|de|es)?\s*[:*]*\s*[*_]*(?:[\$₡¢€£]|CRC|USD|EUR)?[*_]*\s*[*_]*([\d,.]+)/i);
  if (pricePhraseMatch) {
    const raw = pricePhraseMatch[1].replace(/[*_]/g, '').replace(/[.,;:\s]+$/, '');
    const parsed = parsePriceNumber(raw, isCRC);
    if (parsed > 0) return parsed;
  }

  // 4. Fallback: buscar cualquier número con formato de miles o decimales
  const numMatch = text.match(/\b\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{1,2})?\b|\b\d+(?:[.,]\d{1,2})?\b/);
  if (numMatch) {
    const raw = numMatch[0].replace(/[*_]/g, '').replace(/[.,;:\s]+$/, '');
    const parsed = parsePriceNumber(raw, isCRC);
    if (parsed > 0) return parsed;
  }

  return null;
}

export function cleanProductQueryName(rawMsg: string): string {
  if (!rawMsg || typeof rawMsg !== 'string') return '';
  let text = rawMsg.replace(/[¿¡]+/g, ' ').replace(/[?¿!¡]/g, '').trim();

  // 1. Quitar saludos compuestos y cortesías al inicio
  text = text.replace(/^(?:(?:hola|buenas(?:\s*tardes|\s*noches|\s*d[ií]as)?|buenos\s*d[ií]as|hey|hi|saludos|disculpa|disculpe|oye|ey|por\s*favor|porfa|por\s*fa)\b[\s,]*)+/i, '');
  text = text.replace(/[\s,]*(?:por\s*favor|porfa|por\s*fa|gracias|muchas\s*gracias)\s*$/i, '');

  // 2. Quitar verbos de agregación iniciales
  text = text.replace(/^(?:agregar|agregame|agregale|anadir|anademe|sumar|sumame|anotar|anotame|ponme|dame|sirveme|traeme|apuntame)\s+/i, '');

  // 3. Quitar verbos y preguntas introductorias
  text = text.replace(/^(?:me\s*gustar[ií]a\s*saber|quisiera\s*saber|me\s*puedes\s*(?:decir|indicar)|me\s*dices|dime|sabes|deseo\s*saber|quiero\s*saber|consulto|consultar|averiguar)\s+(?:sobre\s+)?/i, '');

  // 4. Quitar preguntas de precio/ingredientes al inicio
  text = text.replace(/^(?:cu[aá]nto\s*(?:vale|cuesta|sale|es|ser[ií]a)|qu[eé]\s*precio\s*(?:tiene)?|precio\s*(?:del?|de\s*la|de\s*los|de\s*las)?|costo\s*(?:del?|de\s*la)?|a\s*c[oó]mo\s*(?:est[aá]|sale)|qu[eé]\s*(?:trae|incluye|contiene|lleva|es|son)|c[oó]mo\s*viene|cu[aá]les\s*son\s*(?:los\s*ingredientes|las\s*opciones))\s+(?:de\s+|del\s+)?/i, '');

  // 5. Quitar preguntas de precio/ingredientes al final (ej: "la carlota de melocoton cuanto vale?")
  text = text.replace(/\s+(?:cu[aá]nto\s*(?:vale|cuesta|sale|es|ser[ií]a)|qu[eé]\s*precio\s*(?:tiene)?|a\s*c[oó]mo\s*(?:est[aá]|sale)|precio|costo|qu[eé]\s*(?:trae|incluye|contiene|lleva|es)|c[oó]mo\s*viene|qu[eé]\s*ingredientes\s*(?:trae|tiene|lleva|son)|ingredientes)\s*$/i, '');

  // 6. Quitar remanentes de preguntas en el medio o verbos finales residuales
  text = text.replace(/\b(?:cu[aá]nto\s*(?:vale|cuesta|sale)|qu[eé]\s*precio\s*tiene|a\s*c[oó]mo\s*(?:est[aá]|sale))\b/gi, '');
  text = text.replace(/\s+(?:vale|cuesta|sale|es|tiene|trae)$/i, '');

  // 7. Quitar sufijos de acción de comanda/pedido ("al pedido", "a la orden")
  text = text.replace(/\s+(?:al\s*pedido|a\s*la\s*(?:comanda|orden|cuenta)|al\s*carrito|para\s*llevar|para\s*comer\s*aqu[ií])$/i, '');

  // 8. Quitar artículos o preposiciones iniciales ("el", "la", "los", "las", "un", "una", "del", "de la")
  text = text.replace(/^(?:el|la|los|las|un|una|unos|unas|del?|de\s*la|de\s*los|de\s*las)\s+/i, '');

  // 9. Limpieza final de signos de puntuación y espacios
  text = text.replace(/[.,;:()\-]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text || text.length < 2) return '';

  const minorWords = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'con', 'y', 'en', 'a', 'al', 'sin', 'por', 'para']);
  const words = text.split(/\s+/);
  return words.map((w, idx) => {
    const lower = w.toLowerCase();
    if (idx > 0 && minorWords.has(lower)) return lower;
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join(' ');
}

export function isAddOrderAction(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const startsWithAdd = /^(?:agregar|agregame|agregale|anadir|sumar|anotar|ponme)\b/i.test(lower);
  if (!startsWithAdd) {
    const isInformational = /\b(que\s*(trae|incluye|contiene|lleva|viene|es)|cuales\s*son|ingredientes|cuanto\s*(vale|cuesta|sale|es)|precio|costo|saber|conocer|ver|consultar|informacion|info|horario|ubicacion|menu|carta)\b/i.test(lower);
    if (isInformational) return false;
  }

  const hasAddVerb = /\b(agregar|agregame|agregale|anadir|anademe|sumar|sumame|anotar|anotame|ponme|dame|sirveme|traeme|incluyeme|apuntame)\b/i.test(lower);
  const hasOrderIntent = /\b(quiero|deseo|voy\s*a|me\s*gustaria)\s+(ordenar|pedir|llevar|comprar|un|una|dos|tres|\d+|el|la|este|esta)\b/i.test(lower);
  return hasAddVerb || hasOrderIntent || startsWithAdd;
}

