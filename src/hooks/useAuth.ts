import { useState, useEffect, useCallback } from 'react';
import { AuthUser, AuthTenant, AuthResponse, LoginFormData, RegisterFormData } from '../types/auth';

const TOKEN_KEY = 'clikchat_auth_token';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tenant, setTenant] = useState<AuthTenant | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize and verify session on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Sesión expirada');
        return res.json() as Promise<AuthResponse>;
      })
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
          if (typeof window !== 'undefined') {
            localStorage.setItem('clikchat_role', data.user.role);
          }
          if (data.tenant) setTenant(data.tenant);
        } else {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem('clikchat_role');
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('clikchat_role');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = useCallback(async (data: LoginFormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = (await res.json()) as AuthResponse;
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Error al iniciar sesión');
      }

      if (resData.token) localStorage.setItem(TOKEN_KEY, resData.token);
      if (resData.user) {
        setUser(resData.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('clikchat_role', resData.user.role);
        }
      }
      if (resData.tenant) setTenant(resData.tenant);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
      return false;
    } finally {
      setIsLoading(false);
    }
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
      const resData = (await res.json()) as AuthResponse;
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Error al registrar la cuenta');
      }

      if (resData.token) localStorage.setItem(TOKEN_KEY, resData.token);
      if (resData.user) {
        setUser(resData.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('clikchat_role', resData.user.role);
        }
      }
      if (resData.tenant) setTenant(resData.tenant);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('clikchat_role');
    }
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
