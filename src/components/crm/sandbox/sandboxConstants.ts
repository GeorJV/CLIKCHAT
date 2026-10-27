export interface SandboxMsg {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  rag?: string;
  score?: number;
  isGolden?: boolean;
  modelUsed?: string;
  fallbackUsed?: boolean;
}

export const PERSONAS = [
  { label: '🛍️ Decidido', text: 'Hola, quiero comprar ya mismo. Cómo puedo pagar y cuándo me lo envían?' },
  { label: '🏷️ Precios', text: 'Hola, cuánto cuesta lo más vendido y qué ofertas tienen hoy?' },
  { label: '😡 Molesto', text: 'Llevo esperando mi pedido y nadie me contesta, exijo una solución.' },
  { label: '🙋 Pide Humano', text: 'Hola, no quiero hablar con un bot, pásame con un asesor real por favor.' },
  { label: '❓ Fuera de Menú', text: 'Ustedes también venden repuestos de autos y hacen envíos a México?' },
  { label: '📱 Informal', text: 'ke onda bro si benden comida todavia o ya cerraron?' },
];

export const getBotConfig = (tenant: any) => {
  let key = ''; let model = ''; let provider = '';
  if (tenant?.custom_llm_key && tenant.custom_llm_key.startsWith('{')) {
    try {
      const p = JSON.parse(tenant.custom_llm_key);
      key = p.key || ''; model = p.model || ''; provider = p.provider || '';
    } catch {}
  }
  if (!model && tenant?.custom_ai_config) {
    key = tenant.custom_ai_config.apiKey || key;
    model = tenant.custom_ai_config.model || '';
    provider = tenant.custom_ai_config.provider || provider;
  }
  return { key, model, provider };
};

export const getBotModelLabel = (tenant: any) => {
  const { key, model, provider } = getBotConfig(tenant);
  if (key) return `🔑 ${(provider || 'IA').toUpperCase()}: ${model ? model.split('/').pop() : 'Propia'}`;
  if (model) {
    if (model.includes('gemini')) return '⚡ Gemini (Bot)';
    if (model.includes('gpt')) return '🥈 GPT (Bot)';
    if (model.includes('meta') || model.includes('llama') || model.includes('@cf')) return '🥉 Meta (Bot)';
    if (model.includes('glm')) return '🥇 GLM 5 (Bot)';
    return `🤖 ${model.split('/').pop() || model} (Bot)`;
  }
  return '🤖 Motor del Bot (Sincronizado)';
};
