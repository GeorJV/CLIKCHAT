export interface SetupPayload {
  is_complete: boolean;
  tenant?: {
    name?: string;
    business_type?: 'tienda' | 'servicios' | 'restaurante';
    description?: string;
    phone?: string;
    bot_name?: string;
    welcome_message?: string;
    tone_of_voice?: string;
  };
  products?: Array<{
    name: string;
    price: number;
    category?: string;
    short_description?: string;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
    category?: string;
  }>;
}

export interface InterviewMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
}

export function sanitizeInterviewText(raw: string): string {
  if (!raw) return '';
  let clean = raw.split('[SETUP_PAYLOAD]')[0];
  clean = clean.split('```json')[0];
  clean = clean.replace(/\[SETUP_PAYLOAD\][\s\S]*?(\[\/SETUP_PAYLOAD\]|$)/g, '');
  return clean.trim();
}

export async function sendInterviewMessage(
  messages: InterviewMessage[],
  tenantName?: string,
  businessType?: string
): Promise<{ message: string; payload: SetupPayload | null; provider?: string }> {
  const res = await fetch('/api/onboarding/interview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      tenantName,
      businessType
    })
  });
  if (!res.ok) {
    throw new Error('Error al conectar con el Asistente de Configuración');
  }
  const data = await res.json();
  return {
    message: sanitizeInterviewText(data.message || ''),
    payload: data.payload || null,
    provider: data.provider
  };
}
