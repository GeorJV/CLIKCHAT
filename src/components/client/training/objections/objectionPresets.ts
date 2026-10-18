export interface ObjectionPreset {
  id: string;
  trigger: string;
  answer: string;
  category: string;
  businessType: 'all' | 'products' | 'services';
}

export const OBJECTION_PRESETS: ObjectionPreset[] = [
  // Productos / Restaurantes
  {
    id: 'envios_hoy',
    trigger: '¿Hacen envíos hoy y cuánto tardan?',
    answer: '¡Sí! Realizamos envíos el mismo día si confirmas tu pedido antes de las 3:00 PM. El tiempo promedio de entrega es de 35 a 60 minutos.',
    category: 'Envíos & Logística',
    businessType: 'products'
  },
  {
    id: 'pagos_sinpe',
    trigger: '¿Qué métodos de pago reciben? ¿Aceptan Sinpe Móvil?',
    answer: 'Aceptamos Sinpe Móvil al número oficial del negocio, tarjetas de débito/crédito, transferencia bancaria y efectivo contra entrega.',
    category: 'Métodos de Pago',
    businessType: 'products'
  },
  {
    id: 'garantia_cambios',
    trigger: '¿Tienen garantía o cambio si el producto no me queda?',
    answer: '¡Claro que sí! Cuentas con garantía total y hasta 7 días naturales para solicitar cambio sin complicaciones presentando tu comprobante.',
    category: 'Garantía & Devoluciones',
    businessType: 'products'
  },

  // Servicios / Citas
  {
    id: 'agendar_cita',
    trigger: '¿Cómo agendo una cita o reservación?',
    answer: 'Puedes agendar tu cita directamente aquí con el bot indicando tu fecha y hora preferida, o con gusto te confirmamos el espacio disponible por WhatsApp.',
    category: 'Citas & Reservaciones',
    businessType: 'services'
  },
  {
    id: 'ubicacion_parqueo',
    trigger: '¿Dónde están ubicados? ¿Cuentan con parqueo?',
    answer: 'Estamos en una ubicación céntrica de fácil acceso con parqueo privado gratuito para nuestros clientes mientras reciben su atención.',
    category: 'Ubicación & Parqueo',
    businessType: 'services'
  },
  {
    id: 'politica_cancelacion',
    trigger: '¿Qué pasa si tengo que cancelar o reprogramar mi cita?',
    answer: 'No te preocupes, no cobramos penalización. Solo te pedimos avisarnos con al menos 2 horas de anticipación para reprogramar tu espacio.',
    category: 'Políticas de Cita',
    businessType: 'services'
  },
  {
    id: 'duracion_servicio',
    trigger: '¿Cuánto dura la sesión o servicio?',
    answer: 'La sesión tiene una duración promedio de 45 a 60 minutos para garantizar una atención personalizada y de máxima calidad.',
    category: 'Tiempos de Atención',
    businessType: 'services'
  },

  // Universales
  {
    id: 'horarios_feriados',
    trigger: '¿Abren hoy o en días feriados?',
    answer: 'Atendemos en nuestro horario habitual. En días feriados especiales notificamos por nuestras redes y atendemos con previa confirmación.',
    category: 'Horarios',
    businessType: 'all'
  }
];
