export interface AiUsageDetail {
  glm_usage: number;
  glm_limit: number;
  glm_percentage: number;
  gpt_usage: number;
  gpt_limit: number;
  gpt_percentage: number;
  total_usage: number;
  total_limit: number;
  total_messages: number;
}

export interface MerchantAdminItem {
  id: string;
  name: string;
  slug: string;
  owner_email: string;
  owner_name?: string;
  business_type?: string;
  currency?: string;
  plan: string;
  monthly_price: number;
  billing_cycle?: 'monthly' | 'yearly';
  status: string;
  created_at: string;
  next_billing_date?: string;
  total_messages?: number;
  glm_limit?: number;
  gpt_limit?: number;
  ai_usage?: AiUsageDetail;
}

export interface OptionalModelConfig {
  enabled: boolean;
  modelId: string;
  name: string;
  monthlyLimit: number;
}

export interface GlobalAiBudgetSettings {
  dayBudget: number;
  weekBudget: number;
  monthBudget: number;
  glmLimitPerAccount?: number;
  gptLimitPerAccount?: number;
  applyToAllAccounts?: boolean;
  optionalModel: OptionalModelConfig;
}

export interface AiSpendingMetrics {
  source?: string;
  openrouter?: {
    label: string;
    usage_daily: number;
    usage_weekly: number;
    usage_monthly: number;
    usage_total: number;
    limit_remaining: number;
    limit_total: number;
    free_requests_used?: number;
    free_requests_limit?: number;
    is_live: boolean;
  };
  budgets?: {
    dayBudget: number;
    weekBudget: number;
    monthBudget: number;
  };
  limits: {
    glm_monthly_limit: number;
    gpt_monthly_limit: number;
  };
  models: {
    glm: {
      name: string;
      modelId: string;
      day: number;
      week: number;
      month: number;
      monthlyLimitPerAccount: number;
      freeRequestsToday?: number;
    };
    gpt: {
      name: string;
      modelId: string;
      day: number;
      week: number;
      month: number;
      monthlyLimitPerAccount: number;
    };
    optional?: {
      name: string;
      modelId: string;
      day: number;
      week: number;
      month: number;
      monthlyLimitPerAccount: number;
      enabled: boolean;
    };
  };
  summary: {
    totalDay: number;
    totalWeek: number;
    totalMonth: number;
    totalAllTime: number;
    limitRemaining: number;
    limitTotal: number;
  };
}

export interface EditSubFormData {
  plan: string;
  billingCycle: 'monthly' | 'yearly';
  monthlyPrice: number;
  currency: string;
  businessType: string;
  nextBillingDate: string;
  status: string;
  glmLimit: number;
  gptLimit: number;
}
