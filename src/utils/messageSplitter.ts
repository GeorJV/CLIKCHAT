export type DeliveryMode = 'micro' | 'interleaved' | 'single';

/**
 * Erradica signos de apertura '¿' y '¡' para un estilo de chat de WhatsApp 100% humanizado
 */
export function cleanHumanizedText(rawText: string): string {
  if (!rawText || typeof rawText !== 'string') return '';
  return rawText.replace(/[¿¡]/g, '');
}

/**
 * Divide el mensaje del asistente en múltiples burbujas según el modo de envío configurado:
 * - 'micro': Mensaje por mensaje (oraciones/micro-burbujas como chatea una persona real)
 * - 'interleaved': Mensaje intercalado (cada ~2 renglones en bloques moderados equilibrados)
 * - 'single': Mensaje único tradicional en una sola burbuja completa
 */
export function splitMessageByDeliveryMode(
  rawText: string,
  mode: DeliveryMode = 'interleaved'
): string[] {
  const text = cleanHumanizedText(rawText).trim();
  if (!text) return [];

  // Modo Único: una sola burbuja completa
  if (mode === 'single') {
    return [text];
  }

  // Si contiene un ticket/comanda formateado con caracteres de caja (╔, ║, ╚), mantenerlo protegido
  const hasBoxTicket = /[╔║╠╚═]/.test(text);
  if (hasBoxTicket) {
    // Si hay caja ASCII, separar el texto previo, la caja y el texto posterior
    const parts = text.split(/(╔[\s\S]*?╚═*╝)/g).filter(p => p.trim().length > 0);
    if (parts.length > 1) {
      const result: string[] = [];
      for (const p of parts) {
        if (/^[╔║╠╚═]/.test(p.trim())) {
          result.push(p.trim());
        } else {
          result.push(...splitMessageByDeliveryMode(p, mode));
        }
      }
      return result.length > 0 ? result : [text];
    }
  }

  // Dividir por párrafos naturales (\n\n o \n)
  const rawParagraphs = text.split(/\n+/).map(p => p.trim()).filter(Boolean);

  if (mode === 'micro') {
    const microBubbles: string[] = [];

    for (const para of rawParagraphs) {
      // Si es viñeta de menú/producto o lista, mantener el ítem como una burbuja completa
      if (/^(?:[-*•]|\d+[.)])\s+/.test(para)) {
        microBubbles.push(para);
        continue;
      }

      // Si el párrafo es corto (< 15 palabras), enviarlo como una micro-burbuja directa
      const words = para.split(/\s+/);
      if (words.length <= 14) {
        microBubbles.push(para);
        continue;
      }

      // Si es más largo, dividir por oraciones naturales (. ? !)
      const sentences = para.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 0);
      let currentAcc = '';

      for (const sent of sentences) {
        if (!currentAcc) {
          currentAcc = sent;
        } else if ((currentAcc + ' ' + sent).split(/\s+/).length <= 14) {
          currentAcc += ' ' + sent;
        } else {
          microBubbles.push(currentAcc.trim());
          currentAcc = sent;
        }
      }
      if (currentAcc.trim()) {
        microBubbles.push(currentAcc.trim());
      }
    }

    return microBubbles.length > 0 ? microBubbles : [text];
  }

  // Modo Intercalado / Moderado: Agrupar cada ~2 renglones o ideas medianas (~25-45 palabras)
  const interleavedBubbles: string[] = [];
  let buffer = '';

  for (const para of rawParagraphs) {
    const isBullet = /^(?:[-*•]|\d+[.)])\s+/.test(para);

    if (isBullet) {
      // Las viñetas de platillos o precios se acumulan con el buffer si es pequeño
      if (buffer && buffer.split(/\s+/).length >= 35) {
        interleavedBubbles.push(buffer.trim());
        buffer = para;
      } else {
        buffer = buffer ? `${buffer}\n${para}` : para;
      }
      continue;
    }

    if (!buffer) {
      buffer = para;
    } else {
      const combinedWordCount = `${buffer}\n\n${para}`.split(/\s+/).length;
      if (combinedWordCount <= 38) {
        buffer = `${buffer}\n\n${para}`;
      } else {
        interleavedBubbles.push(buffer.trim());
        buffer = para;
      }
    }
  }

  if (buffer.trim()) {
    interleavedBubbles.push(buffer.trim());
  }

  return interleavedBubbles.length > 0 ? interleavedBubbles : [text];
}
