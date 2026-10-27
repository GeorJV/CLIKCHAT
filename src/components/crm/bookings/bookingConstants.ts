import { AppointmentItem } from './VoceroAppointmentCard';

export const getInitialAppointments = (): AppointmentItem[] => [];


export const BOOKING_FILTER_TABS = [
  { id: 'all', label: 'Todas' },
  { id: 'today', label: 'Hoy' },
  { id: 'tomorrow', label: 'Mañana' },
  { id: 'after', label: 'Pasado Mañana' },
  { id: 'this_week', label: 'Esta Semana' },
  { id: 'next_week', label: 'Semana Siguiente' },
] as const;
