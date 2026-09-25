export interface GreetingPreset {
  id: string;
  category: string;
  title: string;
  template: string;
}

export const GREETING_PRESETS: GreetingPreset[] = [
  {
    id: 'ventas',
    category: 'Comercial & Ventas',
    title: 'Ventas y Promociones Activas',
    template: '¡Hola! 👋 Bienvenido a {negocio}. Soy tu asistente virtual. ¿Te gustaría conocer nuestros productos en catálogo o ver las promociones del día? Estoy para ayudarte a elegir.'
  },
  {
    id: 'servicios',
    category: 'Servicios & Citas',
    title: 'Asesoría y Agendamiento',
    template: '¡Hola! 🌸 Te damos la bienvenida a {negocio}. Te asesoro con gusto en cualquiera de nuestros servicios especializados. ¿Deseas consultar disponibilidad o agendar una cita?'
  },
  {
    id: 'soporte',
    category: 'Atención al Cliente',
    title: 'Soporte y Orientación Rápida',
    template: '¡Hola! 💬 Gracias por comunicarte con {negocio}. Mi misión es resolver tus dudas sobre envíos, pagos o garantías de inmediato. ¿En qué podemos apoyarte hoy?'
  },
  {
    id: 'vip',
    category: 'Elegante & VIP',
    title: 'Exclusividad y Trato Premium',
    template: '¡Bienvenido a {negocio}! ✨ Nos complace atenderte. Nuestro equipo y tecnología están a tu servicio para brindarte una experiencia ágil y personalizada. ¿Qué estás buscando hoy?'
  },
  {
    id: 'directo',
    category: 'Directo & WhatsApp',
    title: 'Minimalista y Ágil',
    template: '¡Hola! Bienvenido a {negocio}. 😊 ¿Qué producto o información necesitas en este momento?'
  }
];

export function applyGreetingTemplate(template: string, businessName: string): string {
  const cleanName = (businessName || 'nuestra tienda').trim();
  return template.replace(/\{negocio\}/g, cleanName);
}
