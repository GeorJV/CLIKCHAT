import { Tenant } from '../types';

// Configuración oficial por defecto: COMIDA CALLEJERA XL
export const REAL_DEFAULT_TENANT: Tenant = {
  id: 'ten_1790438865714_53ytu', slug: 'comida-callejera-xl', name: 'COMIDA CALLEJERA XL',
  owner_name: 'GEORGE', owner_email: 'ccxl@gmail.com', bot_name: 'Valeria (Mesera Virtual)',
  avatar_url: '', plan: 'pro', monthly_price: 79, status: 'active', primary_color: '#10b981',
  business_type: 'restaurante', currency: 'CRC', business_hours: 'Lunes a Sabado de 8:00 AM a 7:00 PM',
  cta_text: 'Realizar Compra', cta_url: 'https://wa.me/50688888888?text=Hola,%20deseo%20comprar',
  welcome_message: '¡Hola! 👋 Bienvenido a nuestro restaurante. ¿Deseas ver el menú o ordenar tu pedido?',
  system_prompt: 'Eres el asesor comercial de nuestro restaurante. Tu objetivo es tentar el apetito del cliente, guiarlo a completar su orden, y únicamente después de que el usuario ya agregó o solicitó agregar algo a su compra, sugerirle acompañamientos o bebidas.',
  sales_flow_rules: '1. Sugerir acompañamiento o bebida únicamente tras agregar un plato. 2. Preguntar si es para llevar o express. 3. Guiar al total.',
  order_ticket_format: '', tone_of_voice: 'Amigable y Enérgico', response_delay_sec: 1, bot_response_speed_sec: 0,
  phone: '+506 8888-8888', created_at: '2026-09-26T16:07:45Z'
};

