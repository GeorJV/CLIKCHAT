export interface SalesFlowStep {
  step: 1 | 2 | 3 | 4;
  title: string;
  badge: string;
  instruction: string;
}

export interface SalesFlowPreset {
  id: string;
  name: string;
  businessType: string;
  description: string;
  icon: string;
  steps: [SalesFlowStep, SalesFlowStep, SalesFlowStep, SalesFlowStep];
  rules: string;
}

export function compileFourStepsToRules(steps: SalesFlowStep[]): string {
  return [
    `[ESTRATEGIA Y FLUJO CONVERSACIONAL DE VENTA EN 4 PASOS (OBLIGATORIO - RESPETA ESTE ORDEN STRICTAMENTE)]:`,
    `PASO 1 (${steps[0]?.title || 'Bienvenida y Diagnóstico'}): ${steps[0]?.instruction || ''}`,
    `PASO 2 (${steps[1]?.title || 'Presentación y Asesoría'}): ${steps[1]?.instruction || ''}`,
    `PASO 3 (${steps[2]?.title || 'Venta Cruzada o Agendamiento'}): ${steps[2]?.instruction || ''}`,
    `PASO 4 (${steps[3]?.title || 'Cierre y Comanda'}): ${steps[3]?.instruction || ''}`
  ].join('\n\n');
}

