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
  user_email?: string;
  created_at: string;
  last_message?: string;
  last_rag_level?: string;
  total_messages: number;
  status: 'online' | 'closed';
  messages?: ChatMessage[];
}

export const FALLBACK_SESSIONS: ConversationSession[] = [
  {
    id: 'sess-84920492-preview',
    user_name: 'Alejandra Morales',
    user_phone: '+506 8834-9021',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    last_message: '¿Tienen entrega a domicilio hoy mismo en Heredia?',
    last_rag_level: 'level_2_faq',
    total_messages: 4,
    status: 'online',
    messages: [
      { id: '1', sender: 'user', text: 'Hola, buenas tardes. ¿Tienen envíos a Heredia?', time: '18:05' },
      { id: '2', sender: 'assistant', text: '¡Hola Alejandra! Sí, realizamos entregas en todo el GAM incluyendo Heredia de 24 a 48 horas.', rag_level: 'level_2_faq', time: '18:05' },
      { id: '3', sender: 'user', text: '¿Tienen entrega a domicilio hoy mismo en Heredia?', time: '18:07' },
      { id: '4', sender: 'assistant', text: 'Para entrega el mismo día puedes solicitar el servicio motorizado antes de las 2:00 PM con recargo de ₡2,500.', rag_level: 'level_2_faq', time: '18:07' }
    ]
  },
  {
    id: 'sess-95128392-preview',
    user_name: 'Daniel Solís',
    user_phone: '+506 8920-1122',
    created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    last_message: 'Quiero agendar una sesión estratégica para mi empresa.',
    last_rag_level: 'level_3_catalog',
    total_messages: 3,
    status: 'online',
    messages: [
      { id: '10', sender: 'user', text: 'Buenas, vi el servicio de automatización de ventas.', time: '18:18' },
      { id: '11', sender: 'assistant', text: '¡Bienvenido Daniel! Ofrecemos implementación de bots con IA conectados a WhatsApp y CRM.', rag_level: 'level_3_catalog', time: '18:18' },
      { id: '12', sender: 'user', text: 'Quiero agendar una sesión estratégica para mi empresa.', time: '18:19' }
    ]
  },
  {
    id: 'sess-73910381-preview',
    user_name: 'Carlos Vargas',
    user_phone: '+506 7091-2345',
    created_at: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
    last_message: 'Excelente, ya realicé el pago por Sinpe Móvil.',
    last_rag_level: 'level_3_catalog',
    total_messages: 4,
    status: 'closed',
    messages: [
      { id: '5', sender: 'user', text: '¿Qué precio tiene el Bot con RAG y qué incluye?', time: '16:45' },
      { id: '6', sender: 'assistant', text: 'El plan comercial incluye bot 24/7, memoria D1, catálogo de productos y RAG de 3 niveles por $49/mes.', rag_level: 'level_3_catalog', time: '16:45' },
      { id: '7', sender: 'user', text: 'Excelente, ya realicé el pago por Sinpe Móvil.', time: '16:48' },
      { id: '8', sender: 'assistant', text: '¡Confirmado Carlos! Tu bot ha sido activado exitosamente.', rag_level: 'level_2_faq', time: '16:49' }
    ]
  },
  {
    id: 'sess-62809270-preview',
    user_name: 'Lucía Fernández',
    user_phone: '+506 8512-3490',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    last_message: 'Muchas gracias por la información.',
    last_rag_level: 'semantic_cache',
    total_messages: 4,
    status: 'closed',
    messages: [
      { id: '20', sender: 'user', text: '¿Cuáles son los horarios de atención?', time: '14:30' },
      { id: '21', sender: 'assistant', text: 'Nuestro horario comercial es de lunes a sábado de 9:00 AM a 6:00 PM. El bot responde 24/7.', rag_level: 'semantic_cache', time: '14:30' },
      { id: '22', sender: 'user', text: 'Muchas gracias por la información.', time: '14:31' },
      { id: '23', sender: 'assistant', text: '¡Con gusto Lucía! Que tengas una excelente tarde.', rag_level: 'semantic_cache', time: '14:31' }
    ]
  },
  {
    id: 'sess-51798160-preview',
    user_name: 'Mariana Castro',
    user_phone: '+506 8765-4321',
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    last_message: '¿Tienen soporte técnico incluido?',
    last_rag_level: 'level_2_faq',
    total_messages: 2,
    status: 'closed',
    messages: [
      { id: '30', sender: 'user', text: '¿Tienen soporte técnico incluido?', time: '11:15' },
      { id: '31', sender: 'assistant', text: 'Sí Mariana, todos nuestros planes incluyen soporte prioritario 24/7 vía WhatsApp y ticket.', rag_level: 'level_2_faq', time: '11:15' }
    ]
  }
];
