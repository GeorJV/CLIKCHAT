import { Tenant } from '../types';

// Tenant de demostración reservado EXCLUSIVAMENTE para la tienda demo 'geosoft'
export const DEMO_GEOSOFT_TENANT: Tenant = {
  id: 'a0000000-0000-0000-0000-000000000001',
  slug: 'geosoft',
  name: 'Restaurante ClikChat',
  owner_name: 'George Anders',
  owner_email: 'Georgeandersmail@gmail.com',
  bot_name: 'Asesora Virtual',
  avatar_url: '',
  plan: 'enterprise',
  monthly_price: 49,
  status: 'active',
  primary_color: '#10b981',
  business_type: 'restaurante',
  currency: 'CRC',
  business_hours: 'Lunes a Domingo de 11:00 AM a 10:00 PM',
  cta_text: 'Pedir por WhatsApp',
  cta_url: 'https://wa.me/50688888888',
  welcome_message: '¡Hola! 👋 Te damos la bienvenida a nuestro restaurante. ¿En qué podemos deleitarte hoy?',
  system_prompt: 'Eres el asesor comercial oficial del restaurante. Guía al usuario con amabilidad, muestra apetito en las descripciones y ayúdalo a cerrar su comanda.',
  sales_flow_rules: '1. Sugerir acompañamiento o bebida ante plato principal. 2. Preguntar si es para llevar o express. 3. Guiar al total.',
  order_ticket_format: '',
  tone_of_voice: 'Profesional y Cortés',
  response_delay_sec: 1,
  phone: '+506 8888-8888',
  created_at: '2026-01-15T00:00:00Z'
};

// Plantilla 100% limpia y vacía para TODAS las cuentas nuevas
export const CLEAN_EMPTY_TENANT: Tenant = {
  id: '',
  slug: '',
  name: '',
  owner_name: '',
  owner_email: '',
  bot_name: '',
  avatar_url: '',
  plan: 'pro',
  monthly_price: 49,
  status: 'active',
  primary_color: '#10b981',
  business_type: 'tienda',
  currency: 'CRC',
  business_hours: '',
  cta_text: '',
  cta_url: '',
  welcome_message: '',
  system_prompt: '',
  sales_flow_rules: '',
  order_ticket_format: '',
  tone_of_voice: 'Profesional y Cortés',
  response_delay_sec: 1
};

export const DEFAULT_FALLBACK_TENANT: Tenant = CLEAN_EMPTY_TENANT;

export function getCachedTenant(slug: string = ''): Tenant {
  if (slug === 'geosoft') return DEMO_GEOSOFT_TENANT;
  if (!slug) return { ...CLEAN_EMPTY_TENANT };
  if (typeof window === 'undefined') return { ...CLEAN_EMPTY_TENANT, slug };
  try {
    const saved = localStorage.getItem(`clikchat_tenant_${slug}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return { ...CLEAN_EMPTY_TENANT, ...parsed, slug: parsed.slug || slug };
      }
    }
  } catch (e) {
    console.warn('Error reading cached tenant:', e);
  }
  return { ...CLEAN_EMPTY_TENANT, slug };
}

export function saveCachedTenant(tenant: Tenant): void {
  if (typeof window === 'undefined' || !tenant) return;
  try {
    const slug = tenant.slug || '';
    if (slug) {
      localStorage.setItem(`clikchat_tenant_${slug}`, JSON.stringify(tenant));
      localStorage.setItem('clikchat_active_tenant_slug', slug);
    }
  } catch (e) {
    console.warn('Error saving cached tenant:', e);
  }
}
