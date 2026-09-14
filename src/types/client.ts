import { Tenant, Product, FAQ, UnresolvedQuery } from '../types';

export type ClientTab = 'audit' | 'faqs' | 'products' | 'settings';

export interface ClientSession {
  isAuthenticated: boolean;
  tenantSlug: string;
  ownerEmail?: string;
  tenantName?: string;
}

export interface TenantListItem {
  id: string;
  slug: string;
  name: string;
  owner_name: string;
  owner_email: string;
  bot_name: string;
  business_hours?: string;
  status: string;
  plan: string;
}

export interface ResolveQueryPayload {
  answer: string;
  category?: string;
  autoInjectToFaq: boolean;
}
