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
  embedding_text?: string;
  metrics?: {
    views: number;
    buyClicks: number;
    benefitViews: number;
    coldLeads: number;
    warmLeads: number;
    hotLeads: number;
  };
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
  business_hours?: string;
  logo_url?: string;
  tone_of_voice?: string;
  response_delay_sec?: number;
  custom_llm_key?: string;
  operational_rules?: string;
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
  isAudio?: boolean;
  audioDuration?: number;
  audioUrl?: string;
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
  human_answer?: string;
  resolution_answer?: string;
  auto_trained_to_faq?: number;
  created_at: string;
  resolved_at?: string;
}

export interface SaasMetrics {
  totalTenants: number;
  activeTenantsCount: number;
  mrr: string;
  arr: string;
  totalMessagesProcessed: number;
  pendingUnresolvedQueries: number;
}
