export type PredefinedAiModelId = 'model-1' | 'model-2' | 'model-3' | 'custom';

export interface PredefinedAiModel {
  id: PredefinedAiModelId;
  key: string;
  name: string;
  shortLabel: string;
  subtitle: string;
  modelSlug: string;
  provider: 'openrouter' | 'cloudflare' | 'openai';
  description: string;
  isDefault?: boolean;
}

export const PREDEFINED_AI_MODELS: PredefinedAiModel[] = [
  {
    id: 'model-1',
    key: 'glm',
    name: 'Modelo 1: GLM 5',
    shortLabel: 'GLM 5',
    subtitle: 'GLM 5.3 Flash (OpenRouter)',
    modelSlug: 'z-ai/glm-5.3-flash:floor',
    provider: 'openrouter',
    description: 'Ultra rápido, óptimo para ventas, cotizaciones ágiles y catálogo comercial.',
    isDefault: true,
  },
  {
    id: 'model-2',
    key: 'gpt',
    name: 'Modelo 2: GPT',
    shortLabel: 'ChatGPT 5 Mini',
    subtitle: 'ChatGPT 5 Mini / GPT-4o Mini',
    modelSlug: 'openai/gpt-4o-mini',
    provider: 'openrouter',
    description: 'Conversación profesional de OpenAI, alto razonamiento y comprensión profunda.',
  },
  {
    id: 'model-3',
    key: 'meta',
    name: 'Modelo 3: Meta',
    shortLabel: 'Meta Llama 3.3',
    subtitle: 'Meta Llama 3.3 (Cloudflare Clofer)',
    modelSlug: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
    provider: 'cloudflare',
    description: 'Motor de código abierto de Meta servido en el borde de Cloudflare y OpenRouter.',
  },
];

export interface AiIncidentReport {
  id: string;
  tenant_id: string;
  session_id?: string;
  failed_model: string;
  fallback_model?: string;
  error_message: string;
  user_query: string;
  status: 'rescued_by_fallback' | 'pending_review' | 'resolved';
  created_at: string;
}

export interface AiReportsSummary {
  total: number;
  rescued: number;
  pending: number;
  resolved: number;
  healthRate: number;
  failuresByModel: Record<string, number>;
}
