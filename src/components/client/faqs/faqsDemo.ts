import { FAQ } from '../../../types';

export const DEFAULT_FAQS: FAQ[] = [
  {
    id: 'faq_default_1',
    tenant_id: 'tenant-demo',
    question: '¿Cuáles son los métodos de pago aceptados?',
    answer: 'Aceptamos transferencias bancarias, Sinpe Móvil y tarjetas de crédito o débito Visa y Mastercard.',
    category: 'pagos',
    confidence_threshold: 0.65,
    source: 'manual'
  },
  {
    id: 'faq_default_2',
    tenant_id: 'tenant-demo',
    question: '¿Hacen envíos a todo el país y cuánto tardan?',
    answer: 'Sí, realizamos envíos seguros a todo el país con entrega de 24 a 48 horas hábiles mediante mensajería y Correos.',
    category: 'envios',
    confidence_threshold: 0.65,
    source: 'manual'
  },
  {
    id: 'faq_default_3',
    tenant_id: 'tenant-demo',
    question: '¿Cómo funciona la garantía y el soporte técnico?',
    answer: 'Todos nuestros productos y servicios cuentan con garantía oficial y soporte técnico directo 24/7.',
    category: 'garantia',
    confidence_threshold: 0.65,
    source: 'manual'
  }
];
