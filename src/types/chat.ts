import { Product, Tenant, ChatMessage } from '../types';

export type RAGLevel = 'level_1' | 'level_2_faq' | 'level_3_catalog' | 'fallback_hitl';

export interface ChatSendPayload {
  tenantSlug: string;
  tenantId?: string;
  sessionId: string;
  message: string;
}

export interface RAGResponsePayload {
  sessionId: string;
  level: RAGLevel;
  levelLabel: string;
  confidence: number;
  answer: string;
  stoppedEarly?: boolean;
  products?: Product[];
  isFallback?: boolean;
  requiresLeadInfo?: boolean;
}

export interface UseChatRAGOptions {
  tenant: Tenant | null;
  tenantSlug: string;
  onSelectProduct?: (product: Product) => void;
  onTriggerFallback?: () => void;
}
