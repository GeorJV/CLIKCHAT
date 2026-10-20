export interface ZernioConfig {
  id?: string;
  tenant_id?: string;
  api_key: string;
  account_id: string;
  webhook_url: string;
  status: 'connected' | 'disconnected' | 'testing';
  channels: ('whatsapp' | 'instagram' | 'messenger' | 'tiktok')[];
  auto_reply: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ZernioWebhookPayload {
  event: 'message.received' | 'message.delivered' | 'message.read' | 'comment.received';
  accountId: string;
  platform: 'whatsapp' | 'instagram' | 'messenger' | 'tiktok';
  message: {
    id: string;
    text: string;
    timestamp?: string;
  };
  sender: {
    id: string;
    name?: string;
    phone?: string;
  };
}
