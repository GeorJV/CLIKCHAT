export interface QuotaPeriodMetric {
  limit: number;
  used: number;
  remaining: number;
  percentage: number;
}

export interface TenantQuotas {
  hourly: QuotaPeriodMetric;
  daily: QuotaPeriodMetric;
  monthly: QuotaPeriodMetric;
}

export interface TenantQuotasResponse {
  success: boolean;
  tenantId: string;
  tenantName?: string;
  planTier?: string;
  quotas: TenantQuotas;
  updatedAt?: string;
}