export const SALES_FLOW_PRESETS: SalesFlowPreset[] = [
  {
    id: 'flow_iq_consultivo',
    name: 'Flow IQ: Asesor Consultivo B2B',
    businessType: 'servicios',
    icon: '💼',
    description: 'Para consultorías, clínicas y servicios de alto valor: diagnóstico, valor y cierre.',
    steps: [
      {
        step: 1,
        title: 'Saludo & Diagnóstico de Necesidades',
        badge: 'Paso 1',
        instruction: 'Saluda con profesionalismo, genera confianza e indaga qué reto o necesidad busca solucionar el cliente. PROHIBIDO vender o presionar en este paso.'
      },
      {
        step: 2,
        title: 'Calificación & Diagnóstico de Requisitos',
        badge: 'Paso 2',
        instruction: 'Formula preguntas breves y pertinentes para conocer su presupuesto aproximado, urgencia e intención real antes de presentar la solución.'
      },
      {
        step: 3,
        title: 'Presentación de Solución & Valor Real',
        badge: 'Paso 3',
        instruction: 'Presenta el servicio o paquete ideal vinculando características con beneficios concretos. Resuelve objeciones con respeto y muestra garantías.'
      },
      {
        step: 4,
        title: 'Cierre Comercial & Siguiente Paso',
        badge: 'Paso 4',
        instruction: 'Propón el siguiente paso claro: agendar una llamada de valoración, enviar propuesta formal o canalizar directamente a WhatsApp.'
      }
    ],
    rules: `[FLOW IQ · ESTRATEGIA 1: ASESOR COMERCIAL CONSULTIVO]:
PASO 1 (Saludo & Diagnóstico): Saluda con calidez y genera confianza. Indaga qué reto o necesidad busca solucionar el prospecto.
PASO 2 (Calificación de Requisitos): Pregunta presupuesto, urgencia e intención sin interrogar.
PASO 3 (Solución & Demostración de Valor): Presenta la solución ideal, aclara objeciones y demuestra garantías autorizadas.
PASO 4 (Cierre & Siguiente Paso): Define el siguiente paso (reunión, cotización o canalizar a WhatsApp para contratación).`
  },
  {
    id: 'flow_iq_directa',
    name: 'Flow IQ: Venta Directa & Catálogo',
    businessType: 'tienda',
    icon: '🛍️',
    description: 'Para tiendas, retail y e-commerce: recomendación de catálogo, promociones y comanda.',
    steps: [
      {
        step: 1,
        title: 'Detección de Intención de Compra',
        badge: 'Paso 1',
        instruction: 'Saluda amigablemente y detecta qué producto o categoría le interesa al cliente. PROHIBIDO cobrar en este paso.'
      },
      {
        step: 2,
        title: 'Recomendación de Catálogo & Beneficios',
        badge: 'Paso 2',
        instruction: 'Recomienda el producto idóneo del catálogo con precio autorizado, especificaciones y disponibilidad real sin inventar.'
      },
      {
        step: 3,
        title: 'Promociones Autorizadas & Cross-Selling',
        badge: 'Paso 3',
        instruction: 'Ofrece complementos, accesorios o promociones autorizadas por el negocio si el cliente está interesado.'
      },
      {
        step: 4,
        title: 'Armado de Pedido & Cierre en WhatsApp',
        badge: 'Paso 4',
        instruction: 'Resume el pedido con el total a pagar y canaliza con un enlace directo a WhatsApp para pago y envío.'
      }
    ],
    rules: `[FLOW IQ · ESTRATEGIA 2: VENTA DIRECTA Y CIERRE]:
PASO 1 (Detección de Intención): Saluda y detecta qué busca el cliente.
PASO 2 (Recomendación & Catálogo): Muestra productos disponibles con precios reales y fotos si corresponde.
PASO 3 (Promociones & Accesorios): Presenta promociones autorizadas y resuelve dudas de despacho o pago.
PASO 4 (Cierre & WhatsApp): Resume el pedido y canaliza al WhatsApp oficial para completar el cobro.`
  },
  {
    id: 'flow_iq_agendamiento',
    name: 'Flow IQ: Citas & Agendamiento',
    businessType: 'citas',
    icon: '📅',
    description: 'Para dentistas, médicos, spas y salones: captación, disponibilidad y confirmación.',
    steps: [
      {
        step: 1,
        title: 'Identificar Servicio & Urgencia',
        badge: 'Paso 1',
        instruction: 'Saluda con empatía, consulta el servicio deseado o motivo de la visita y evalúa si es una urgencia o atención regular.'
      },
      {
        step: 2,
        title: 'Recopilar Datos Pertinentes',
        badge: 'Paso 2',
        instruction: 'Solicita el nombre del titular y día de preferencia de forma ágil y natural.'
      },
      {
        step: 3,
        title: 'Verificar Disponibilidad & Horarios',
        badge: 'Paso 3',
        instruction: 'Ofrece 2 o 3 opciones de horario reales disponibles para que el paciente o cliente elija la más conveniente.'
      },
      {
        step: 4,
        title: 'Reserva & Confirmación Oficial',
        badge: 'Paso 4',
        instruction: 'Confirma la cita con fecha, hora, ubicación y envía el recordatorio por WhatsApp con políticas de asistencia.'
      }
    ],
    rules: `[FLOW IQ · ESTRATEGIA 3: CAPTACIÓN Y AGENDAMIENTO]:
PASO 1 (Identificar Necesidad): Saluda y pregunta el motivo de la cita o servicio requerido.
PASO 2 (Recopilar Datos): Solicita nombre del paciente/cliente y día preferido.
PASO 3 (Disponibilidad Real): Presenta opciones concretas de horario para evitar idas y vueltas.
PASO 4 (Confirmar Reserva): Confirma el turno agendado y canaliza a WhatsApp para registro y recordatorio.`
  },
  {
    id: 'restaurante_upsell',
    name: 'Restaurante & Comida (Cross-selling)',
    businessType: 'restaurante',
    icon: '🍔',
    description: 'Atención como mesero, venta de bebidas/acompañamientos y comanda oficial.',
    steps: [
      {
        step: 1,
        title: 'Bienvenida & Apertura',
        badge: 'Paso 1',
        instruction: 'Saluda con calidez y dinamismo como un mesero atento. Pregunta qué se le antoja degustar hoy. PROHIBIDO cobrar o pedir datos en este paso.'
      },
      {
        step: 2,
        title: 'Asesoría del Menú & Precios',
        badge: 'Paso 2',
        instruction: 'Muestra opciones del menú, platillos destacados e ingredientes con precios reales. Resuelve dudas sobre preparación o salsas.'
      },
      {
        step: 3,
        title: 'Venta Cruzada Condicional (Upsell)',
        badge: 'Paso 3',
        instruction: 'ÚNICAMENTE después de que el comensal elija un platillo, ofrece acompañamientos o bebidas (ej: "¿Te gustaría agregar bebida o papas adicionales?"). PROHIBIDO antes.'
      },
      {
        step: 4,
        title: 'Cierre, Comanda & WhatsApp',
        badge: 'Paso 4',
        instruction: 'Pregunta si es para comer aquí o express, resume la comanda con "¿Cuánto es?" y canaliza al WhatsApp oficial para pago y despacho.'
      }
    ],
    rules: `[ESTRATEGIA Y FLUJO CONVERSACIONAL DE VENTA EN 4 PASOS (OBLIGATORIO - RESPETA ESTE ORDEN STRICTAMENTE)]:
PASO 1 (Bienvenida & Apertura): Saluda con calidez y dinamismo como un mesero atento. Pregunta qué se le antoja degustar hoy. PROHIBIDO cobrar o pedir datos en este paso.

PASO 2 (Asesoría del Menú & Precios): Muestra opciones del menú, platillos destacados e ingredientes con precios reales. Resuelve dudas sobre preparación o salsas.

PASO 3 (Venta Cruzada Condicional): ÚNICAMENTE después de que el comensal elija un platillo, ofrece acompañamientos o bebidas (ej: "¿Te gustaría agregar bebida o papas adicionales?"). PROHIBIDO antes.

PASO 4 (Cierre, Comanda & WhatsApp): Pregunta si es para comer aquí o express, resume la comanda con "¿Cuánto es?" y canaliza al WhatsApp oficial para pago y despacho.`
  },
  {
    id: 'tienda_ecommerce',
    name: 'Tienda & Catálogo (Productos)',
    businessType: 'tienda',
    icon: '🛍️',
    description: 'Diagnóstico de compra, beneficios, sugerencia de accesorios y envío.',
    steps: [
      {
        step: 1,
        title: 'Bienvenida & Diagnóstico',
        badge: 'Paso 1',
        instruction: 'Saluda amablemente y haz una pregunta abierta para entender qué producto o artículo está buscando el cliente sin apresurarlo a comprar.'
      },
      {
        step: 2,
        title: 'Presentación & Beneficios',
        badge: 'Paso 2',
        instruction: 'Muestra el artículo exacto del catálogo con su precio oficial, stock disponible y valor diferencial frente a otras opciones.'
      },
      {
        step: 3,
        title: 'Venta Cruzada & Envío',
        badge: 'Paso 3',
        instruction: 'Sugiere un accesorio o producto complementario del catálogo y consulta la provincia o cantón de entrega para coordinar el envío.'
      },
      {
        step: 4,
        title: 'Cierre & Canalización a WhatsApp',
        badge: 'Paso 4',
        instruction: 'Confirma la intención de compra, resume el pedido y canaliza al cliente al botón de WhatsApp con comprobante para despacho inmediato.'
      }
    ],
    rules: `[ESTRATEGIA Y FLUJO CONVERSACIONAL DE VENTA EN 4 PASOS (OBLIGATORIO - RESPETA ESTE ORDEN STRICTAMENTE)]:
PASO 1 (Bienvenida & Diagnóstico): Saluda amablemente y haz una pregunta abierta para entender qué producto o artículo está buscando el cliente sin apresurarlo a comprar.

PASO 2 (Presentación & Beneficios): Muestra el artículo exacto del catálogo con su precio oficial, stock disponible y valor diferencial frente a otras opciones.

PASO 3 (Venta Cruzada & Envío): Sugiere un accesorio o producto complementario del catálogo y consulta la provincia o cantón de entrega para coordinar el envío.

PASO 4 (Cierre & Canalización a WhatsApp): Confirma la intención de compra, resume el pedido y canaliza al cliente al botón de WhatsApp con comprobante para despacho inmediato.`
  },
  {
    id: 'servicios_citas',
    name: 'Servicios & Agendamiento de Citas',
    businessType: 'servicios',
    icon: '📅',
    description: 'Calificación de necesidad, propuesta con tarifas y reserva de horario.',
    steps: [
      {
        step: 1,
        title: 'Bienvenida & Diagnóstico',
        badge: 'Paso 1',
        instruction: 'Saluda profesionalmente y consulta brevemente la necesidad o situación específica que el cliente desea solucionar con el servicio.'
      },
      {
        step: 2,
        title: 'Propuesta de Servicio & Tarifas',
        badge: 'Paso 2',
        instruction: 'Explica el servicio o paquete más adecuado, detallando qué incluye, duración estimada y tarifa oficial.'
      },
      {
        step: 3,
        title: 'Agendamiento Activo (2 Opciones)',
        badge: 'Paso 3',
        instruction: 'Ofrece activamente 2 opciones de horario o fecha (ej: "¿Te queda más cómodo en horario de la mañana o en la tarde?").'
      },
      {
        step: 4,
        title: 'Confirmación Provisional & WhatsApp',
        badge: 'Paso 4',
        instruction: 'Solicita nombre completo y teléfono, confirma la reserva provisional y canaliza al WhatsApp oficial para registrar en agenda.'
      }
    ],
    rules: `[ESTRATEGIA Y FLUJO CONVERSACIONAL DE VENTA EN 4 PASOS (OBLIGATORIO - RESPETA ESTE ORDEN STRICTAMENTE)]:
PASO 1 (Bienvenida & Diagnóstico): Saluda profesionalmente y consulta brevemente la necesidad o situación específica que el cliente desea solucionar con el servicio.

PASO 2 (Propuesta de Servicio & Tarifas): Explica el servicio o paquete más adecuado, detallando qué incluye, duración estimada y tarifa oficial.

PASO 3 (Agendamiento Activo): Ofrece activamente 2 opciones de horario o fecha (ej: "¿Te queda más cómodo en horario de la mañana o en la tarde?").

PASO 4 (Confirmación Provisional & WhatsApp): Solicita nombre completo y teléfono, confirma la reserva provisional y canaliza al WhatsApp oficial para registrar en agenda.`
  },
  {
    id: 'soporte_asesor',
    name: 'Servicio al Cliente & Asesoría',
    businessType: 'soporte',
    icon: '💬',
    description: 'Resolución de dudas frecuentes, soporte ágil y derivación a asesor humano.',
    steps: [
      {
        step: 1,
        title: 'Recepción Empática & Escucha',
        badge: 'Paso 1',
        instruction: 'Saluda con cortesía y escucha activamente la consulta o duda del cliente sin emitir respuestas genéricas ni presionar a comprar.'
      },
      {
        step: 2,
        title: 'Resolución Clara & Verificada',
        badge: 'Paso 2',
        instruction: 'Responde con precisión basándote en la base de conocimientos y políticas oficiales del comercio, sin inventar información.'
      },
      {
        step: 3,
        title: 'Verificación de Claridad',
        badge: 'Paso 3',
        instruction: 'Pregunta amablemente si la explicación fue suficiente o si tiene alguna otra consulta adicional pendiente de resolver.'
      },
      {
        step: 4,
        title: 'Canalización a Asesor Humano',
        badge: 'Paso 4',
        instruction: 'Si la consulta requiere trámite especial o seguimiento personalizado, ofrece conectar al cliente con un asesor humano en WhatsApp.'
      }
    ],
    rules: `[ESTRATEGIA Y FLUJO CONVERSACIONAL DE VENTA EN 4 PASOS (OBLIGATORIO - RESPETA ESTE ORDEN STRICTAMENTE)]:
PASO 1 (Recepción Empática & Escucha): Saluda con cortesía y escucha activamente la consulta o duda del cliente sin emitir respuestas genéricas ni presionar a comprar.

PASO 2 (Resolución Clara & Verificada): Responde con precisión basándote en la base de conocimientos y políticas oficiales del comercio, sin inventar información.

PASO 3 (Verificación de Claridad): Pregunta amablemente si la explicación fue suficiente o si tiene alguna otra consulta adicional pendiente de resolver.

PASO 4 (Canalización a Asesor Humano): Si la consulta requiere trámite especial o seguimiento personalizado, ofrece conectar al cliente con un asesor humano en WhatsApp.`
  }
];

