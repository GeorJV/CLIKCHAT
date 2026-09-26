import { useState, useEffect, useCallback } from 'react';
import { AuthUser, AuthTenant, AuthResponse, LoginFormData, RegisterFormData } from '../types/auth';
import { saveCachedTenant } from '../utils/fallbackTenant';

const TOKEN_KEY = 'clikchat_auth_token';
const USERS_KEY = 'clikchat_local_users';

const DEMO_USER: AuthUser = {
  id: 'usr_demo_techstore',
  email: 'demo@clikchat.com',
  name: 'TechStore Demo',
  role: 'tenant_owner',
  tenantId: 'tnt_demo_techstore',
  tenantSlug: 'geosoft'
};

const DEMO_TENANT: AuthTenant = {
  id: 'tnt_demo_techstore',
  slug: 'geosoft',
  name: 'TechStore Demo',
  owner_email: 'demo@clikchat.com',
  owner_name: 'TechStore Demo',
  business_type: 'tienda',
  currency: 'USD'
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tenant, setTenant] = useState<AuthTenant | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    if (token === 'demo-token-active') {
      const activeSlug = localStorage.getItem('clikchat_active_tenant_slug') || 'geosoft';
      setUser({ ...DEMO_USER, tenantSlug: activeSlug });
      setTenant({ ...DEMO_TENANT, slug: activeSlug });
      setIsLoading(false);
      return;
    }

    if (token.startsWith('local-token-')) {
      const userId = token.replace('local-token-', '');
      try {
        const localUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const matched = localUsers.find((u: any) => u.id === userId);
        if (matched) {
          const activeSlug = matched.tenantSlug || localStorage.getItem('clikchat_active_tenant_slug') || 'mi-negocio';
          setUser({
            id: matched.id,
            email: matched.email,
            name: matched.name,
            role: 'tenant_owner',
            tenantId: matched.tenantId,
            tenantSlug: activeSlug
          });
          setIsLoading(false);
          return;
        }
      } catch (e) {}
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        const ct = res.headers.get('content-type') || '';
        if (!res.ok || !ct.includes('application/json')) throw new Error('Sesión');
        return res.json() as Promise<AuthResponse>;
      })
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('clikchat_role', data.user.role);
          if (data.user.tenantSlug) localStorage.setItem('clikchat_active_tenant_slug', data.user.tenantSlug);
          if (data.tenant) setTenant(data.tenant);
        } else if (!token.startsWith('local-') && token !== 'demo-token-active') {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem('clikchat_role');
        }
      })
      .catch(() => {
        if (!token.startsWith('local-') && token !== 'demo-token-active') {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem('clikchat_role');
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (data: LoginFormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    const isDemo = data.email.toLowerCase() === 'demo@clikchat.com' && data.password === 'demo1234';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const resData = (await res.json()) as AuthResponse;
        if (resData.success) {
          if (resData.token) localStorage.setItem(TOKEN_KEY, resData.token);
          if (resData.user) {
            setUser(resData.user);
            localStorage.setItem('clikchat_role', resData.user.role);
            if (resData.user.tenantSlug) localStorage.setItem('clikchat_active_tenant_slug', resData.user.tenantSlug);
          }
          if (resData.tenant) {
            setTenant(resData.tenant);
            saveCachedTenant(resData.tenant as any);
          }
          setIsLoading(false);
          return true;
        }
      }
      if (!res.ok && ct.includes('application/json') && !isDemo) {
        const resData = (await res.json()) as AuthResponse;
        if (resData.error) {
          setError(resData.error);
          setIsLoading(false);
          return false;
        }
      }
    } catch (e) {}

    try {
      const localUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const matched = localUsers.find((u: any) => u.email.toLowerCase() === data.email.toLowerCase() && u.password === data.password);
      if (matched) {
        const u: AuthUser = {
          id: matched.id,
          email: matched.email,
          name: matched.name,
          role: 'tenant_owner',
          tenantId: matched.tenantId,
          tenantSlug: matched.tenantSlug
        };
        localStorage.setItem(TOKEN_KEY, `local-token-${matched.id}`);
        localStorage.setItem('clikchat_role', u.role);
        localStorage.setItem('clikchat_active_tenant_slug', u.tenantSlug);
        setUser(u);
        setIsLoading(false);
        return true;
      }
    } catch (e) {}

    if (isDemo) {
      localStorage.setItem(TOKEN_KEY, 'demo-token-active');
      localStorage.setItem('clikchat_role', DEMO_USER.role);
      localStorage.setItem('clikchat_active_tenant_slug', 'geosoft');
      setUser(DEMO_USER);
      setTenant(DEMO_TENANT);
      setIsLoading(false);
      return true;
    }

    setError('Credenciales inválidas o cuenta no encontrada');
    setIsLoading(false);
    return false;
  }, []);

  const register = useCallback(async (data: RegisterFormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const resData = (await res.json()) as AuthResponse;
        if (resData.success) {
          if (resData.token) localStorage.setItem(TOKEN_KEY, resData.token);
          if (resData.user) {
            setUser(resData.user);
            localStorage.setItem('clikchat_role', resData.user.role);
            if (resData.user.tenantSlug) localStorage.setItem('clikchat_active_tenant_slug', resData.user.tenantSlug);
          }
          if (resData.tenant) {
            setTenant(resData.tenant);
            saveCachedTenant(resData.tenant as any);
          }
          setIsLoading(false);
          return true;
        }
      }
      if (!res.ok && ct.includes('application/json')) {
        const resData = (await res.json()) as AuthResponse;
        if (resData.error) {
          setError(resData.error);
          setIsLoading(false);
          return false;
        }
      }
    } catch (e) {}

    const cleanSlug = data.businessName.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `negocio-${Date.now().toString(36)}`;

    const newTenantId = `ten_${Date.now()}`;
    const newUser: AuthUser = {
      id: `usr_${Date.now()}`,
      email: data.email.trim().toLowerCase(),
      name: data.name.trim(),
      role: 'tenant_owner',
      tenantId: newTenantId,
      tenantSlug: cleanSlug
    };

    const isRestaurant = data.businessType === 'restaurante';
    const newTenant: any = {
      id: newTenantId,
      slug: cleanSlug,
      name: data.businessName.trim(),
      owner_name: data.name.trim(),
      owner_email: data.email.trim().toLowerCase(),
      bot_name: 'Asesor Comercial',
      business_type: data.businessType || 'tienda',
      currency: data.currency || 'CRC',
      plan: 'pro',
      status: 'active',
      welcome_message: isRestaurant
        ? '¡Hola! 👋 Bienvenido a nuestro restaurante. ¿En qué podemos deleitarte hoy?'
        : '¡Hola! 👋 Bienvenido a nuestra tienda oficial. ¿En qué puedo asesorarte hoy?',
      system_prompt: isRestaurant
        ? 'Eres el asesor comercial oficial del restaurante. Ayuda al cliente y guía su pedido a WhatsApp.'
        : 'Eres el asesor comercial oficial de la tienda. Ayuda al cliente y guía su compra a WhatsApp.',
      response_delay_sec: 1
    };

    saveCachedTenant(newTenant);
    try {
      const localUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      localUsers.push({ ...data, id: newUser.id, tenantId: newUser.tenantId, tenantSlug: newUser.tenantSlug });
      localStorage.setItem(USERS_KEY, JSON.stringify(localUsers));
    } catch (e) {}

    localStorage.setItem(TOKEN_KEY, `local-token-${newUser.id}`);
    localStorage.setItem('clikchat_role', newUser.role);
    localStorage.setItem('clikchat_active_tenant_slug', cleanSlug);
    setUser(newUser);
    setTenant(newTenant as any);
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('clikchat_role');
    localStorage.removeItem('clikchat_active_tenant_slug');
    setUser(null);
    setTenant(null);
    setError(null);
  }, []);

  return {
    user,
    tenant,
    isAuthenticated: !!user,
    isLoading,
    error,
    setError,
    login,
    register,
    logout
  };
}
