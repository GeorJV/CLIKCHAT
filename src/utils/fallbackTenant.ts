import { Tenant } from '../types';

export const DEFAULT_FALLBACK_TENANT: Tenant = {
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
  response_delay_sec: 1
};

export function getCachedTenant(slug: string = 'geosoft'): Tenant {
  if (typeof window === 'undefined') return { ...DEFAULT_FALLBACK_TENANT, slug };
  try {
    const activeSlug = localStorage.getItem('clikchat_active_tenant_slug') || slug;
    const targetSlug = slug || activeSlug;
    const saved = localStorage.getItem(`clikchat_tenant_${targetSlug}`) || localStorage.getItem('clikchat_tenant_active');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed.name) {
        return { ...DEFAULT_FALLBACK_TENANT, ...parsed, slug: parsed.slug || targetSlug };
      }
    }
  } catch (e) {
    console.warn('Error reading cached tenant:', e);
  }
  return { ...DEFAULT_FALLBACK_TENANT, slug };
}

export function saveCachedTenant(tenant: Tenant): void {
  if (typeof window === 'undefined' || !tenant) return;
  try {
    const slug = tenant.slug || 'geosoft';
    localStorage.setItem(`clikchat_tenant_${slug}`, JSON.stringify(tenant));
    localStorage.setItem('clikchat_tenant_active', JSON.stringify(tenant));
    localStorage.setItem('clikchat_active_tenant_slug', slug);
  } catch (e) {
    console.warn('Error saving cached tenant:', e);
  }
}
