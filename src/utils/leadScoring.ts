import { CrmLead } from '../types/crm';

export type LeadTemperature = 'hot' | 'warm' | 'cold';

export interface LeadScoreResult {
  score: number;
  level: LeadTemperature;
  label: string;
  emoji: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  barGradient: string;
  reasons: string[];
}

export function computeLeadScore(lead: CrmLead): LeadScoreResult {
  let score = 0;
  const reasons: string[] = [];

  // 1. Puntos por etapa del embudo (base comercial)
  switch (lead.stage) {
    case 'won':
      score += 100;
      reasons.push('Venta/Cita cerrada (+100)');
      break;
    case 'negotiation':
      score += 85;
      reasons.push('Esperando pago / Negociación (+85)');
      break;
    case 'proposal':
      score += 70;
      reasons.push('Comanda o propuesta activa (+70)');
      break;
    case 'qualifying':
      score += 45;
      reasons.push('En calificación de necesidades (+45)');
      break;
    case 'lost':
      score += 10;
      reasons.push('Trato perdido (+10)');
      break;
    case 'lead':
    default:
      score += 25;
      reasons.push('Lead inicial (+25)');
      break;
  }

  // Si ya se ganó, el puntaje es 100
  if (lead.stage === 'won') {
    return formatResult(100, reasons);
  }

  // 2. Información de contacto verificada
  const hasPhone = Boolean(lead.phone && lead.phone.replace(/[^0-9]/g, '').length >= 7);
  if (hasPhone) {
    score += 10;
    reasons.push('Teléfono validado (+10)');
  }

  const hasEmail = Boolean(lead.email && lead.email.includes('@'));
  if (hasEmail) {
    score += 5;
    reasons.push('Email capturado (+5)');
  }

  // 3. Monto de oportunidad
  if (lead.deal_value > 0) {
    score += 10;
    reasons.push(`Interés de compra $${lead.deal_value} (+10)`);
  }

  // 4. Notas o enriquecimiento cualitativo
  if (lead.notes && lead.notes.trim().length > 5) {
    score += 5;
    reasons.push('Notas de contexto (+5)');
  }

  // 5. Canal preferencial WhatsApp (+5)
  if (lead.channel === 'whatsapp') {
    score += 5;
    reasons.push('Canal directo WhatsApp (+5)');
  }

  // Clamp entre 0 y 100
  const finalScore = Math.min(100, Math.max(0, score));
  return formatResult(finalScore, reasons);
}

function formatResult(score: number, reasons: string[]): LeadScoreResult {
  if (score >= 70) {
    return {
      score,
      level: 'hot',
      label: 'Caliente',
      emoji: '🔥',
      badgeBg: 'bg-rose-50',
      badgeText: 'text-rose-700',
      badgeBorder: 'border-rose-200',
      barGradient: 'from-amber-500 via-rose-500 to-red-600',
      reasons,
    };
  }

  if (score >= 40) {
    return {
      score,
      level: 'warm',
      label: 'Tibio',
      emoji: '☕',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-800',
      badgeBorder: 'border-amber-200',
      barGradient: 'from-yellow-400 to-amber-500',
      reasons,
    };
  }

  return {
    score,
    level: 'cold',
    label: 'Frío',
    emoji: '❄️',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
    badgeBorder: 'border-sky-200',
    barGradient: 'from-slate-300 via-sky-400 to-blue-500',
    reasons,
  };
}
