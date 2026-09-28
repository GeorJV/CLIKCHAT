import { Tenant } from '../types';

// Configuración oficial por defecto: COMIDA CALLEJERA XL
export const REAL_DEFAULT_TENANT: Tenant = {
  id: 'ten_1790438865714_53ytu',
  slug: 'comida-callejera-xl',
  name: 'COMIDA CALLEJERA XL',
  owner_name: 'GEORGE',
  owner_email: 'ccxl@gmail.com',
  bot_name: 'Asesor Comercial',
  avatar_url: '',
  plan: 'pro',
  monthly_price: 79,
  status: 'active',
  primary_color: '#10b981',
  business_type: 'restaurante',
  currency: 'CRC',
  business_hours: 'Lunes a Sabado de 8:00 AM a 7:00 PM',
  cta_text: 'Realizar Compra',
  cta_url: 'https://wa.me/50688888888?text=Hola,%20deseo%20comprar',
  welcome_message: '¡Hola! 👋 Bienvenido a nuestro restaurante. ¿Deseas ver el menú o ordenar tu pedido?',
  system_prompt: 'Eres el asesor comercial de nuestro restaurante. Tu objetivo es tentar el apetito del cliente, recomendar bebidas y acompañamientos, y guiarlo a completar su orden.',
  sales_flow_rules: '1. Sugerir acompañamiento o bebida ante plato principal. 2. Preguntar si es para llevar o express. 3. Guiar al total.',
  order_ticket_format: '',
  tone_of_voice: 'Amigable y Enérgico',
  response_delay_sec: 1,
  phone: '+506 8888-8888',
  created_at: '2026-09-26T16:07:45Z'
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

// Configuración oficial por defecto: Administración Central ClikChat (100% independiente)
export const ADMIN_PLATFORM_TENANT: Tenant = {
  id: 'ten_clikchat_admin',
  slug: 'clikchat-admin',
  name: 'Administración Central ClikChat',
  owner_name: 'Super Administrador',
  owner_email: 'admin@clikchat.com',
  bot_name: 'Concierge Central',
  avatar_url: '',
  plan: 'enterprise',
  monthly_price: 0,
  status: 'active',
  primary_color: '#6366f1',
  business_type: 'servicios',
  currency: 'USD',
  business_hours: '24/7 Soporte Global',
  cta_text: 'Soporte Plataforma',
  cta_url: 'https://wa.me/50688888888',
  welcome_message: 'Panel administrativo central de la plataforma ClikChat.',
  system_prompt: 'Eres el asistente administrativo de la plataforma ClikChat.',
  sales_flow_rules: '',
  order_ticket_format: '',
  tone_of_voice: 'Ejecutivo y Conciso',
  response_delay_sec: 1,
  phone: '+506 8888-8888',
  created_at: '2026-09-24T00:00:00Z'
};

export const DEFAULT_FALLBACK_TENANT: Tenant = REAL_DEFAULT_TENANT;

export function getCachedTenant(slug: string = ''): Tenant {
  if (slug === 'clikchat-admin' || slug === 'ten_clikchat_admin') return ADMIN_PLATFORM_TENANT;
  if (slug === 'comida-callejera-xl') return REAL_DEFAULT_TENANT;
  if (!slug) {
    if (typeof window !== 'undefined') {
      const activeSlug = localStorage.getItem('clikchat_active_tenant_slug');
      if (activeSlug) return getCachedTenant(activeSlug);
    }
    return { ...REAL_DEFAULT_TENANT };
  }
  if (typeof window === 'undefined') return { ...CLEAN_EMPTY_TENANT, slug };
  try {
    const saved = localStorage.getItem(`clikchat_tenant_${slug}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && (parsed.name || parsed.id)) {
        return { ...CLEAN_EMPTY_TENANT, ...parsed, slug: parsed.slug || slug };
      }
    }
  } catch (e) {
    console.warn('Error reading cached tenant:', e);
  }
  const isRestaurant = /restaurante|comida|burger|pizza|deli|tacos|cafe|bar|sushi|bistr|parrilla|asador/i.test(slug);
  const humanName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  return {
    ...CLEAN_EMPTY_TENANT,
    id: `ten_${slug}`,
    slug,
    name: humanName,
    bot_name: isRestaurant ? 'Mesero Virtual' : 'Asesor Comercial',
    welcome_message: isRestaurant
      ? `¡Hola! 👋 Te damos la bienvenida a ${humanName}. ¿Qué se te antoja ordenar hoy?`
      : `¡Hola! 👋 Te damos la bienvenida a ${humanName}. ¿En qué podemos asesorarte hoy?`,
    system_prompt: isRestaurant
      ? 'Eres el mesero y asesor gastronómico profesional del restaurante. Atiende con amabilidad y apetito, sugiere acompañamientos y bebidas (ej: "¿Te gustaría acompañar tu plato con papas rústicas o ensalada? ¿Deseas agregar bebida por $1.50 más?"), y ayuda al cliente a armar su pedido.'
      : 'Eres el asesor comercial de la tienda. Tu objetivo es resaltar los beneficios de los productos y guiar al usuario a comprar.',
    business_type: isRestaurant ? 'restaurante' : 'tienda',
    currency: 'CRC',
    status: 'active'
  };
}

export function saveCachedTenant(tenant: Tenant): void {
  if (typeof window === 'undefined' || !tenant) return;
  // Blindaje anti-vaciado: nunca sobreescribir con un esqueleto vacío
  if (!tenant.name && !tenant.id && !tenant.bot_name) {
    return;
  }
  try {
    const slug = tenant.slug || '';
    if (slug) {
      const existing = localStorage.getItem(`clikchat_tenant_${slug}`);
      if (existing) {
        try {
          const parsed = JSON.parse(existing);
          const merged = { ...parsed, ...tenant };
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
