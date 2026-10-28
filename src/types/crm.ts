export type CrmStageId = 'lead' | 'qualifying' | 'proposal' | 'negotiation' | 'won' | 'lost';

export type CrmChannel = 'whatsapp' | 'web' | 'instagram' | 'clikchat';

export type TrafficSource = 'web' | 'anuncio' | 'post' | 'dm' | 'sms' | 'qr' | 'direct';

export interface CrmLead {
  id: string;
  tenant_id: string;
  session_id: string;
  name: string;
  phone: string;
  email: string;
  channel: CrmChannel;
  stage: CrmStageId;
  deal_value: number;
  tags: string[];
  notes: string;
  ai_paused: boolean;
  last_message: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  unread_count?: number;
  lead_score?: number;
  source?: TrafficSource;
  source_detail?: string;
}

export interface CrmStage {
  id: CrmStageId;
  title: string;
  label: string;
  color: string;
  bgLight: string;
  borderColor: string;
  description: string;
}

export const getCrmStages = (businessType?: string): CrmStage[] => {
  const isServices = businessType === 'servicios' || businessType === 'citas' || businessType === 'servicios_citas';
  const isFoodOrStore = businessType === 'tienda' || businessType === 'restaurante' || businessType === 'comida';

  return [
    {
      id: 'lead',
      title: 'Nuevo Lead',
      label: 'Nuevo Lead',
      color: 'text-blue-400',
      bgLight: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      description: 'Contacto recién iniciado o registrado',
    },
    {
      id: 'qualifying',
      title: 'En Calificación',
      label: 'En Calificación',
      color: 'text-amber-400',
      bgLight: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      description: 'Descubrimiento de necesidades o intereses',
    },
    {
      id: 'proposal',
      title: isServices ? 'Cita' : isFoodOrStore ? 'Comanda' : 'Comanda / Cita',
      label: isServices ? 'Cita Agendada' : isFoodOrStore ? 'Comanda Solicitada' : 'Comanda Solicitada',
      color: 'text-purple-400',
      bgLight: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      description: isServices ? 'Cita agendada o por confirmar' : isFoodOrStore ? 'Comanda armada o en preparación' : 'Comanda armada o propuesta enviada',
    },
    {
      id: 'negotiation',
      title: 'Esperando Pago',
      label: 'Esperando Pago',
      color: 'text-orange-400',
      bgLight: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      description: 'Link de pago generado o comprobante pendiente',
    },
    {
      id: 'won',
      title: 'Cerrado / Ganado',
      label: 'Cerrado Ganado',
      color: 'text-emerald-400',
      bgLight: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      description: isServices ? 'Cita exitosamente completada' : 'Venta o comanda exitosamente completada',
    },
    {
      id: 'lost',
      title: 'Perdido',
      label: 'Perdido',
      color: 'text-rose-400',
      bgLight: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
      description: 'Sin respuesta, declinado o cancelado',
    },
  ];
};

export const CRM_STAGES: CrmStage[] = getCrmStages();

export interface CrmMessage {
  id: string;
  session_id: string;
  sender: 'user' | 'assistant' | 'agent';
  message: string;
  rag_level_used?: string;
  created_at: string;
}

export type CrmInboxFilter = 'all' | 'whatsapp' | 'web' | 'human_needed' | 'won';
