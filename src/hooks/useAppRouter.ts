import { useState, useEffect, useCallback } from 'react';
import { ClientTab } from '../types/client';
import { VoceroNavTab } from '../components/crm/VoceroAppNav';
import {
  ROUTE_TAB_MAP,
  TAB_ROUTE_MAP,
  VOCERO_TAB_ROUTE_MAP,
  ROUTE_VOCERO_TAB_MAP,
  getTenantTabPath,
  getVoceroTabPath
} from './routerConstants';

export {
  ROUTE_TAB_MAP,
  TAB_ROUTE_MAP,
  VOCERO_TAB_ROUTE_MAP,
  ROUTE_VOCERO_TAB_MAP,
  getTenantTabPath,
  getVoceroTabPath
};

export type AppView = 'landing' | 'chat' | 'product' | 'service' | 'client' | 'admin' | 'kds' | 'rider';

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
  let currentVoceroTab: VoceroNavTab = 'inbox';

  const isCrmDirect = parts[0] === 'crm';
  const isUserPanel = parts[0] === 'user' && parts[1] === 'mi-negocio' && parts.length >= 2;
  const isPanelUrl = isUserPanel || (parts[0] === 'panel' && parts.length >= 2) || parts[0] === 'dashboard' || isCrmDirect;

  if (isPanelUrl) {
    if (isUserPanel) {
      routeTenantSlug = decodeURIComponent(parts[2] || '');
      const rawSub = (parts[3] || '').toLowerCase();
      if (ROUTE_VOCERO_TAB_MAP[rawSub]) {
        currentVoceroTab = ROUTE_VOCERO_TAB_MAP[rawSub];
      }
      const section = parts[3] ? `/${parts[3]}` : '/mi-negocio';
      panelTabFromRoute = ROUTE_TAB_MAP[section] || 'business';
    } else if (isCrmDirect) {
      const activeSlug = (typeof window !== 'undefined' ? localStorage.getItem('clikchat_active_tenant_slug') : null) || 'comida-callejera-xl';
      if (parts.length === 1) {
        routeTenantSlug = activeSlug;
        currentVoceroTab = 'inbox';
      } else if (parts.length === 2) {
        const sub = parts[1].toLowerCase();
        if (ROUTE_VOCERO_TAB_MAP[sub]) {
          routeTenantSlug = activeSlug;
          currentVoceroTab = ROUTE_VOCERO_TAB_MAP[sub];
        } else {
          routeTenantSlug = parts[1];
          currentVoceroTab = 'inbox';
        }
      } else {
        routeTenantSlug = parts[1];
        currentVoceroTab = ROUTE_VOCERO_TAB_MAP[parts[2]?.toLowerCase()] || 'inbox';
      }
      panelTabFromRoute = 'crm';
    } else if (parts[0] === 'panel') {
      routeTenantSlug = parts[1];
      const section = parts[2] ? `/${parts[2]}` : '/mi-negocio';
      panelTabFromRoute = ROUTE_TAB_MAP[section] || 'business';
      currentVoceroTab = ROUTE_VOCERO_TAB_MAP[(parts[2] || '').toLowerCase()] || 'inbox';
    } else if (parts[0] === 'dashboard') {
      const activeSlug = (typeof window !== 'undefined' ? localStorage.getItem('clikchat_active_tenant_slug') : null) || 'comida-callejera-xl';
      routeTenantSlug = activeSlug;
      panelTabFromRoute = 'chatbot';
      currentVoceroTab = 'inbox';
    }
  }

  const RESERVED_PATHS = new Set(['user', 'panel', 'dashboard', 'admin', 'super-admin', 'login', 'registro', 'producto', 'servicio', 'chat', 'api', 'inicio', 'landing', 'crm', 'kds', 'rider', 'motorizados']);
  const isDirectTenantUrl = parts.length === 1 && !RESERVED_PATHS.has(parts[0]);
  const isChatProductUrl = parts[0] === 'chat' && parts.length >= 3;
  const isChatSlugUrl = (parts[0] === 'chat' && parts.length === 2) || isDirectTenantUrl;

  if (isChatProductUrl) {
    routeTenantSlug = decodeURIComponent(parts[1]);
    routeProductId = decodeURIComponent(parts[2]);
  } else if (isChatSlugUrl) {
    routeTenantSlug = decodeURIComponent(parts[0] === 'chat' ? parts[1] : parts[0]);
  }

  const isProductSlugUrl = parts[0] === 'producto' && parts.length >= 2;
  if (isProductSlugUrl) {
    routeTenantSlug = parts[1];
    if (parts[2]) routeProductId = parts[2];
  }

  const isKdsUrl = pathname === '/kds' || searchParams.get('view') === 'kds';
  const isRiderUrl = pathname === '/rider' || pathname === '/motorizados' || searchParams.get('view') === 'rider';
  const isProductUrl = isChatProductUrl || isProductSlugUrl || pathname === '/producto' || pathname.startsWith('/p/') || searchParams.has('p') || searchParams.get('view') === 'product';
  const isServiceUrl = pathname === '/servicio' || pathname.startsWith('/servicio/') || searchParams.has('s') || searchParams.get('view') === 'service';
  const isChatUrl = isChatSlugUrl || pathname === '/chat' || searchParams.get('view') === 'chat';
  const isAdminUrl = pathname === '/super-admin' || searchParams.get('view') === 'admin';
  const isLandingUrl = (pathname === '/' || pathname === '/inicio' || pathname === '/landing') && !searchParams.has('p') && !searchParams.has('s') && !searchParams.has('t') && !searchParams.has('view') && !isPanelUrl && !isChatSlugUrl && !isKdsUrl && !isRiderUrl;

  let currentView: AppView = 'client';
  if (isLandingUrl) currentView = 'landing';
  else if (isAdminUrl) currentView = 'admin';
  else if (isKdsUrl) currentView = 'kds';
  else if (isRiderUrl) currentView = 'rider';
  else if (isProductUrl) currentView = 'product';
  else if (isServiceUrl) currentView = 'service';
  else if (isChatUrl) currentView = 'chat';

  const isUserRoute = pathname.startsWith('/user/');
  const userId = isUserRoute ? pathname.replace('/user/', '') : null;
  const currentTab: ClientTab = panelTabFromRoute || (ROUTE_TAB_MAP[pathname] || 'business');

  return {
    pathname,
    search,
    currentView,
    currentTab,
    currentVoceroTab,
    routeTenantSlug,
    routeProductId,
    isPanelUrl,
    isUserRoute,
    userId,
    navigate,
  };
}
