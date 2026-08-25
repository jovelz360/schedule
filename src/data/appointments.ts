export type AppointmentStatus = 'underReview' | 'approved' | 'rejected';

export type Appointment = {
  id: string;
  venue: string;
  type: string;
  mission: string;
  reason: string;
  date: string;
  from: string;
  until: string;
  notes: string;
  status: AppointmentStatus;
};

let appointments: Appointment[] = [];
const listeners = new Set<() => void>();

export function getAppointments() {
  return appointments;
}

export function addAppointment(appointment: Omit<Appointment, 'id' | 'status'>) {
  appointments = [
    {
      ...appointment,
      id: `${Date.now()}`,
      status: 'underReview',
    },
    ...appointments,
  ];
  listeners.forEach((listener) => listener());
}

export function approveAppointment(id: string) {
  appointments = appointments.map((appointment) =>
    appointment.id === id ? { ...appointment, status: 'approved' } : appointment,
  );
  listeners.forEach((listener) => listener());
}

export function rejectAppointment(id: string) {
  appointments = appointments.map((appointment) =>
    appointment.id === id ? { ...appointment, status: 'rejected' } : appointment,
  );
  listeners.forEach((listener) => listener());
}

export function updateAppointment(id: string, updates: Omit<Appointment, 'id' | 'status'>) {
  appointments = appointments.map((appointment) =>
    appointment.id === id ? { ...appointment, ...updates } : appointment,
  );
  listeners.forEach((listener) => listener());
}

export function subscribeToAppointments(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}