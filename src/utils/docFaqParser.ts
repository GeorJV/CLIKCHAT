export interface ExtractedFaq {
  question: string;
  answer: string;
  category: string;
  selected?: boolean;
}

export class DocFaqParser {
  /**
   * Extrae texto plano de archivos .txt, .md, .json, .docx y .pdf en el navegador
   */
  static async extractTextFromFile(file: File): Promise<string> {
    if (!file) return '';
    const name = file.name.toLowerCase();

    // Archivos de texto plano directo
    if (name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.json') || name.endsWith('.csv')) {
      return await file.text();
    }

    // Archivos DOCX (Word XML <w:t> extraction)
    if (name.endsWith('.docx') || name.endsWith('.doc')) {
      return await this.extractFromDocx(file);
    }

    // Archivos PDF (Stream Tj / TJ extraction)
    if (name.endsWith('.pdf') || file.type === 'application/pdf') {
      return await this.extractFromPdf(file);
    }

    // Fallback como texto
    return await file.text();
  }

  private static async extractFromDocx(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const raw = decoder.decode(buffer);
    const matches = raw.match(/<w:t[^>]*>([^<]+)<\/w:t>/gi);
    if (matches && matches.length > 0) {
      return matches
        .map(m => m.replace(/<w:t[^>]*>/i, '').replace(/<\/w:t>/i, ''))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    return decoder.decode(buffer).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  private static async extractFromPdf(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const decoder = new TextDecoder('latin1');
    const raw = decoder.decode(buffer);

    let text = '';
    // Operadores de texto Tj
    const tjMatches = raw.match(/\(([^)]+)\)\s*Tj/g);
    if (tjMatches) {
      text = tjMatches.map(m => m.replace(/\(([^)]+)\)\s*Tj/, '$1')).join(' ');
    }

    // Matrices TJ
    const arrayMatches = raw.match(/\[([^\]]+)\]\s*TJ/g);
    if (arrayMatches) {
      const arrayText = arrayMatches.map(m => {
        const sub = m.match(/\(([^)]+)\)/g);
        return sub ? sub.map(s => s.slice(1, -1)).join('') : '';
      }).join(' ');
      text += ' ' + arrayText;
    }

    return text
      .replace(/\\([()\\])/g, '$1')
      .replace(/\\r/g, '')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Parsea pares de Pregunta y Respuesta desde el texto plano
   */
  static parseFaqsFromText(text: string): ExtractedFaq[] {
    if (!text || text.trim().length === 0) return [];
    const faqs: ExtractedFaq[] = [];

    // Intento 1: formato JSON
    if (text.trim().startsWith('[') && text.trim().endsWith(']')) {
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          parsed.forEach((item: any) => {
            if (item.question && item.answer) {
              faqs.push({
                question: String(item.question).trim(),
                answer: String(item.answer).trim(),
                category: item.category || this.detectCategory(item.question),
                selected: true
              });
            }
          });
          if (faqs.length > 0) return faqs;
        }
      } catch (_) {}
    }

    // Intento 2: Detección por patrones P: / R: o Pregunta: / Respuesta:
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    let currentQ = '';
    let currentA = '';

    for (const line of lines) {
      const qMatch = line.match(/^(?:Pregunta|P|Q|Duda|Consulta|\d+[\.\)])\s*[\:\-\.]?\s*(.+)/i);
      const aMatch = line.match(/^(?:Respuesta|R|A|Solución)\s*[\:\-\.]?\s*(.+)/i);

      if (qMatch) {
        if (currentQ && currentA) {
          faqs.push({ question: currentQ, answer: currentA, category: this.detectCategory(currentQ), selected: true });
          currentA = '';
        }
        currentQ = qMatch[1].trim();
      } else if (aMatch) {
        currentA = aMatch[1].trim();
      } else if (currentQ && !currentA) {
        currentQ += ' ' + line;
      } else if (currentA) {
        currentA += ' ' + line;
      }
    }

    if (currentQ && currentA) {
      faqs.push({ question: currentQ, answer: currentA, category: this.detectCategory(currentQ), selected: true });
    }

    // Intento 3: Si no hubo prefijos P/R pero hay oraciones interrogativas (¿...?)
    if (faqs.length === 0) {
      const questionBlocks = text.split(/(¿[^?]+\?)/g).filter(Boolean);
      for (let i = 0; i < questionBlocks.length; i += 2) {
        const q = questionBlocks[i]?.trim();
        const a = questionBlocks[i + 1]?.trim();
        if (q && a && q.startsWith('¿') && q.endsWith('?') && a.length > 5) {
          faqs.push({ question: q, answer: a, category: this.detectCategory(q), selected: true });
        }
      }
    }

    return faqs;
  }

  private static detectCategory(q: string): string {
    const lower = q.toLowerCase();
    if (lower.includes('pago') || lower.includes('tarjeta') || lower.includes('sinpe') || lower.includes('precio') || lower.includes('costo')) return 'pagos';
    if (lower.includes('envio') || lower.includes('entrega') || lower.includes('domicilio') || lower.includes('paquete')) return 'envios';
    if (lower.includes('horario') || lower.includes('hora') || lower.includes('abierto') || lower.includes('atencion')) return 'horarios';
    if (lower.includes('garantia') || lower.includes('devolucion') || lower.includes('cambio')) return 'garantias';
    return 'general';
  }
}
