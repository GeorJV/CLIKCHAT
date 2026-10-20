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

  if (/^\d{1,3}(\.\d{3})+,\d{1,2}$/.test(clean)) {
    const val = parseFloat(clean.replace(/\./g, '').replace(',', '.'));
    return isCRC ? Math.round(val) : (val || 0);
  }

  if (/^\d{1,3}(,\d{3})+\.\d{1,2}$/.test(clean)) {
    const val = parseFloat(clean.replace(/,/g, ''));
    return isCRC ? Math.round(val) : (val || 0);
  }

  if (/^\d{1,3}(\.\d{3})+$/.test(clean)) {
    return parseFloat(clean.replace(/\./g, '')) || 0;
  }

  if (/^\d{1,3}(,\d{3})+$/.test(clean)) {
    return parseFloat(clean.replace(/,/g, '')) || 0;
  }

  if (/^\d+,\d{1,2}$/.test(clean)) {
    const val = parseFloat(clean.replace(',', '.'));
    if (isCRC) {
      if (val > 0 && val < 50) return Math.round(val * 1000);
      return Math.round(val) || 0;
    }
    return val || 0;
  }

  if (/^\d+\.\d{1,2}$/.test(clean)) {
    const val = parseFloat(clean);
    if (isCRC) {
      if (val > 0 && val < 50) return Math.round(val * 1000);
      return Math.round(val) || 0;
    }
    return val || 0;
  }

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

  const parenMatch = text.match(/\(\s*(?:[\$₡¢€£]|CRC|USD|EUR)?\s*[*_]*([\d,.]+)[*_]*\s*(?:[\$₡¢€£]|CRC|USD|EUR)?\s*\)/i);
  if (parenMatch) {
    const raw = parenMatch[1].replace(/[*_]/g, '').replace(/[.,;:\s]+$/, '');
    const parsed = parsePriceNumber(raw, isCRC);
    if (parsed > 0) return parsed;
  }

  const symbolMatch = text.match(/[*_]*(?:[\$₡¢€£]|CRC|USD|EUR)[*_]*\s*[*_]*([\d,.]+)[*_]*|[*_]*([\d,.]+)[*_]*\s*[*_]*(?:[\$₡¢€£]|CRC|USD|EUR)[*_]*/i);
  if (symbolMatch) {
    const raw = (symbolMatch[1] || symbolMatch[2]).replace(/[*_]/g, '').replace(/[.,;:\s]+$/, '');
    const parsed = parsePriceNumber(raw, isCRC);
    if (parsed > 0) return parsed;
  }

  const pricePhraseMatch = text.match(/(?:precio|valor|cuesta|vale|costo)\s*(?:oficial)?\s*(?:es\s*de|de|es)?\s*[:*]*\s*[*_]*(?:[\$₡¢€£]|CRC|USD|EUR)?[*_]*\s*[*_]*([\d,.]+)/i);
  if (pricePhraseMatch) {
    const raw = pricePhraseMatch[1].replace(/[*_]/g, '').replace(/[.,;:\s]+$/, '');
    const parsed = parsePriceNumber(raw, isCRC);
    if (parsed > 0) return parsed;
  }

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

  text = text.replace(/^(?:(?:hola|buenas(?:\s*tardes|\s*noches|\s*d[ií]as)?|buenos\s*d[ií]as|hey|hi|saludos|disculpa|disculpe|oye|ey|por\s*favor|porfa|por\s*fa)\b[\s,]*)+/i, '');
  text = text.replace(/[\s,]*(?:por\s*favor|porfa|por\s*fa|gracias|muchas\s*gracias)\s*$/i, '');

  text = text.replace(/^(?:agregar|agregame|agregale|anadir|anademe|sumar|sumame|anotar|anotame|ponme|dame|sirveme|traeme|apuntame)\s+/i, '');

  text = text.replace(/^(?:me\s*gustar[ií]a\s*saber|quisiera\s*saber|me\s*puedes\s*(?:decir|indicar)|me\s*dices|dime|sabes|deseo\s*saber|quiero\s*saber|consulto|consultar|averiguar)\s+(?:sobre\s+)?/i, '');

  text = text.replace(/^(?:cu[aá]nto\s*(?:vale|cuesta|sale|es|ser[ií]a)|qu[eé]\s*precio\s*(?:tiene)?|precio\s*(?:del?|de\s*la|de\s*los|de\s*las)?|costo\s*(?:del?|de\s*la)?|a\s*c[oó]mo\s*(?:est[aá]|sale)|qu[eé]\s*(?:trae|incluye|contiene|lleva|es|son)|c[oó]mo\s*viene|cu[aá]les\s*son\s*(?:los\s*ingredientes|las\s*opciones))\s+(?:de\s+|del\s+)?/i, '');

  text = text.replace(/\s+(?:cu[aá]nto\s*(?:vale|cuesta|sale|es|ser[ií]a)|qu[eé]\s*precio\s*(?:tiene)?|a\s*c[oó]mo\s*(?:est[aá]|sale)|precio|costo|qu[eé]\s*(?:trae|incluye|contiene|lleva|es)|c[oó]mo\s*viene|qu[eé]\s*ingredientes\s*(?:trae|tiene|lleva|son)|ingredientes)\s*$/i, '');

  text = text.replace(/\b(?:cu[aá]nto\s*(?:vale|cuesta|sale)|qu[eé]\s*precio\s*tiene|a\s*c[oó]mo\s*(?:est[aá]|sale))\b/gi, '');
  text = text.replace(/\s+(?:vale|cuesta|sale|es|tiene|trae)$/i, '');

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

