export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'tenant_owner' | 'agent';
  tenantId: string;
  tenantSlug: string;
}

export interface AuthTenant {
  id: string;
  slug: string;
  name: string;
  owner_email: string;
  owner_name: string;
  bot_name?: string;
  avatar_url?: string;
  business_type?: 'tienda' | 'restaurante' | 'servicios';
  currency?: string;
  plan?: string;
  status?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  tenant?: AuthTenant;
  error?: string;
  message?: string;
}

export interface RegisterFormData {
  name: string;
  businessName: string;
  businessType: 'tienda' | 'restaurante' | 'servicios';
  email: string;
  password: string;
  currency: 'CRC' | 'USD';
}

export interface LoginFormData {
  email: string;
  password: string;
}
