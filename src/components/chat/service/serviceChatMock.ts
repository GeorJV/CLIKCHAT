import { ServiceItem } from '../../../types/serviceChat';

export const DEFAULT_SERVICE: ServiceItem = {
  id: 'serv_diagnostico_facial',
  title: 'Diagnóstico Facial Clínico & Rutina Personalizada',
  category: 'Consulta Especializada',
  duration: '45 minutos',
  serviceModality: 'online',
  rating: 4.9,
  image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
  images: [
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512290900672-1f02829285fb?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80'
  ],
  benefits: [
    'Evaluación profunda de fototipo, elasticidad y nivel de hidratación cutánea.',
    'Protocolo de skincare formulado exclusivamente para tu tipo de piel.',
    'Plan de seguimiento 1 a 1 vía WhatsApp durante 30 días.'
  ],
  requirements: [
    'Conexión estable a internet para videollamada HD por Google Meet o Zoom.',
    'Rostro limpio sin maquillaje para la toma de muestras visuales.',
    'Tener a mano los productos que utilizas actualmente.'
  ],
  description: 'Sesión clínica virtual individual guiada por una especialista en dermoestética para identificar las necesidades reales de tu piel y crear un plan efectivo.'
};
