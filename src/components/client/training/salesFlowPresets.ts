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
