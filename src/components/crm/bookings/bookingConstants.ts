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
      id: 'apt-1', clientName: 'Carlos Morales', serviceName: 'Corte Clásico & Barba',
      dateKey: todayKey, displayDate: `Hoy, ${now.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`,
      time: '14:30', status: 'confirmed', channel: 'whatsapp'
    },
    {
      id: 'apt-2', clientName: 'María Fernanda Ruiz', serviceName: 'Consulta de Valoración',
      dateKey: formatKey(tomorrow), displayDate: `Mañana, ${tomorrow.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`,
      time: '10:00', status: 'pending', channel: 'instagram'
    },
    {
      id: 'apt-3', clientName: 'David Rodríguez', serviceName: 'Asesoría Especializada',
      dateKey: formatKey(dayAfter), displayDate: dayAfterName.charAt(0).toUpperCase() + dayAfterName.slice(1),
      time: '16:00', status: 'confirmed', channel: 'web'
    }
  ];
};
