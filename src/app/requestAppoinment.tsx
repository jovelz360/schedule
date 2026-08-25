import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Nav from '../components/nav';
import { addAppointment } from '../data/appointments';

const venues = ['Main office', 'Meeting room', 'The National University', 'Other'];
const appointmentTypes = ['Internal Interviews', 'Department Managers', 'Meetings', 'External Events', 'Other'];

export default function RequestAppoinment() {
  const [venue, setVenue] = useState('');
  const [type, setType] = useState('');
  const [mission, setMission] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');
  const [from, setFrom] = useState('');
  const [until, setUntil] = useState('');
  const [notes, setNotes] = useState('');
  const [selector, setSelector] = useState<'venue' | 'type' | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const submitRequest = () => {
    if (!venue || !type || !mission || !reason || !date || !from || !until) {
      Alert.alert('Incomplete request', 'Please complete all required fields before sending.');
      return;
    }
    if (!isValidTime(from) || !isValidTime(until)) {
      Alert.alert('Invalid time', 'Use a valid 24-hour time between 00:00 and 23:59.');
      return;
    }

    addAppointment({ venue, type, mission, reason, date, from, until, notes });
    router.replace('/SecretaryDashBoard');
  };

  const options = selector === 'venue' ? venues : appointmentTypes;

  return (
    <View style={styles.page}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Request an Appointment</Text>
            <Text style={styles.subtitle}>Send the details for secretary review</Text>
          </View>

          <View style={styles.formCard}>
            <FieldLabel label="Appointment place" required />
            <SelectField
              value={venue}
              placeholder="Select a venue"
              onPress={() => setSelector('venue')}
            />

            <FieldLabel label="Appointment type" required />
            <SelectField
              value={type}
              placeholder="Select an appointment type"
              onPress={() => setSelector('type')}
            />

            <FieldLabel label="Core mission" required />
            <TextInput
              value={mission}
              onChangeText={setMission}
              placeholder="Core mission"
              placeholderTextColor="#98a2b3"
              style={styles.input}
            />

            <FieldLabel label="Reason for the interview" required />
            <TextInput
              value={reason}
              onChangeText={setReason}
              placeholder="Reason for the interview"
              placeholderTextColor="#98a2b3"
              multiline
              textAlignVertical="top"
              style={[styles.input, styles.textArea]}
            />

            <FieldLabel label="Interview date" required />
            <DateField
              value={date}
              placeholder="MM/DD/YYYY"
              onPress={() => setShowDatePicker(true)}
            />

            <View style={styles.timeRow}>
              <View style={styles.timeColumn}>
                <FieldLabel label="From the hour" required />
                <TimeInput
                  value={from}
                  onChangeText={setFrom}
                  placeholder="09:00 AM"
                />
              </View>
              <View style={styles.timeColumn}>
                <FieldLabel label="Until the hour" required />
                <TimeInput
                  value={until}
                  onChangeText={setUntil}
                  placeholder="10:00 AM"
                />
              </View>
            </View>

            <FieldLabel label="Notes / emergencies" />
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Notes / emergencies"
              placeholderTextColor="#98a2b3"
              multiline
              textAlignVertical="top"
              style={[styles.input, styles.notesArea]}
            />

            <Pressable style={styles.sendButton} onPress={submitRequest}>
              <Ionicons name="send-outline" size={18} color="#ffffff" />
              <Text style={styles.sendButtonText}>Send request</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Nav activeTab="requestAppoinment" />

      {showDatePicker ? (
        Platform.OS === 'web' ? (
          <CalendarModal
            selectedDate={date ? parseDate(date) : undefined}
            onSelect={(selectedDate) => {
              setDate(formatDate(selectedDate));
              setShowDatePicker(false);
            }}
            onClose={() => setShowDatePicker(false)}
          />
        ) : (
          <DateTimePicker
            value={date ? parseDate(date) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (event.type === 'set' && selectedDate) setDate(formatDate(selectedDate));
            }}
          />
        )
      ) : null}

      <Modal visible={selector !== null} transparent animationType="fade" onRequestClose={() => setSelector(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setSelector(null)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {selector === 'venue' ? 'Choose a venue' : 'Choose an appointment type'}
            </Text>
            {options.map((option) => (
              <Pressable
                key={option}
                style={styles.option}
                onPress={() => {
                  if (selector === 'venue') setVenue(option);
                  if (selector === 'type') setType(option);
                  setSelector(null);
                }}
              >
                <Text style={styles.optionText}>{option}</Text>
                <Ionicons name="chevron-forward" size={18} color="#667085" />
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function FieldLabel({ label, required = false }: { label: string; required?: boolean }) {
  return (
    <Text style={styles.label}>
      {label}
      {required ? <Text style={styles.required}> *</Text> : null}
    </Text>
  );
}

function SelectField({ value, placeholder, onPress }: { value: string; placeholder: string; onPress: () => void }) {
  return (
    <Pressable style={styles.select} onPress={onPress}>
      <Text style={[styles.selectText, !value && styles.placeholder]}>{value || placeholder}</Text>
      <Ionicons name="chevron-down" size={18} color="#667085" />
    </Pressable>
  );
}

function DateField({ value, placeholder, onPress }: { value: string; placeholder: string; onPress: () => void }) {
  return (
    <Pressable style={styles.iconInputWrap} onPress={onPress}>
      <View style={[styles.input, styles.iconInput, styles.dateField]}>
        <Text style={value ? styles.dateText : styles.placeholder}>{value || placeholder}</Text>
      </View>
      <Ionicons name="calendar-outline" size={19} color="#667085" style={styles.inputIcon} />
    </Pressable>
  );
}

function TimeInput({ value, onChangeText, placeholder }: { value: string; onChangeText: (value: string) => void; placeholder: string }) {
  return (
    <View style={styles.iconInputWrap}>
      <TextInput
        value={value}
        onChangeText={(text) => onChangeText(formatTimeInput(text))}
        placeholder={placeholder}
        placeholderTextColor="#98a2b3"
        keyboardType="number-pad"
        maxLength={5}
        style={[styles.input, styles.iconInput]}
      />
      <Ionicons name="time-outline" size={19} color="#667085" style={styles.inputIcon} />
    </View>
  );
}

function formatTimeInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 1 && Number(digits[0]) > 2) return '';
  if (digits.length >= 2 && Number(digits.slice(0, 2)) > 23) return digits.slice(0, 1);
  if (digits.length >= 3 && Number(digits[2]) > 5) return digits.slice(0, 2);
  return digits.length < 3 ? digits : `${digits.slice(0, 2)}:${digits.slice(2)}`;
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

function isValidTime(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return false;
  return Number(match[1]) <= 23 && Number(match[2]) <= 59;
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
            <Text style={styles.modalTitle}>{month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</Text>
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
  flex: { flex: 1 },
  content: { padding: 20, paddingTop: 58, paddingBottom: 132 },
  header: { marginBottom: 18 },
  title: { color: '#172033', fontSize: 25, fontWeight: '800' },
  subtitle: { color: '#667085', fontSize: 14, marginTop: 5 },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e4e7ec',
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  label: { color: '#344054', fontSize: 13, fontWeight: '700', marginBottom: 7, marginTop: 12 },
  required: { color: '#d92d20' },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 11,
    color: '#172033',
    fontSize: 15,
    backgroundColor: '#ffffff',
  },
  textArea: { minHeight: 92 },
  notesArea: { minHeight: 76 },
  select: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    borderRadius: 10,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  selectText: { color: '#172033', fontSize: 15, flex: 1 },
  placeholder: { color: '#98a2b3' },
  timeRow: { flexDirection: 'row', gap: 10 },
  timeColumn: { flex: 1 },
  iconInputWrap: { position: 'relative' },
  iconInput: { paddingRight: 42 },
  dateField: { justifyContent: 'center' },
  dateText: { color: '#172033', fontSize: 15 },
  inputIcon: { position: 'absolute', right: 13, top: 14 },
  sendButton: {
    minHeight: 50,
    marginTop: 22,
    borderRadius: 10,
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(16, 24, 40, 0.42)', justifyContent: 'center', padding: 22 },
  modalCard: { backgroundColor: '#ffffff', borderRadius: 18, padding: 18 },
  modalTitle: { color: '#172033', fontSize: 18, fontWeight: '800', marginBottom: 8 },
  option: { minHeight: 50, borderTopWidth: 1, borderTopColor: '#eaecf0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  optionText: { color: '#344054', fontSize: 15 },
  calendarBackdrop: { flex: 1, backgroundColor: 'rgba(16, 24, 40, 0.42)', justifyContent: 'center', padding: 20 },
  calendarCard: { backgroundColor: '#ffffff', borderRadius: 18, padding: 18 },
  calendarHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  monthActions: { flexDirection: 'row', gap: 6 },
  monthButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#f2f4f7', alignItems: 'center', justifyContent: 'center' },
  weekRow: { flexDirection: 'row', marginTop: 14, marginBottom: 6 },
  weekDay: { flex: 1, textAlign: 'center', color: '#667085', fontSize: 12, fontWeight: '700' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.285%', height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 21 },
  dayText: { color: '#344054', fontSize: 14 },
  pastDay: { color: '#d0d5dd' },
  selectedDay: { backgroundColor: '#16a34a' },
  selectedDayText: { color: '#ffffff', fontWeight: '800' },
  cancelCalendar: { alignSelf: 'flex-end', paddingHorizontal: 10, paddingTop: 12 },
  cancelCalendarText: { color: '#667085', fontSize: 14, fontWeight: '700' },
});
