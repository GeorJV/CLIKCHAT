export interface WhatsAppConfig {
  id?: string;
  tenant_id?: string;
  phone_number_id: string;
  business_phone: string;
  verify_token: string;
  access_token: string;
  status: 'connected' | 'disconnected' | 'testing';
  webhook_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface WhatsAppTestPayload {
  tenantSlug: string;
  recipientPhone: string;
  testMessage?: string;
}
