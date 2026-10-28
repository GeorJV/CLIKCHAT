import { ServiceBookingData } from '../types/serviceChat';

export function parseBookingCard(
  text: string,
  historyOrContext?: Array<{ sender: string; content?: string; message?: string }> | { customerName?: string; customerPhone?: string; customerEmail?: string }
): { cleanContent: string; bookingData: ServiceBookingData | null } {
  if (!text) return { cleanContent: '', bookingData: null };

  const storedName = typeof window !== 'undefined' ? (localStorage.getItem('clikchat_cust_name') || localStorage.getItem('clikchat_user_name') || '') : '';
  const storedPhone = typeof window !== 'undefined' ? (localStorage.getItem('clikchat_cust_phone') || localStorage.getItem('clikchat_user_phone') || '') : '';

  let contextName = storedName;
  let contextPhone = storedPhone;
  let contextEmail = '';

  if (historyOrContext) {
    if (Array.isArray(historyOrContext)) {
      for (let i = historyOrContext.length - 1; i >= 0; i--) {
        const item = historyOrContext[i];
        if (item.sender === 'user') {
          const uTxt = (item.content || item.message || '').trim();
          if (!contextPhone) {
            const pM = uTxt.match(/(?:\+?506[\s-]?)?[2678]\d{3}[\s-]?\d{4}|\+?\d{1,3}[\s-]?\d{3,4}[\s-]?\d{4}|\b\d{8,12}\b/);
            if (pM && !pM[0].includes('72935612') && !pM[0].includes('7293-5612')) contextPhone = pM[0].trim();
          }
          if (!contextName) {
            const nM = uTxt.match(/(?:me\s+llamo|mi\s+nombre\s+es|soy|nombre:\s*)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ]{2,}(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]{2,})?)/i);
            if (nM && !/^cliente$/i.test(nM[1].trim())) contextName = nM[1].trim();
          }
          if (!contextEmail) {
            const eM = uTxt.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/i);
            if (eM) contextEmail = eM[0].trim();
          }
        }
      }
    } else {
      if (historyOrContext.customerName) contextName = historyOrContext.customerName;
      if (historyOrContext.customerPhone) contextPhone = historyOrContext.customerPhone;
      if (historyOrContext.customerEmail) contextEmail = historyOrContext.customerEmail;
    }
  }

  const cardMatch = text.match(/\[BOOKING_CARD:\s*(\{[\s\S]*?\})\s*\]/);
  if (cardMatch) {
    try {
      const p = JSON.parse(cardMatch[1]);
      const rawName = (p.customerName || p.name || '').trim();
      const resolvedName = (rawName && !/^cliente$/i.test(rawName)) ? rawName : (contextName || '');
      const rawPhone = (p.customerPhone || p.phone || '').trim();
      const isBizPhone = rawPhone.includes('72935612') || rawPhone.includes('7293-5612');
      const resolvedPhone = (!rawPhone || isBizPhone) ? (contextPhone || '') : rawPhone;

      return {
        cleanContent: text.replace(/\[BOOKING_CARD:\s*\{[\s\S]*?\}\s*\]/g, '').trim(),
        bookingData: {
          service: {
            id: p.serviceId || 'srv_selected',
            title: p.service || p.serviceTitle || 'Desarrollo Web & SaaS',
            price: Number(p.price) || 1200,
            currency: p.currency || 'USD',
            image: '',
            serviceModality: p.modality || 'online'
          },
          date: p.date || 'Próxima fecha',
          timeSlot: p.time || p.timeSlot || '10:00 AM',
          customerName: resolvedName,
          customerEmail: p.customerEmail || p.email || contextEmail || '',
          customerPhone: resolvedPhone,
          notes: p.notes || ''
        }
      };
    } catch {}
  }

  if (/registrado\s+tu\s+(?:nombre|informaci[oó]n|cita)|cita\s+del|cita\s+para\s+el|qued[oó]\s+agendad|reserva\s+confirmad/i.test(text || '')) {
    const dM = text.match(/(?:el\s+)?(lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo|[0-9]{1,2}\s+de\s+[a-záéíóú]+|[0-9]{4}-[0-9]{2}-[0-9]{2})/i);
    const tM = text.match(/([0-9]{1,2}(?::[0-9]{2})?\s*(?:am|pm|AM|PM)|[0-9]{1,2}:[0-9]{2})/i);
    const nM = text.match(/(?:Genial|Excelente|Perfecto|Gracias|Hola),?\s*([A-Za-zÁÉÍÓÚáéíóúñ]{2,}(?:\s+[A-Za-zÁÉÍÓÚáéíóúñ]{2,})?)/i);
    const eM = text.match(/\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/);
    const pM = text.match(/(\+?[0-9\s\-]{8,16})/);

    let extractedNameFromText = nM && !/^cliente$/i.test(nM[1].trim()) ? nM[1].trim() : '';
    let extractedPhoneFromText = pM && !pM[0].includes('72935612') && !pM[0].includes('7293-5612') ? pM[0].trim() : '';

    return {
      cleanContent: text,
      bookingData: {
        service: { id: 'srv_selected', title: 'Desarrollo Web & SaaS', price: 1200, currency: 'USD', image: '', serviceModality: 'online' },
        date: dM ? dM[0].replace(/^el\s+/i, '').trim() : 'Próxima fecha',
        timeSlot: tM ? tM[0].trim() : '10:00 AM',
        customerName: extractedNameFromText || contextName || '',
        customerEmail: (eM ? eM[1].trim() : '') || contextEmail || '',
        customerPhone: extractedPhoneFromText || contextPhone || '',
        notes: ''
      }
    };
  }
  return { cleanContent: text || '', bookingData: null };
}
