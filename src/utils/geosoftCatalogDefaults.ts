import { Product, FAQ } from '../types';

export const DEFAULT_GEOSOFT_PRODUCTS: Product[] = [
  {
    id: 'prod_geosoft_web_saas',
    tenant_id: 'ten_geosoft_prod',
    name: 'Desarrollo Web & Plataformas SaaS a Medida',
    slug: 'desarrollo-web-saas',
    price: 1200,
    currency: 'USD',
    short_description: 'Desarrollo de aplicaciones web de alto rendimiento, portales empresariales y sistemas SaaS completos construidos con arquitectura modular, escalabilidad en la nube y máxima velocidad.',
    full_description: 'Creamos aplicaciones web profesionales y escalables utilizando las tecnologías más avanzadas del mercado (React, TypeScript, Cloudflare Edge, Node.js y bases de datos distribuidas). Incluye diseño responsivo premium, autenticación segura, panel de administración para el dueño, optimización SEO y despliegue global con 99.9% de uptime.',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'],
    benefits: ['Entrega en 2 a 4 semanas', 'Garantía de 3 meses incluida', 'Arquitectura modular escalable'],
    details: { category: 'Desarrollo de Software', tiempo_entrega: '2 a 4 semanas', soporte: 'Garantía de 3 meses incluida' },
    cta_label: 'Cotizar Proyecto',
    cta_url: 'https://wa.me/50672935612?text=Hola%20GeoSoft,%20me%20interesa%20Desarrollo%20Web',
    is_active: true
  },
  {
    id: 'prod_geosoft_agentes_ia',
    tenant_id: 'ten_geosoft_prod',
    name: 'Agentes de Inteligencia Artificial & Bots de Ventas 24/7',
    slug: 'agentes-ia-ventas',
    price: 450,
    currency: 'USD',
    short_description: 'Implementación de asistentes conversacionales con IA avanzada, calibrados con la base de conocimiento de tu empresa (RAG) para atención, captura de prospectos y ventas automáticas en WhatsApp y Web.',
    full_description: 'Automatiza la atención y captación de clientes de tu empresa con un Agente de IA personalizado. Capaz de entender contexto comercial, consultar catálogos en tiempo real, responder preguntas complejas sobre políticas o precios, y sincronizar leads calificados directamente a tu CRM.',
    images: ['https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80'],
    benefits: ['Operativo 24/7 sin descanso', 'Integración WhatsApp y Web', 'Sincronizado a CRM'],
    details: { category: 'Inteligencia Artificial', canales: 'WhatsApp, Web, Instagram', integracion: 'CRM y base de datos' },
    cta_label: 'Implementar Agente',
    cta_url: 'https://wa.me/50672935612?text=Hola%20GeoSoft,%20me%20interesa%20un%20Agente%20de%20IA',
    is_active: true
  },
  {
    id: 'prod_geosoft_apps_moviles',
    tenant_id: 'ten_geosoft_prod',
    name: 'Desarrollo de Aplicaciones Móviles (iOS & Android)',
    slug: 'apps-moviles-ios-android',
    price: 1800,
    currency: 'USD',
    short_description: 'Aplicaciones móviles nativas y multiplataforma fluidas, intuitivas y conectadas en tiempo real a tus sistemas empresariales.',
    full_description: 'Desarrollo integral de apps móviles para iOS y Android con Flutter o React Native. Experiencias táctiles de primer nivel, notificaciones push, modo offline, pasarelas de pago y publicación guiada en App Store y Google Play.',
    images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80'],
    benefits: ['iOS y Android nativo', 'Notificaciones Push y Pagos', 'Asistencia en tiendas App Store / Play Store'],
    details: { category: 'Aplicaciones Móviles', plataformas: 'iOS y Android', publicacion: 'Asistencia en tiendas incluida' },
    cta_label: 'Crear App Móvil',
    cta_url: 'https://wa.me/50672935612?text=Hola%20GeoSoft,%20me%20interesa%20una%20App%20Móvil',
    is_active: true
  },
  {
    id: 'prod_1793142967893',
    tenant_id: 'ten_geosoft_prod',
    name: 'Desarrollo Web Estático (Página Web Estática)',
    slug: 'desarrollo-web-estatico',
    price: 300,
    currency: 'USD',
    short_description: 'Página web estática de hasta 5 páginas independientes, ultra rápida, con verificación de mensajes y panel propio de administrador.',
    full_description: 'Página web estática de 5 páginas independientes. Incluye diseño responsivo premium, carga ultra rápida, verificación de mensajes entrantes, panel propio de administrador, dominio y hosting gratis el primer año y soporte continuo.',
    images: ['https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop&q=80'],
    benefits: ['Página web ultra rápida', 'Dominio y hosting gratis primer año', 'Soporte continuo y panel propio'],
    details: { category: 'Desarrollo Web', sku: 'SKU-591979', tiempo_entrega: '1 a 2 semanas', soporte: 'Soporte continuo incluido' },
    cta_label: 'Cotizar Web Estática',
    cta_url: 'https://wa.me/50672935612?text=Hola%20GeoSoft,%20me%20interesa%20Desarrollo%20Web%20Est%C3%A1tico',
    is_active: true
  }
];

export const DEFAULT_GEOSOFT_FAQS: FAQ[] = [
  {
    id: 'faq_geosoft_1',
    tenant_id: 'ten_geosoft_prod',
    question: '¿Qué incluye el servicio de desarrollo web y SaaS?',
    answer: 'Incluye arquitectura modular moderna en React/TypeScript, despliegue global en la nube (Cloudflare Edge / Vercel), panel administrativo para el dueño, base de datos en tiempo real, SEO técnico y 3 meses de garantía y soporte total.',
    category: 'Servicios'
  },
  {
    id: 'faq_geosoft_2',
    tenant_id: 'ten_geosoft_prod',
    question: '¿Cuáles son los tiempos de entrega de los proyectos?',
    answer: 'El desarrollo de plataformas web y SaaS toma de 2 a 4 semanas según el alcance. Los Agentes de IA y bots de ventas se entregan e integran en 5 a 7 días hábiles.',
    category: 'Tiempos'
  },
  {
    id: 'faq_geosoft_3',
    tenant_id: 'ten_geosoft_prod',
    question: '¿Cómo se agenda una cita de asesoría estratégica?',
    answer: 'Puedes agendarla directamente a través de nuestro chat conversacional indicando tu nombre, correo, WhatsApp y el día/horario de tu preferencia. Nuestro asesor virtual verificará la disponibilidad y confirmará tu espacio en tiempo real.',
    category: 'Citas'
  },
  {
    id: 'faq_geosoft_4',
    tenant_id: 'ten_geosoft_prod',
    question: '¿Qué métodos de pago y modalidades ofrecen?',
    answer: 'Trabajamos con pagos por hitos (50% anticipo al iniciar y 50% contra entrega a satisfacción). Aceptamos transferencia bancaria, tarjetas de crédito/débito y pagos internacionales vía Stripe o PayPal.',
    category: 'Pagos'
  }
];