export function isReferentialItemPhrase(text: string): boolean {
  if (!text) return true;
  const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  return /^(?:(?:si|ok|bueno|dale|claro|porfa|por\s*favor)\s*,?\s*)*(?:(?:dame|quiero|ponme|agregame|anotame|apuntame|traeme|sirveme|mandame|echale)?\s*(?:uno|una|un|ese|esa|esos|esas|esto|estos|estas|de\s+esos|de\s+esas|de\s+este|de\s+esta|de\s+ese|de\s+esa|el\s+mismo|lo\s+mismo|uno\s+de\s+esos|uno\s+de\s+esas)|(?:anotad[oa]|anotamelo|agregamelo|apuntamelo|damelo|dale|de\s+una|venga|va))$/i.test(lower)
    || /^(?:uno|una|un|ese|esa|esos|esas|de\s+esos|de\s+esas|de\s+ese|de\s+esa|uno\s+de\s+esos|uno\s+de\s+esas|esto|estos|estas|el\s+mismo|lo\s+mismo)$/i.test(lower);
}

export function isAddOrderAction(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  // Si es un reclamo, corrección, queja o solicitud de ver/solucionar montos o errores, NUNCA es acción de compra
  const isDispute = /\b(cobrando|cobras|cobran|cobro|de\s*mas|caro|error|mal|equivocaste|equivocado|no\s*son|no\s*es\s*el\s*precio|precio\s*mal|cuenta\s*mal|total\s*mal|soluciona|solucioname|arregla|revisa|revisar|por\s*que\s*tanto|reclamo|elimina|quita|borra|borrame|quitame|cancelame|saca|sacame)\b/i.test(lower);
  if (isDispute) return false;

  // Frases genéricas como "deseo agregar algo más" o "quiero agregar algo más" son para consultar el menú, no un ítem
  if (/\b(?:agregar|anadir)\s*(?:algo|otra\s*cosa)\s*m[aá]s\b/i.test(lower)) return false;

  const startsWithAdd = /^(?:agregar|agregame|agregale|agregamelo|agregalo|anadir|sumar|anotar|anotame|anotamelo|anotalo|ponme|ponmelo|dame|damelo)\b/i.test(lower);
  if (!startsWithAdd) {
    const isInformational = /\b(que\s*(trae|incluye|contiene|lleva|viene|es)|cuales\s*son|ingredientes|cuanto\s*(vale|cuesta|sale|es)|precio|costo|saber|conocer|ver|consultar|informacion|info|horario|ubicacion|menu|carta)\b/i.test(lower);
    if (isInformational) return false;
  }

  const hasAddVerb = /\b(agregar|agregame|agregale|agregamelo|agregalo|anadir|anademe|anadelo|anademelo|sumar|sumame|sumalo|sumamelo|anotar|anotame|anotalo|anotamelo|ponme|ponmelo|dame|damelo|sirveme|sirvemelo|traeme|traemelo|mandame|mandamelo|incluyeme|apuntame|apuntamelo|echale|echame)\b/i.test(lower);
  const hasOrderIntent = /\b(quiero|deseo|voy\s*a|me\s*gustaria)\s+(ordenar|pedir|llevar|comprar|un|una|uno|dos|tres|\d+|el|la|este|esta|ese|esa|esos|esas|de\s+esos|de\s+esas|de\s+este|de\s+esta)\b/i.test(lower)
    || isReferentialItemPhrase(lower);

  return hasAddVerb || hasOrderIntent || startsWithAdd;
}


