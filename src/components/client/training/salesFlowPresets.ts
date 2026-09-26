export interface SalesFlowPreset {
  id: string;
  name: string;
  businessType: string;
  description: string;
  icon: string;
  rules: string;
}

export const SALES_FLOW_PRESETS: SalesFlowPreset[] = [
  {
    id: 'restaurante_upsell',
    name: 'Restaurante & Comida (Cross-selling)',
    businessType: 'restaurante',
    icon: '🍔',
    description: 'Sugerencia automática de bebidas/papas, consulta de express o en mesa y cierre con comanda.',
    rules: `1. PROTOCOLO DE VENTA ACTIVA EN RESTAURANTE:
- Sé amable, rápido y persuasivo. Evita respuestas secas.
- Cross-Selling Obligatorio: Al consultar o pedir un platillo principal (ej. hamburguesa, pizza, casado), sugiere siempre un acompañamiento (papas, aros de cebolla), bebida o postre del menú.
- Preguntas de Avance: Finaliza cada turno invitando a sumarlo a la orden o preguntando: "¿Es para entrega express a domicilio o para llevar?".
- Orientación al Cierre: Cuando el cliente tenga su pedido listo, recuérdale consultar el total con "¿Cuánto es?" para generar su comanda oficial y proceder al pago por Sinpe Móvil.`
  },
  {
    id: 'tienda_ecommerce',
    name: 'Tienda & Catálogo (Venta Proactiva)',
    businessType: 'tienda',
    icon: '🛍️',
    description: 'Resalta beneficios únicos, sugiere accesorios complementarios y guía al apartado/envío.',
    rules: `1. PROTOCOLO DE VENTA EN TIENDA / CATÁLOGO:
- Destaca el beneficio principal de inmediato y aclara dudas sobre características o garantía.
- Venta Cruzada: Si consulta un artículo, menciona una opción complementaria o accesorio recomendado.
- Preguntas de Avance: Pregunta si desea apartar su unidad o si prefiere coordinar el envío a su provincia o cantón.
- Conducción a Cierre: Explica la facilidad de pago y confirma que el envío se despacha de inmediato con el comprobante.`
  },
  {
    id: 'servicios_citas',
    name: 'Servicios & Agendamiento de Citas',
    businessType: 'servicios',
    icon: '📅',
    description: 'Califica la necesidad del cliente, propone el paquete adecuado y agenda fecha/hora.',
    rules: `1. PROTOCOLO DE CONVERSIÓN EN SERVICIOS:
- Indaga brevemente la necesidad o situación actual del cliente para recomendar el servicio más conveniente.
- Explica el valor diferencial y lo que incluye el paquete.
- Preguntas de Avance: Ofrece 2 opciones de horario o fecha (ej: "¿Te queda mejor en la mañana o en la tarde?").
- Conducción a Cierre: Toma los datos de contacto y confirma la reserva provisionalmente.`
  }
];