// Configuración oficial por defecto: GeoSoft (Servicios Tecnológicos & SaaS)
export const GEOSOFT_DEFAULT_TENANT: Tenant = {
  id: 'ten_geosoft_prod', slug: 'geosoft', name: 'GeoSoft',
  owner_name: 'GeoSoft Tech', owner_email: 'soporte@geosoft.lat', bot_name: 'Agente GeoSoft',
  avatar_url: '', plan: 'pro', monthly_price: 99, status: 'active', primary_color: '#0d5bff',
  business_type: 'servicios', currency: 'USD', business_hours: 'Lunes a Viernes de 8:00 AM a 6:00 PM',
  cta_text: 'Agendar Asesoría', cta_url: 'https://wa.me/50672935612?text=Hola%20GeoSoft,%20deseo%20agendar%20una%20cita',
  welcome_message: '¡Hola! Bienvenido, ¿en qué te podemos ayudar? ¿Cuál es el proyecto en el que te podemos colaborar?',
  system_prompt: 'Eres el Agente GeoSoft oficial de GeoSoft. Asesoras con calidez, empatía y excelencia técnica en desarrollo web, apps móviles e inteligencia artificial. Tu prioridad es comprender la necesidad real del cliente, hacerlo sentir valioso e importante, y orientarlo con honestidad hacia la mejor solución antes de invitarlo a agendar una sesión estratégica paso a paso en el chat.',
  sales_flow_rules: 'PASO 1: Comprende la necesidad. PASO 2: Explica la solución con transparencia. PASO 3: Invita a agendar cita (Nombre/Correo -> WhatsApp -> Día -> Horario). PASO 4: Verifica disponibilidad y emite [BOOKING_CARD: {...}]. Prohibido mandar a WhatsApp por fuera.',
  order_ticket_format: '', tone_of_voice: 'Profesional, Cálido y Tecnológico', response_delay_sec: 1, bot_response_speed_sec: 0,
  phone: '+506 7293-5612', created_at: '2026-10-25T00:00:00Z',
  custom_llm_key: JSON.stringify({ provider: 'cloudflare', model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast', deliveryMode: 'moderate', cadence: 2 })
};

// Plantilla limpia para cuentas nuevas sin configurar
export const CLEAN_EMPTY_TENANT: Tenant = {
  id: '', slug: '', name: '', owner_name: '', owner_email: '', bot_name: '', avatar_url: '',
  plan: 'pro', monthly_price: 49, status: 'active', primary_color: '#10b981', business_type: 'tienda',
  currency: 'CRC', business_hours: '', cta_text: '', cta_url: '', welcome_message: '',
  system_prompt: '', sales_flow_rules: '', order_ticket_format: '', tone_of_voice: 'Profesional y Cortés',
  response_delay_sec: 1, bot_response_speed_sec: 0
};

// Configuración oficial por defecto: Administración Central ClikChat
export const ADMIN_PLATFORM_TENANT: Tenant = {
  id: 'ten_clikchat_admin', slug: 'clikchat-admin', name: 'Administración Central ClikChat',
  owner_name: 'Super Administrador', owner_email: 'admin@clikchat.com', bot_name: 'Concierge Central',
  avatar_url: '', plan: 'enterprise', monthly_price: 0, status: 'active', primary_color: '#6366f1',
  business_type: 'servicios', currency: 'USD', business_hours: '24/7 Soporte Global',
  cta_text: 'Soporte Plataforma', cta_url: 'https://wa.me/50688888888',
  welcome_message: 'Panel administrativo central de la plataforma ClikChat.',
  system_prompt: 'Eres el asistente administrativo de la plataforma ClikChat.',
  sales_flow_rules: '', order_ticket_format: '', tone_of_voice: 'Ejecutivo y Conciso',
  response_delay_sec: 1, bot_response_speed_sec: 0, phone: '+506 8888-8888', created_at: '2026-09-24T00:00:00Z'
};

export const DEFAULT_FALLBACK_TENANT: Tenant = REAL_DEFAULT_TENANT;

export function getCachedTenant(slug: string = ''): Tenant {
  const targetSlug = slug || (typeof window !== 'undefined' ? localStorage.getItem('clikchat_active_tenant_slug') : null) || 'comida-callejera-xl';
  if (targetSlug === 'clikchat-admin' || targetSlug === 'ten_clikchat_admin') return ADMIN_PLATFORM_TENANT;
  if (targetSlug === 'geosoft' || targetSlug === 'ten_geosoft_prod') {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('clikchat_tenant_geosoft') || localStorage.getItem('clikchat_tenant_ten_geosoft_prod');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.name) return { ...GEOSOFT_DEFAULT_TENANT, ...parsed };
        }
      } catch (e) {}
    }
    return GEOSOFT_DEFAULT_TENANT;
  }

  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(`clikchat_tenant_${targetSlug}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && (parsed.name || parsed.id || parsed.bot_name)) {
          if (targetSlug === 'comida-callejera-xl') {
            if (!parsed.bot_name || parsed.bot_name === 'Asesor Comercial') parsed.bot_name = 'Valeria (Mesera Virtual)';
            if (!parsed.business_type || parsed.business_type === 'tienda') parsed.business_type = 'restaurante';
          }
          return { ...CLEAN_EMPTY_TENANT, ...parsed, slug: parsed.slug || targetSlug };
        }
      }
    } catch (e) {
      console.warn('Error reading cached tenant:', e);
    }
  }

  if (targetSlug === 'comida-callejera-xl') return REAL_DEFAULT_TENANT;
  return { ...CLEAN_EMPTY_TENANT, id: `ten_${slug}`, slug: slug || targetSlug };
}

export function saveCachedTenant(tenant: Tenant): void {
  if (typeof window === 'undefined' || !tenant) return;
  if (!tenant.name && !tenant.id && !tenant.bot_name) return;
  try {
    const slug = tenant.slug || '';
    if (slug) {
      if (slug === 'comida-callejera-xl') {
        if (!tenant.bot_name || tenant.bot_name === 'Asesor Comercial') tenant.bot_name = 'Valeria (Mesera Virtual)';
        tenant.business_type = 'restaurante';
      }
      const existing = localStorage.getItem(`clikchat_tenant_${slug}`);
      if (existing) {
        try {
          const parsed = JSON.parse(existing);
          const merged = { ...parsed, ...tenant };
          if (slug === 'comida-callejera-xl') merged.bot_name = 'Valeria (Mesera Virtual)';
          localStorage.setItem(`clikchat_tenant_${slug}`, JSON.stringify(merged));
          localStorage.setItem('clikchat_active_tenant_slug', slug);
          return;
        } catch (e) {}
      }
      localStorage.setItem(`clikchat_tenant_${slug}`, JSON.stringify(tenant));
      localStorage.setItem('clikchat_active_tenant_slug', slug);
    }
  } catch (e) {
    console.warn('Error saving cached tenant:', e);
  }
}
