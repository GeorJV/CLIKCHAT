export type DeliveryMode = 'micro' | 'moderate' | 'intermediate' | 'single' | 'interleaved';

/**
 * Erradica signos de apertura '¿' y '¡' para un estilo de chat de WhatsApp 100% humanizado
 */
export function cleanHumanizedText(rawText: string): string {
  if (!rawText || typeof rawText !== 'string') return '';
  return rawText.replace(/[¿¡]/g, '');
}

/**
 * Divide el mensaje del asistente en múltiples burbujas según el modo de envío configurado:
 * - 'micro': Microburbujas oración por oración (mensajes breves rápidos)
 * - 'moderate': Moderado (cada ~2 renglones en bloques breves)
 * - 'intermediate': Intermedio (bloques equilibrados de ~30-45 palabras)
 * - 'single': Bloque completo en una sola burbuja unificada
 */
export function splitMessageByDeliveryMode(
  rawText: string,
  mode: DeliveryMode = 'moderate'
): string[] {
  const text = cleanHumanizedText(rawText).trim();
  if (!text) return [];

  // 1. Bloque Completo: una sola burbuja
  if (mode === 'single') {
    return [text];
  }

  // Protección de tickets / comandas formateadas con cajas ASCII
  if (/[╔║╠╚═]/.test(text)) {
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

  const rawParagraphs = text.split(/\n+/).map(p => p.trim()).filter(Boolean);

  // 2. Modo Microburbujas: oración por oración (máx 10-12 palabras)
  if (mode === 'micro') {
    const microBubbles: string[] = [];
    for (const para of rawParagraphs) {
      if (/^(?:[-*•]|\d+[.)])\s+/.test(para)) {
        microBubbles.push(para);
        continue;
      }
      const sentences = para.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 0);
      let current = '';
      for (const s of sentences) {
        if (!current) {
          current = s;
        } else if ((current + ' ' + s).split(/\s+/).length <= 11) {
          current += ' ' + s;
        } else {
          microBubbles.push(current.trim());
          current = s;
        }
      }
      if (current.trim()) microBubbles.push(current.trim());
    }
    return microBubbles.length > 0 ? microBubbles : [text];
  }

  // 3. Modo Moderado (2 renglones / interleaved): ~14 a 22 palabras por burbuja
  const isModerate = mode === 'moderate' || mode === 'interleaved';
  const targetWords = isModerate ? 20 : 42; // 20 para moderado, 42 para intermedio

  const bubbles: string[] = [];
  let buffer = '';

  for (const para of rawParagraphs) {
    const isBullet = /^(?:[-*•]|\d+[.)])\s+/.test(para);
    if (isBullet) {
      if (buffer && buffer.split(/\s+/).length >= (isModerate ? 16 : 32)) {
        bubbles.push(buffer.trim());
        buffer = para;
      } else {
        buffer = buffer ? `${buffer}\n${para}` : para;
      }
      continue;
    }

    if (!buffer) {
      buffer = para;
    } else {
      const combinedCount = `${buffer}\n\n${para}`.split(/\s+/).length;
      if (combinedCount <= targetWords) {
        buffer = `${buffer}\n\n${para}`;
      } else {
        bubbles.push(buffer.trim());
        buffer = para;
      }
    }
  }

  if (buffer.trim()) bubbles.push(buffer.trim());
  return bubbles.length > 0 ? bubbles : [text];
}

export interface StaggeredMessageOptions<T> {
  fullText: string;
  mode?: DeliveryMode;
  responseDelaySec?: number;
  createMessage: (bubble: string, isLast: boolean, index: number) => T;
  onDeliver: (msg: T) => void;
  onSetLoading: (loading: boolean) => void;
}

/**
 * Entrega una respuesta progresiva burbuja por burbuja con retraso realista (1s a 2s)
 * e indicador de escritura (typing) activo entre cada mensaje para máxima fluidez.
 */
export async function deliverStaggeredBubbles<T>({
  fullText,
  mode = 'moderate',
  responseDelaySec = 1,
  createMessage,
  onDeliver,
  onSetLoading,
}: StaggeredMessageOptions<T>): Promise<void> {
  const bubbles = splitMessageByDeliveryMode(fullText, mode);
  if (bubbles.length <= 1) {
    onDeliver(createMessage(fullText, true, 0));
    onSetLoading(false);
    return;
  }

  // Entrega la primera burbuja
  onDeliver(createMessage(bubbles[0], false, 0));

  // Retraso entre burbujas (entre 1s y 2s según cadencia para fluidez orgánica)
  const interBubbleDelayMs = Math.min(Math.max((responseDelaySec ?? 1.2) * 1000, 1000), 2000);

  for (let i = 1; i < bubbles.length; i++) {
    onSetLoading(true);
    await new Promise((r) => setTimeout(r, interBubbleDelayMs));
    const isLast = i === bubbles.length - 1;
    onDeliver(createMessage(bubbles[i], isLast, i));
  }

  onSetLoading(false);
}
