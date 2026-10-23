import { ClientTab } from '../types/client';
import { VoceroNavTab } from '../components/crm/VoceroAppNav';

export const ROUTE_TAB_MAP: Record<string, ClientTab> = {
  '/dashboard': 'chatbot',
  '/chatbot': 'chatbot',
  '/mi-negocio': 'business',
  '/productos': 'products',
  '/conversaciones': 'conversations',
  '/conocimiento': 'faqs',
  '/agente': 'settings',
  '/clientes': 'clientes',
  '/agenda': 'agenda',
  '/entrenamiento-ai': 'training',
  '/soporte': 'soporte',
  '/mi-cuenta': 'account',
  '/crm': 'crm',
};

export const TAB_ROUTE_MAP: Record<ClientTab, string> = {
  chatbot: '/dashboard',
  business: '/mi-negocio',
  products: '/productos',
  faqs: '/mi-negocio',
  documents: '/mi-negocio',
  audit: '/mi-negocio',
  conversations: '/conversaciones',
  settings: '/mi-negocio',
  clientes: '/clientes',
  agenda: '/agenda',
  training: '/entrenamiento-ai',
  soporte: '/soporte',
  user: '/mi-cuenta',
  account: '/mi-cuenta',
  crm: '/crm',
};

export const VOCERO_TAB_ROUTE_MAP: Record<VoceroNavTab, string> = {
  inbox: 'bandeja',
  pipeline: 'pipeline',
  contacts: 'contactos',
  bookings: 'citas',
  clikchat: 'clikchat',
  products: 'productos',
  onboarding: 'onboarding',
  agent: 'agente',
  lab: 'laboratorio',
  analyst: 'analista',
  results: 'resultados',
  settings: 'ajustes',
};

export const ROUTE_VOCERO_TAB_MAP: Record<string, VoceroNavTab> = {
  bandeja: 'inbox',
  inbox: 'inbox',
  pipeline: 'pipeline',
  contactos: 'contacts',
  contacts: 'contacts',
  citas: 'bookings',
  bookings: 'bookings',
  agenda: 'bookings',
  clikchat: 'clikchat',
  web: 'clikchat',
  productos: 'products',
  products: 'products',
  catalogo: 'products',
  catalog: 'products',
  menu: 'products',
  onboarding: 'onboarding',
  guia: 'onboarding',
  inicio: 'onboarding',
  agente: 'agent',
  agent: 'agent',
  laboratorio: 'lab',
  lab: 'lab',
  sandbox: 'lab',
  analista: 'analyst',
  analyst: 'analyst',
  ia: 'analyst',
  resultados: 'results',
  results: 'results',
  metricas: 'results',
  ajustes: 'settings',
  settings: 'settings',
  configuracion: 'settings',
  perfil: 'settings',
  canales: 'settings',
  chatbot: 'clikchat',
  'mi-negocio': 'agent',
  dashboard: 'inbox',
};

export function getTenantTabPath(slug?: string, tab: ClientTab = 'business'): string {
  const activeSlug = slug || (typeof window !== 'undefined' ? localStorage.getItem('clikchat_active_tenant_slug') : null) || 'comida-callejera-xl';
  const tabPath = TAB_ROUTE_MAP[tab] || '/mi-negocio';
  return `/user/mi-negocio/${encodeURIComponent(activeSlug)}${tabPath}`;
}

export function getVoceroTabPath(slug?: string, tab: VoceroNavTab = 'inbox'): string {
  const activeSlug = slug || (typeof window !== 'undefined' ? localStorage.getItem('clikchat_active_tenant_slug') : null) || 'comida-callejera-xl';
  const tabSub = VOCERO_TAB_ROUTE_MAP[tab] || 'bandeja';
  return `/user/mi-negocio/${encodeURIComponent(activeSlug)}/${tabSub}`;
}
