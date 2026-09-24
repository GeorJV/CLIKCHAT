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
  user: '/user/admin',
};

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
  const isProductUrl = pathname === '/producto' || pathname.startsWith('/p/') || searchParams.has('p') || searchParams.get('view') === 'product';
  const isServiceUrl = pathname === '/servicio' || searchParams.has('s') || searchParams.get('view') === 'service';
  const isChatUrl = pathname === '/chat' || searchParams.get('view') === 'chat';
  const isAdminUrl = pathname === '/super-admin' || searchParams.get('view') === 'admin';
  const isLoginUrl = pathname === '/login';
  const isLandingUrl = (pathname === '/' || pathname === '/inicio' || pathname === '/landing') && !searchParams.has('p') && !searchParams.has('s') && !searchParams.has('t') && !searchParams.has('view');

  let currentView: AppView = 'client';
  if (isLandingUrl) currentView = 'landing';
  else if (isAdminUrl) currentView = 'admin';
  else if (isProductUrl) currentView = 'product';
  else if (isServiceUrl) currentView = 'service';
  else if (isChatUrl) currentView = 'chat';

  const isUserRoute = pathname.startsWith('/user/');
  const userId = isUserRoute ? pathname.replace('/user/', '') : null;
  const currentTab: ClientTab = isUserRoute ? 'user' : (ROUTE_TAB_MAP[pathname] || 'chatbot');

  return {
    pathname,
    search,
    currentView,
    currentTab,
    isLoginUrl,
    isUserRoute,
    userId,
    navigate,
  };
}
