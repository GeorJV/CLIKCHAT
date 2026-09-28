export interface CashFlowMetrics {
  today: number;
  tomorrow: number;
  thisWeek: number;
}

export interface SaasFinancialMetrics {
  mrr: number;
  arr: number;
  totalHistoricalIncome: number;
  totalActiveSubscriptions: number;
}

export interface IndustryCategoryMetric {
  category: string;
  merchant_count: number;
  total_category_revenue: number;
  percentage: number;
}

export interface FinanceMetricsResponse {
  cashFlow: CashFlowMetrics;
  saasMetrics: SaasFinancialMetrics;
  categories: IndustryCategoryMetric[];
}
