import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Nav from '../components/nav';
import { approveAppointment, getAppointments, subscribeToAppointments, type Appointment } from '../data/appointments';

export default function SecretaryDashBoard() {
  const [appointments, setAppointments] = useState<Appointment[]>(getAppointments());
  const [filterDate, setFilterDate] = useState('');
  const [showFilterPicker, setShowFilterPicker] = useState(false);

  useEffect(() => subscribeToAppointments(() => setAppointments([...getAppointments()])), []);

  const visibleAppointments = filterDate
    ? appointments.filter((appointment) => appointment.date === filterDate)
    : appointments;
  const underReview = visibleAppointments.filter((appointment) => appointment.status === 'underReview');
  const approved = visibleAppointments.filter((appointment) => appointment.status === 'approved');

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Secretarial Panel</Text>

        <View style={styles.filterRow}>
          <Pressable style={styles.filterField} onPress={() => setShowFilterPicker(true)}>
            <Ionicons name="calendar-outline" size={18} color="#667085" />
            <Text style={filterDate ? styles.filterText : styles.filterPlaceholder}>
              {filterDate || 'Filter by date'}
            </Text>
          </Pressable>
          {filterDate ? (
            <Pressable style={styles.clearFilter} onPress={() => setFilterDate('')}>
              <Ionicons name="close-circle" size={22} color="#667085" />
            </Pressable>
          ) : null}
        </View>

        {showFilterPicker ? (
          Platform.OS === 'web' ? (
            <CalendarModal
              selectedDate={filterDate ? parseDate(filterDate) : undefined}
              onSelect={(selectedDate) => {
                setFilterDate(formatDate(selectedDate));
                setShowFilterPicker(false);
              }}
              onClose={() => setShowFilterPicker(false)}
            />
          ) : (
            <DateTimePicker
              value={filterDate ? parseDate(filterDate) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
              onChange={(event, selectedDate) => {
                setShowFilterPicker(false);
                if (event.type === 'set' && selectedDate) setFilterDate(formatDate(selectedDate));
              }}
            />
          )
        ) : null}

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{underReview.length}</Text>
            <View style={styles.summaryLabelRow}>
              <Ionicons name="time-outline" size={15} color="#2563eb" />
              <Text style={styles.summaryLabel}>Under review</Text>
            </View>
          </View>
          <View style={[styles.summaryCard, styles.approvedCard]}>
            <Text style={[styles.summaryNumber, styles.approvedNumber]}>{approved.length}</Text>
            <View style={styles.summaryLabelRow}>
              <Ionicons name="checkmark-circle-outline" size={15} color="#16a34a" />
              <Text style={styles.summaryLabel}>Approved</Text>
            </View>
          </View>
        </View>

        <Section title="Appointments under review" count={underReview.length}>
          {underReview.length === 0 ? (
            <EmptyState text="No appointments under review" />
          ) : (
            underReview.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} onApprove={() => approveAppointment(appointment.id)} />
            ))
          )}
        </Section>

        <Section title="Approved dates" count={approved.length}>
          {approved.length === 0 ? (
            <EmptyState text="No approved appointments" />
          ) : (
            approved.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} />)
          )}
        </Section>
      </ScrollView>

      <Nav activeTab="SecretaryDashBoard" />
    </View>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.countBadge}><Text style={styles.countText}>{count}</Text></View>
      </View>
      {children}
    </View>
  );
}

