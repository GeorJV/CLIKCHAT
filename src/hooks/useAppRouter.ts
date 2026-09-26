import { useState, useEffect, useCallback } from 'react';
import { ClientTab } from '../types/client';

export type AppView = 'landing' | 'chat' | 'product' | 'service' | 'client' | 'admin';

export const ROUTE_TAB_MAP: Record<string, ClientTab> = {
  '/dashboard': 'chatbot',
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
};

export function getTenantTabPath(slug?: string, tab: ClientTab = 'chatbot'): string {
  const tabPath = TAB_ROUTE_MAP[tab] || '/dashboard';
  return slug ? `/panel/${slug}${tabPath}` : tabPath;
}

export function useAppRouter() {
  const getPath = () => (typeof window !== 'undefined' ? window.location.pathname : '/');
  const getSearch = () => (typeof window !== 'undefined' ? window.location.search : '');

  const [pathname, setPathname] = useState(getPath);
  const [search, setSearch] = useState(getSearch);

  useEffect(() => {
    const handleLocationChange = () => {
      setPathname(getPath());
      setSearch(getSearch());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('app-navigate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('app-navigate', handleLocationChange);
    };
  }, []);

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    if (typeof window === 'undefined') return;
    if (options?.replace) {
      window.history.replaceState(null, '', to);
    } else {
      window.history.pushState(null, '', to);
    }
    setPathname(getPath());
    setSearch(getSearch());
    window.dispatchEvent(new Event('app-navigate'));
  }, []);

  const searchParams = new URLSearchParams(search);
  const parts = pathname.split('/').filter(Boolean);

  let routeTenantSlug: string | null = searchParams.get('t') || null;
  let routeProductId: string | null = searchParams.get('p') || null;
  let panelTabFromRoute: ClientTab | null = null;

  const isPanelUrl = parts[0] === 'panel' && parts.length >= 2;
  if (isPanelUrl) {
    routeTenantSlug = parts[1];
    const section = parts[2] ? `/${parts[2]}` : '/dashboard';
    panelTabFromRoute = ROUTE_TAB_MAP[section] || 'chatbot';
  }

  const isChatSlugUrl = parts[0] === 'chat' && parts.length >= 2;
  if (isChatSlugUrl) {
    routeTenantSlug = parts[1];
  }

  const isProductSlugUrl = parts[0] === 'producto' && parts.length >= 2;
  if (isProductSlugUrl) {
    routeTenantSlug = parts[1];
    if (parts[2]) routeProductId = parts[2];
  }

  const isProductUrl = isProductSlugUrl || pathname === '/producto' || pathname.startsWith('/p/') || searchParams.has('p') || searchParams.get('view') === 'product';
  const isServiceUrl = pathname === '/servicio' || pathname.startsWith('/servicio/') || searchParams.has('s') || searchParams.get('view') === 'service';
  const isChatUrl = isChatSlugUrl || pathname === '/chat' || searchParams.get('view') === 'chat';
  const isAdminUrl = pathname === '/super-admin' || searchParams.get('view') === 'admin';
  const isLoginUrl = pathname === '/login';
  const isRegisterUrl = pathname === '/registro';
  const isLandingUrl = (pathname === '/' || pathname === '/inicio' || pathname === '/landing') && !searchParams.has('p') && !searchParams.has('s') && !searchParams.has('t') && !searchParams.has('view') && !isPanelUrl && !isChatSlugUrl;

  let currentView: AppView = 'client';
  if (isLandingUrl) currentView = 'landing';
  else if (isAdminUrl) currentView = 'admin';
  else if (isProductUrl) currentView = 'product';
  else if (isServiceUrl) currentView = 'service';
  else if (isChatUrl) currentView = 'chat';

  const isUserRoute = pathname.startsWith('/user/');
  const userId = isUserRoute ? pathname.replace('/user/', '') : null;
  const currentTab: ClientTab = panelTabFromRoute || (isUserRoute ? 'user' : (ROUTE_TAB_MAP[pathname] || 'chatbot'));

  return {
    pathname,
    search,
    currentView,
    currentTab,
    routeTenantSlug,
    routeProductId,
    isPanelUrl,
    isLoginUrl,
    isRegisterUrl,
    isUserRoute,
    userId,
    navigate,
  };
}
