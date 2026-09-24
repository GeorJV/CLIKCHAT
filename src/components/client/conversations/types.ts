export interface ChatMessageRecord {
  id: string;
  sessionId?: string;
  sender: 'user' | 'assistant';
  message?: string;
  content?: string;
  text?: string;
  rag_level_used?: string | null;
  rag_level?: string | null;
  created_at?: string;
  timestamp?: string;
}

export interface ConversationSession {
  id: string;
  user_name?: string;
  user_phone?: string;
  user_email?: string;
  created_at: string;
  updated_at?: string;
  last_message?: string;
  first_user_message?: string;
  last_rag_level?: string | null;
  total_messages: number;
  status: 'online' | 'closed';
  messages?: ChatMessageRecord[];
}
