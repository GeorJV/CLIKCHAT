import { ConversationSession } from './types';

export function getVisitorDisplayName(session?: Partial<ConversationSession> | null): string {
  if (!session) return 'Visitante Web';
  if (session.user_name && session.user_name.trim()) {
    return session.user_name.trim();
  }
  if (session.user_phone && session.user_phone.trim()) {
    return session.user_phone.trim();
  }
  if (session.user_email && session.user_email.trim()) {
    return session.user_email.trim();
  }
  const cleanId = (session.id || '').replace(/[^a-zA-Z0-9]/g, '');
  const shortCode = cleanId.length > 5 ? cleanId.slice(-5).toUpperCase() : (cleanId || 'LIVE');
  return `Visitante #${shortCode}`;
}

export function formatConversationTime(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}
