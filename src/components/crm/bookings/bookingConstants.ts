import { AppointmentItem } from './VoceroAppointmentCard';

export const getInitialAppointments = (): AppointmentItem[] => {
  const now = new Date();
  const formatKey = (d: Date) => d.toISOString().slice(0, 10);
  const todayKey = formatKey(now);

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const dayAfter = new Date(now);
  dayAfter.setDate(now.getDate() + 2);
  const dayAfterName = dayAfter.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });

  return [
    {
      id: 'apt-1',
      clientName: 'Carlos Morales',
      serviceName: 'Corte Clásico & Barba',
      dateKey: todayKey,
      displayDate: `Hoy, ${now.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`,
      time: '14:30',
      status: 'confirmed',
      channel: 'whatsapp',
      phone: '+52 55 1234 5678',
      notes: 'Perfilado de barba con toalla caliente y corte degradado clásico. Cliente recurrente agendado vía bot de WhatsApp.',
      price: 350,
    },
    {
      id: 'apt-2',
      clientName: 'María Fernanda Ruiz',
      serviceName: 'Consulta de Valoración',
      dateKey: formatKey(tomorrow),
      displayDate: `Mañana, ${tomorrow.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`,
      time: '10:00',
      status: 'pending',
      channel: 'instagram',
      phone: '+52 55 9876 5432',
      notes: 'Primera sesión diagnóstica. Solicita cotización de tratamiento integral y opciones de financiamiento.',
      price: 500,
    },
    {
      id: 'apt-3',
      clientName: 'David Rodríguez',
      serviceName: 'Asesoría Especializada',
      dateKey: formatKey(dayAfter),
      displayDate: dayAfterName.charAt(0).toUpperCase() + dayAfterName.slice(1),
      time: '16:00',
      status: 'confirmed',
      channel: 'web',
      phone: '+52 55 4567 8901',
      notes: 'Revisión técnica de especificaciones de proyecto y propuesta de implementación SaaS para empresa.',
      price: 1200,
    },
  ];
};


export const BOOKING_FILTER_TABS = [
  { id: 'all', label: 'Todas' },
  { id: 'today', label: 'Hoy' },
  { id: 'tomorrow', label: 'Mañana' },
  { id: 'after', label: 'Pasado Mañana' },
  { id: 'this_week', label: 'Esta Semana' },
  { id: 'next_week', label: 'Semana Siguiente' },
] as const;
