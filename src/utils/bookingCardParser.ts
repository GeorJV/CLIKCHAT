import { ServiceBookingData } from '../types/serviceChat';

export function parseBookingCard(text: string): { cleanContent: string; bookingData: ServiceBookingData | null } {
  if (!text) return { cleanContent: '', bookingData: null };
  const cardMatch = text.match(/\[BOOKING_CARD:\s*(\{[\s\S]*?\})\s*\]/);
  if (cardMatch) {
    try {
      const p = JSON.parse(cardMatch[1]);
      return {
        cleanContent: text.replace(/\[BOOKING_CARD:\s*\{[\s\S]*?\}\s*\]/g, '').trim(),
        bookingData: {
          service: { id: p.serviceId || 'srv_selected', title: p.service || p.serviceTitle || 'Desarrollo Web & SaaS', price: Number(p.price) || 1200, currency: p.currency || 'USD', image: '', serviceModality: p.modality || 'online' },
          date: p.date || '25 de Octubre',
          timeSlot: p.time || p.timeSlot || '10:00 AM',
          customerName: p.customerName || p.name || 'Cliente',
          customerEmail: p.customerEmail || p.email || '',
          customerPhone: p.customerPhone || p.phone || '',
          notes: p.notes || ''
        }
      };
    } catch {}
  }
  if (/registrado\s+tu\s+(?:nombre|informaci[oó]n|cita)|cita\s+del|cita\s+para\s+el|qued[oó]\s+agendad|reserva\s+confirmad/i.test(text || '')) {
    const dM = text.match(/(?:el\s+)?(lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo|[0-9]{1,2}\s+de\s+[a-záéíóú]+|[0-9]{4}-[0-9]{2}-[0-9]{2})/i);
    const tM = text.match(/([0-9]{1,2}(?::[0-9]{2})?\s*(?:am|pm|AM|PM)|[0-9]{1,2}:[0-9]{2})/i);
    const nM = text.match(/(?:Genial|Excelente|Perfecto|Gracias|Hola),?\s*([A-Za-zÁÉÍÓÚáéíóúñ]+)/i);
    const eM = text.match(/\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/);
    const pM = text.match(/(\+?[0-9\s\-]{8,16})/);
    return {
      cleanContent: text,
      bookingData: { service: { id: 'srv_selected', title: 'Desarrollo Web & SaaS', price: 1200, currency: 'USD', image: '', serviceModality: 'online' }, date: dM ? dM[0].replace(/^el\s+/i, '').trim() : '25 de Octubre', timeSlot: tM ? tM[0].trim() : '10:00 AM', customerName: nM ? nM[1].trim() : 'Cliente', customerEmail: eM ? eM[1].trim() : '', customerPhone: pM ? pM[0].trim() : '+506 7293-5612', notes: '' }
    };
  }
  return { cleanContent: text || '', bookingData: null };
}
