import { broadcastBookingCreated } from '../../../utils/bookingSyncBus';

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
  if (key) return `🔑 ${(provider || 'IA').toUpperCase()}: ${model ? model.split('/').pop() : 'Cuenta Propia'}`;
  if (model) {
    if (model.includes('gemini')) return '⚡ Gemini (Bot Sincronizado)';
    if (model.includes('gpt')) return '🥈 GPT (Bot Sincronizado)';
    if (model.includes('meta') || model.includes('llama') || model.includes('@cf')) return '🥉 Meta (Bot Sincronizado)';
    if (model.includes('glm')) return '🥇 GLM 5 (Bot Sincronizado)';
    return `🤖 ${model.split('/').pop() || model} (Sincronizado)`;
  }
  return '🤖 Motor Oficial Sincronizado';
};

export const getLiveTenantConfig = (tenant: any) => {
  if (!tenant) return {};
  return {
    id: tenant.id,
    slug: tenant.slug,
    name: tenant.name || '',
    bot_name: tenant.bot_name || 'Asesor Virtual',
    system_prompt: tenant.system_prompt || '',
    operational_rules: tenant.operational_rules || '',
    sales_flow_rules: tenant.sales_flow_rules || '',
    tone_of_voice: tenant.tone_of_voice || '',
    business_type: tenant.business_type || 'tienda',
    custom_llm_key: tenant.custom_llm_key || null,
    currency: tenant.currency || 'USD',
    message_delivery_mode: tenant.message_delivery_mode || 'moderate',
    response_delay_sec: tenant.response_delay_sec !== undefined ? Number(tenant.response_delay_sec) : 3,
    bot_response_speed_sec: tenant.bot_response_speed_sec !== undefined ? Number(tenant.bot_response_speed_sec) : 0,
    welcome_message: tenant.welcome_message || ''
  };
};

export const getAdaptivePersonas = (tenant: any) => {
  const bType = tenant?.business_type || 'tienda';
  const bName = tenant?.name || 'la empresa';

  if (bType === 'restaurante') {
    return [
      { label: '🍽️ Menú & Precios', text: 'Hola, qué platillos o combos tienen disponibles hoy y qué precios manejan?' },
      { label: '🛵 Entrega Express', text: 'Hola, deseo hacer un pedido para entrega a domicilio express' },
      { label: '⭐ Recomendación', text: 'Cuál es la especialidad de la casa o lo más recomendado?' },
      { label: '⏰ Horarios', text: 'A qué hora abren y cuál es su horario de atención hoy?' },
    ];
  }

  if (bType === 'servicios' || tenant?.name === 'GeoSoft') {
    return [
      { label: '💻 Servicios & Precios', text: 'Hola, qué servicios ofrecen y qué precios oficiales manejan?' },
      { label: '🚀 Plataforma SaaS / Web', text: 'Quiero desarrollar una plataforma web o sistema SaaS a medida' },
      { label: '📅 Agendar Reunión', text: 'Hola, me gustaría agendar una reunión o asesoría técnica por videollamada' },
      { label: '🛡️ Garantía & Tiempos', text: 'Qué tiempos de entrega manejan y qué garantía ofrecen para el desarrollo?' },
    ];
  }

  return [
    { label: '🛍️ Catálogo', text: `Hola, qué productos tienen disponibles en ${bName} y cuáles son sus precios?` },
    { label: '💳 Medios de Pago', text: 'Qué formas de pago aceptan y cómo puedo concretar la compra?' },
    { label: '📦 Envíos', text: 'Hacen envíos a todo el país y cuánto tarda en llegar?' },
    { label: '🙋 Asesor Humano', text: 'Hola, me gustaría conversar con un asesor comercial para una consulta personalizada' },
  ];
};

export const PERSONAS = getAdaptivePersonas(null);

export const saveSandboxBooking = (cardPayload: any, tenant: any, tenantId?: string, tenantSlug?: string) => {
  const tId = tenant?.id || tenantId || 'ten_geosoft_prod';
  const tSlug = tenant?.slug || tenantSlug || 'geosoft';
  const targetId = tId === 'geosoft' ? 'ten_geosoft_prod' : tId;
  const newId = cardPayload.id || ('apt_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6));
  const apt = {
    id: newId,
    clientName: cardPayload.customerName || cardPayload.clientName || 'Cliente',
    serviceName: cardPayload.service || cardPayload.serviceName || (tenant?.name === 'GeoSoft' ? 'Desarrollo Web & SaaS' : 'Servicio Profesional'),
    date: cardPayload.date || new Date().toISOString().slice(0, 10),
    dateKey: cardPayload.date || new Date().toISOString().slice(0, 10),
    displayDate: cardPayload.date || new Date().toISOString().slice(0, 10),
    time: cardPayload.time || cardPayload.timeSlot || '10:00 AM',
    status: 'confirmed' as const,
    channel: 'web' as const,
    phone: cardPayload.customerPhone || cardPayload.phone || '',
    email: cardPayload.customerEmail || cardPayload.email || '',
    notes: 'Agendado en Probador / Live Lab',
    price: Number(cardPayload.price) || (tenant?.name === 'GeoSoft' ? 1200 : 0)
  };

  if (typeof window !== 'undefined') {
    const syncKeys = Array.from(new Set([targetId, tId, tSlug, tenantSlug, tenantId, 'geosoft', 'ten_geosoft_prod'].filter(Boolean)));
    syncKeys.forEach(k => {
      try {
        const sk = `clikchat_bookings_${k}`;
        const cur = JSON.parse(localStorage.getItem(sk) || '[]');
        const filtered = cur.filter((x: any) => x.id !== apt.id);
        localStorage.setItem(sk, JSON.stringify([apt, ...filtered]));
      } catch (e) {}
    });
  }

  fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: apt.id,
      tenantId: targetId,
      tenant_id: targetId,
      tenantSlug: tSlug,
      tenant_slug: tSlug,
      customerName: apt.clientName,
      customer_name: apt.clientName,
      customerEmail: apt.email,
      customer_email: apt.email,
      customerPhone: apt.phone,
      customer_phone: apt.phone,
      serviceId: 'srv_gen',
      service_id: 'srv_gen',
      serviceName: apt.serviceName,
      service_name: apt.serviceName,
      bookingDate: apt.date,
      booking_date: apt.date,
      bookingTime: apt.time,
      booking_time: apt.time,
      status: 'confirmed',
      price: apt.price,
      currency: tenant?.currency || 'USD',
      notes: apt.notes
    })
  }).catch(() => {});

  broadcastBookingCreated(tSlug, {
    id: apt.id,
    clientName: apt.clientName,
    serviceName: apt.serviceName,
    date: apt.displayDate,
    time: apt.time,
    price: apt.price
  });
};