function AppointmentCard({ appointment, onApprove }: { appointment: Appointment; onApprove?: () => void }) {
  return (
    <View style={styles.appointmentCard}>
      <View style={styles.cardTopRow}>
        <View style={styles.statusPill}>
          <Ionicons name={appointment.status === 'approved' ? 'checkmark-circle-outline' : 'time-outline'} size={14} color={appointment.status === 'approved' ? '#16a34a' : '#2563eb'} />
          <Text style={[styles.statusText, appointment.status === 'approved' && styles.approvedStatusText]}>
            {appointment.status === 'approved' ? 'Approved' : 'Under review'}
          </Text>
        </View>
        <Text style={styles.date}>{appointment.date}</Text>
      </View>
      <Text style={styles.cardTitle}>{appointment.type}</Text>
      <Text style={styles.mission}>{appointment.mission}</Text>
      <View style={styles.detailGrid}>
        <Detail icon="location-outline" value={appointment.venue} />
        <Detail icon="time-outline" value={`${appointment.from} - ${appointment.until}`} />
      </View>
      <Text style={styles.reason}>{appointment.reason}</Text>
      {appointment.notes ? <Text style={styles.notes}>Note: {appointment.notes}</Text> : null}
      {onApprove ? (
        <Pressable style={styles.approveButton} onPress={onApprove}>
          <Ionicons name="checkmark" size={17} color="#ffffff" />
          <Text style={styles.approveButtonText}>Approve request</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function Detail({ icon, value }: { icon: 'location-outline' | 'time-outline'; value: string }) {
  return (
    <View style={styles.detail}>
      <Ionicons name={icon} size={16} color="#667085" />
      <Text style={styles.detailText} numberOfLines={2}>{value}</Text>
    </View>
  );
}

function EmptyState({ text }: { text: string }) {
  return <Text style={styles.emptyState}>{text}</Text>;
}

function parseDate(value: string) {
  const [month, day, year] = value.split('/').map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(value: Date) {
  return [value.getMonth() + 1, value.getDate(), value.getFullYear()]
    .map((part, index) => (index < 2 ? String(part).padStart(2, '0') : String(part)))
    .join('/');
}

function CalendarModal({
  selectedDate,
  onSelect,
  onClose,
}: {
  selectedDate?: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}) {
  const initialDate = selectedDate || new Date();
  const [month, setMonth] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const today = new Date();
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: firstDay + daysInMonth }, (_, index) =>
    index < firstDay ? null : index - firstDay + 1,
  );

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.calendarBackdrop} onPress={onClose}>
        <Pressable style={styles.calendarCard} onPress={(event) => event.stopPropagation()}>
          <View style={styles.calendarHeader}>
            <Text style={styles.calendarTitle}>
              {month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </Text>
            <View style={styles.monthActions}>
              <Pressable
                style={styles.monthButton}
                onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
              >
                <Ionicons name="chevron-back" size={18} color="#344054" />
              </Pressable>
              <Pressable
                style={styles.monthButton}
                onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
              >
                <Ionicons name="chevron-forward" size={18} color="#344054" />
              </Pressable>
            </View>
          </View>
          <View style={styles.weekRow}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <Text key={`${day}-${index}`} style={styles.weekDay}>{day}</Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {days.map((day, index) => {
              if (!day) return <View key={`empty-${index}`} style={styles.dayCell} />;
              const current = new Date(month.getFullYear(), month.getMonth(), day);
              const isPast = current < new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const isSelected = selectedDate && current.toDateString() === selectedDate.toDateString();
              return (
                <Pressable
                  key={day}
                  disabled={isPast}
                  style={[styles.dayCell, isSelected && styles.selectedDay]}
                  onPress={() => onSelect(current)}
                >
                  <Text style={[styles.dayText, isPast && styles.pastDay, isSelected && styles.selectedDayText]}>{day}</Text>
                </Pressable>
              );
            })}
          </View>
          <Pressable style={styles.cancelCalendar} onPress={onClose}>
            <Text style={styles.cancelCalendarText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f3f5f7' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 132 },
  title: { color: '#172033', fontSize: 27, fontWeight: '800', marginBottom: 20 },
  filterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  filterField: { flex: 1, minHeight: 48, borderWidth: 1, borderColor: '#d0d5dd', borderRadius: 10, backgroundColor: '#ffffff', flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 13 },
  filterText: { color: '#172033', fontSize: 14 },
  filterPlaceholder: { color: '#98a2b3', fontSize: 14 },
  clearFilter: { marginLeft: 8 },
  calendarBackdrop: { flex: 1, backgroundColor: 'rgba(16, 24, 40, 0.42)', justifyContent: 'center', padding: 20 },
  calendarCard: { backgroundColor: '#ffffff', borderRadius: 18, padding: 18 },
  calendarHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  calendarTitle: { color: '#172033', fontSize: 18, fontWeight: '800' },
  monthActions: { flexDirection: 'row', gap: 6 },
  monthButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#f2f4f7', alignItems: 'center', justifyContent: 'center' },
  weekRow: { flexDirection: 'row', marginTop: 14, marginBottom: 6 },
  weekDay: { flex: 1, textAlign: 'center', color: '#667085', fontSize: 12, fontWeight: '700' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.285%', height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 21 },
  dayText: { color: '#344054', fontSize: 14 },
  pastDay: { color: '#d0d5dd' },
  selectedDay: { backgroundColor: '#2563eb' },
  selectedDayText: { color: '#ffffff', fontWeight: '800' },
  cancelCalendar: { alignSelf: 'flex-end', paddingHorizontal: 10, paddingTop: 12 },
  cancelCalendarText: { color: '#667085', fontSize: 14, fontWeight: '700' },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  summaryCard: { flex: 1, minHeight: 86, backgroundColor: '#e8f1ff', borderRadius: 15, padding: 14, borderWidth: 1, borderColor: '#bfdbfe' },
  approvedCard: { backgroundColor: '#ecfdf3', borderColor: '#bbf7d0' },
  summaryNumber: { color: '#2563eb', fontSize: 24, fontWeight: '800' },
  approvedNumber: { color: '#16a34a' },
  summaryLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  summaryLabel: { color: '#344054', fontSize: 12, fontWeight: '700' },
  section: { marginBottom: 25 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionTitle: { color: '#344054', fontSize: 17, fontWeight: '800' },
  countBadge: { minWidth: 24, height: 24, borderRadius: 12, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center' },
  countText: { color: '#1d4ed8', fontSize: 12, fontWeight: '800' },
  emptyState: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e4e7ec', borderRadius: 14, padding: 22, textAlign: 'center', color: '#667085', fontSize: 14 },
  appointmentCard: { backgroundColor: '#ffffff', borderRadius: 15, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#e4e7ec', shadowColor: '#101828', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#eff6ff', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 5 },
  statusText: { color: '#2563eb', fontSize: 12, fontWeight: '700' },
  approvedStatusText: { color: '#16a34a' },
  date: { color: '#667085', fontSize: 12, fontWeight: '600' },
  cardTitle: { color: '#172033', fontSize: 17, fontWeight: '800' },
  mission: { color: '#667085', fontSize: 13, marginTop: 4 },
  detailGrid: { gap: 8, marginTop: 14 },
  detail: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  detailText: { flex: 1, color: '#475467', fontSize: 13 },
  reason: { color: '#344054', fontSize: 13, lineHeight: 19, marginTop: 14 },
  notes: { color: '#667085', fontSize: 12, fontStyle: 'italic', marginTop: 9 },
  approveButton: { minHeight: 44, borderRadius: 9, backgroundColor: '#16a34a', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 15 },
  approveButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '800' },
});
