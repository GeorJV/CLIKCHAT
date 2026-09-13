export interface Product {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  short_description: string;
  full_description: string;
  images: string[];
  benefits: string[];
  details: Record<string, string>;
  cta_label: string;
  cta_url: string;
  is_active: boolean;
}

export interface FAQ {
  id: string;
  tenant_id: string;
  question: string;
  answer: string;
  category?: string;
  confidence_threshold?: number;
  source?: string;
}

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  owner_email: string;
  owner_name: string;
  bot_name: string;
  avatar_url: string;
  welcome_message: string;
  system_prompt: string;
  primary_color: string;
  cta_text: string;
  cta_url: string;
  plan: string;
  monthly_price: number;
  status: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  message: string;
  rag_level_used?: 'level_1' | 'level_2_faq' | 'level_3_catalog' | 'fallback_hitl';
  levelLabel?: string;
  confidence?: number;
  stoppedEarly?: boolean;
  products?: Product[];
  isFallback?: boolean;
  created_at: string;
}

export interface UnresolvedQuery {
  id: string;
  tenant_id: string;
  session_id: string;
  user_question: string;
  user_lead_info: {
    name?: string;
    phone?: string;
    email?: string;
  };
  status: 'pending' | 'resolved' | 'dismissed';
  resolution_answer?: string;
  created_at: string;
}

export interface SaasMetrics {
  totalTenants: number;
  activeTenantsCount: number;
  mrr: string;
  arr: string;
  totalMessagesProcessed: number;
  pendingUnresolvedQueries: number;
}