export function parseRulesToFourSteps(rawRules: string, fallbackSteps: [SalesFlowStep, SalesFlowStep, SalesFlowStep, SalesFlowStep]): [SalesFlowStep, SalesFlowStep, SalesFlowStep, SalesFlowStep] {
  if (!rawRules || !rawRules.includes('PASO 1')) {
    return fallbackSteps;
  }

  const p1Match = rawRules.match(/PASO 1\s*(?:\(([^)]+)\))?:\s*([\s\S]*?)(?=PASO 2|$)/i);
  const p2Match = rawRules.match(/PASO 2\s*(?:\(([^)]+)\))?:\s*([\s\S]*?)(?=PASO 3|$)/i);
  const p3Match = rawRules.match(/PASO 3\s*(?:\(([^)]+)\))?:\s*([\s\S]*?)(?=PASO 4|$)/i);
  const p4Match = rawRules.match(/PASO 4\s*(?:\(([^)]+)\))?:\s*([\s\S]*?)$/i);

  return [
    {
      step: 1,
      title: p1Match?.[1]?.trim() || fallbackSteps[0].title,
      badge: 'Paso 1',
      instruction: p1Match?.[2]?.trim() || fallbackSteps[0].instruction
    },
    {
      step: 2,
      title: p2Match?.[1]?.trim() || fallbackSteps[1].title,
      badge: 'Paso 2',
      instruction: p2Match?.[2]?.trim() || fallbackSteps[1].instruction
    },
    {
      step: 3,
      title: p3Match?.[1]?.trim() || fallbackSteps[2].title,
      badge: 'Paso 3',
      instruction: p3Match?.[2]?.trim() || fallbackSteps[2].instruction
    },
    {
      step: 4,
      title: p4Match?.[1]?.trim() || fallbackSteps[3].title,
      badge: 'Paso 4',
      instruction: p4Match?.[2]?.trim() || fallbackSteps[3].instruction
    }
  ];
}
