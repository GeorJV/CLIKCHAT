export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  rag_level?: string;
  time?: string;
}

export interface ConversationSession {
  id: string;
  user_name?: string;
  user_phone?: string;
  created_at: string;
  last_message?: string;
  last_rag_level?: string;
  total_messages: number;
  messages?: ChatMessage[];
}

export const FALLBACK_SESSIONS: ConversationSession[] = [
  {
    id: 'sess-84920492-preview',
    user_name: 'Alejandra Morales',
    user_phone: '+506 8834-9021',
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    last_message: '¿Tienen entrega a domicilio hoy mismo en Heredia?',
    last_rag_level: 'level_2_faq',
    total_messages: 4,
    messages: [
      { id: '1', sender: 'user', text: 'Hola, buenas tardes. ¿Tienen envíos a Heredia?', time: '14:20' },
      { id: '2', sender: 'assistant', text: '¡Hola Alejandra! Sí, realizamos entregas en todo el GAM incluyendo Heredia de 24 a 48 horas.', rag_level: 'level_2_faq', time: '14:20' },
      { id: '3', sender: 'user', text: '¿Tienen entrega a domicilio hoy mismo en Heredia?', time: '14:21' },
      { id: '4', sender: 'assistant', text: 'Para entrega el mismo día puedes solicitar el servicio motorizado antes de las 2:00 PM con recargo de ₡2,500.', rag_level: 'level_2_faq', time: '14:21' }
    ]
  },
  {
    id: 'sess-73910381-preview',
    user_name: 'Carlos Vargas',
    user_phone: '+506 7091-2345',
    created_at: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    last_message: '¿Qué precio tiene el Bot con RAG y qué incluye?',
    last_rag_level: 'level_3_catalog',
    total_messages: 2,
    messages: [
      { id: '5', sender: 'user', text: '¿Qué precio tiene el Bot con RAG y qué incluye?', time: '13:45' },
      { id: '6', sender: 'assistant', text: 'El plan comercial incluye bot 24/7, memoria D1, catálogo de productos y RAG de 3 niveles por $49/mes.', rag_level: 'level_3_catalog', time: '13:45' }
    ]
  },
  {
    id: 'sess-62809270-preview',
    user_name: 'Lucía Fernández',
    user_phone: '+506 8512-3490',
    created_at: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    last_message: '¿Cuáles son los horarios de atención?',
    last_rag_level: 'semantic_cache',
    total_messages: 2,
    messages: [
      { id: '7', sender: 'user', text: '¿Cuáles son los horarios de atención?', time: '12:30' },
      { id: '8', sender: 'assistant', text: 'Nuestro horario comercial es de lunes a sábado de 9:00 AM a 6:00 PM. El bot responde 24/7.', rag_level: 'semantic_cache', time: '12:30' }
    ]
  }
];
