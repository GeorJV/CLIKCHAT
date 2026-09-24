import { Tenant, Product, FAQ, UnresolvedQuery } from '../types';

export type ClientTab =
  | 'chatbot'
  | 'business'
  | 'products'
  | 'faqs'
  | 'documents'
  | 'audit'
  | 'conversations'
  | 'settings'
  | 'clientes'
  | 'agenda'
  | 'training'
  | 'soporte'
  | 'user';

export interface DocumentChunk {
  id: string;
  chunk_index: number;
  content: string;
}

export interface KnowledgeDocument {
  id: string;
  tenant_id: string;
  title: string;
  category: string;
  file_type: string;
  chunks_count?: number;
  created_at: string;
}

export interface DocumentDetail extends KnowledgeDocument {
  raw_content?: string;
  chunks?: DocumentChunk[];
}

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
