import { SandboxMsg } from './sandboxConstants';

export interface LabSessionRecord {
  id: string;
  seq: string;
  tenantSlug: string;
  createdAt: string;
  updatedAt: string;
  messages: SandboxMsg[];
  lastSnippet?: string;
  modelLabel?: string;
}

const SEQ_STORAGE_KEY = 'clikchat_lab_seq_counter';

export function getNextLabSequence(): { code: string; num: number } {
  try {
    const cur = parseInt(localStorage.getItem(SEQ_STORAGE_KEY) || '1000', 10);
    const next = isNaN(cur) || cur < 1000 ? 1001 : cur + 1;
    localStorage.setItem(SEQ_STORAGE_KEY, String(next));
    return { code: `LAB-${next}`, num: next };
  } catch {
    const fallback = 1000 + Math.floor(Math.random() * 900);
    return { code: `LAB-${fallback}`, num: fallback };
  }
}

export function getCurrentLabSequence(): string {
  try {
    const cur = parseInt(localStorage.getItem(SEQ_STORAGE_KEY) || '1001', 10);
    return `LAB-${cur}`;
  } catch {
    return 'LAB-1001';
  }
}

export function getLabSessions(tenantSlug: string): LabSessionRecord[] {
  try {
    const k = `clikchat_lab_history_${tenantSlug || 'geosoft'}`;
    const raw = localStorage.getItem(k);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLabSessionRecord(tenantSlug: string, record: LabSessionRecord) {
  try {
    const k = `clikchat_lab_history_${tenantSlug || 'geosoft'}`;
    const list = getLabSessions(tenantSlug);
    const idx = list.findIndex(r => r.id === record.id || r.seq === record.seq);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...record, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(record);
    }
    if (list.length > 50) list.pop();
    localStorage.setItem(k, JSON.stringify(list));
  } catch {}
}

export function deleteLabSessionRecord(tenantSlug: string, id: string) {
  try {
    const k = `clikchat_lab_history_${tenantSlug || 'geosoft'}`;
    const list = getLabSessions(tenantSlug).filter(r => r.id !== id);
    localStorage.setItem(k, JSON.stringify(list));
  } catch {}
}

export function formatLabChatForClipboard(record: {
  seq: string;
  botName: string;
  tenantName: string;
  messages: SandboxMsg[];
  sessionId?: string;
}): string {
  const dateStr = new Date().toLocaleString();
  const header = [
    `════════════════════════════════════════════════════════════`,
    `🧪 CONVERSACIÓN MODO LAB — ${record.seq}`,
    `Negocio: ${record.tenantName}`,
    `Bot Asesor: ${record.botName}`,
    `ID Sesión: ${record.sessionId || 'N/A'}`,
    `Fecha de exportación: ${dateStr}`,
    `════════════════════════════════════════════════════════════\n`
  ].join('\n');

  const lines = record.messages.map((m) => {
    const isUser = m.sender === 'user';
    const tag = isUser ? '👤 [CLIENTE / USUARIO]' : `🤖 [${record.botName.toUpperCase()}]`;
    const meta = !isUser
      ? ` (${m.modelUsed || 'Modelo Sincronizado'} | ${m.rag || 'RAG'} | Calidad ${m.score || 95}/100${m.fallbackUsed ? ' | 🛡️ Contingencia' : ''})`
      : '';
    return `${tag}${meta}:\n${m.text}\n`;
  });

  return `${header}${lines.join('\n')}\n════════════════════════════════════════════════════════════\n`;
}
