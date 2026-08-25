import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import Nav from '../components/nav';
import { getAppointments, subscribeToAppointments, type Appointment } from '../data/appointments';
import globalStyles from '../styles/globalStyles';

export default function Schedule() {
  const today = startOfDay(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(getAppointments());
  const [visibleMonth, setVisibleMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [filterText, setFilterText] = useState('');
  const [filterRange, setFilterRange] = useState<FilterRange>('all');

  useEffect(() => subscribeToAppointments(() => setAppointments([...getAppointments()])), []);

  const approvedAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.status === 'approved'),
    [appointments],
  );
  const upcomingAppointments = useMemo(
    () => approvedAppointments
      .filter((appointment) => parseDate(appointment.date) >= today)
      .filter((appointment) => matchesRange(appointment, filterRange, today))
      .filter((appointment) => {
        const query = filterText.trim().toLowerCase();
        return !query || [appointment.type, appointment.mission, appointment.venue, appointment.date]
          .some((value) => value.toLowerCase().includes(query));
      })
      .sort((first, second) => appointmentTimestamp(first) - appointmentTimestamp(second)),
    [approvedAppointments, filterRange, filterText, today],
  );
  const selectedDayAppointments = approvedAppointments
    .filter((appointment) => isSameDay(parseDate(appointment.date), selectedDate))
    .sort((first, second) => appointmentTimestamp(first) - appointmentTimestamp(second));
  const calendarDays = getCalendarDays(visibleMonth);

  const changeMonth = (offset: number) => {
    const nextMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + offset, 1);
    setVisibleMonth(nextMonth);
    setSelectedDate(nextMonth);
  };

  return (
    <View style={globalStyles.schedulePage}>
      <FlatList
        data={upcomingAppointments}
        keyExtractor={(appointment) => appointment.id}
        contentContainerStyle={globalStyles.scheduleContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={(
          <View>
            <Text style={globalStyles.scheduleEyebrow}>Your time, organized</Text>
            <Text style={globalStyles.scheduleTitle}>Calendar</Text>
            <View style={globalStyles.calendarCard}>
              <View style={globalStyles.calendarToolbar}>
                <Pressable style={globalStyles.calendarIconButton} onPress={() => { setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1)); setSelectedDate(today); }}>
                  <Text style={globalStyles.calendarTodayText}>Today</Text>
                </Pressable>
                <View style={globalStyles.monthNavigation}>
                  <Pressable style={globalStyles.calendarIconButton} onPress={() => changeMonth(-1)} accessibilityLabel="Previous month">
                    <Ionicons name="chevron-back" size={18} color="#17324d" />
                  </Pressable>
                  <Text style={globalStyles.calendarMonthTitle}>{visibleMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</Text>
                  <Pressable style={globalStyles.calendarIconButton} onPress={() => changeMonth(1)} accessibilityLabel="Next month">
                    <Ionicons name="chevron-forward" size={18} color="#17324d" />
                  </Pressable>
                </View>
              </View>
              <View style={globalStyles.calendarWeekRow}>
                {WEEKDAYS.map((day) => <Text key={day} style={globalStyles.calendarWeekday}>{day}</Text>)}
              </View>
              <View style={globalStyles.calendarGrid}>
                {calendarDays.map((day, index) => {
                  const dayAppointments = day ? approvedAppointments.filter((appointment) => isSameDay(parseDate(appointment.date), day)) : [];
                  const isSelected = day ? isSameDay(day, selectedDate) : false;
                  return day ? (
                    <Pressable key={day.toISOString()} style={[globalStyles.calendarDayCell, isSelected && globalStyles.calendarSelectedDay]} onPress={() => { setSelectedDate(day); if (dayAppointments.length > 0) setSelectedAppointment(dayAppointments[0]); }}>
                      <Text style={[globalStyles.calendarDayNumber, isSelected && globalStyles.calendarSelectedDayText]}>{day.getDate()}</Text>
                      {dayAppointments.length > 0 ? <View style={[globalStyles.calendarAppointmentMark, isSelected && globalStyles.calendarSelectedMark]} /> : null}
                    </Pressable>
                  ) : <View key={`empty-${index}`} style={globalStyles.calendarDayCell} />;
                })}
              </View>
              <View style={globalStyles.selectedDayHeading}>
                <View>
                  <Text style={globalStyles.selectedDayLabel}>Selected day</Text>
                  <Text style={globalStyles.selectedDayTitle}>{selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
                </View>
                <Text style={globalStyles.selectedDayCount}>{selectedDayAppointments.length} booked</Text>
              </View>
              <View style={globalStyles.hourAgenda}>
                {HOURS.map((hour) => {
                  const hourAppointments = selectedDayAppointments.filter((appointment) => Number(appointment.from.split(':')[0]) === hour);
                  return <View key={hour} style={globalStyles.hourRow}><Text style={globalStyles.hourLabel}>{formatHour(hour)}</Text><View style={globalStyles.hourRowContent}>{hourAppointments.length === 0 ? <View style={globalStyles.emptyHourLine} /> : hourAppointments.map((appointment) => <Pressable key={appointment.id} style={globalStyles.hourAppointment} onPress={() => setSelectedAppointment(appointment)}><View style={globalStyles.hourAppointmentBody}><Text style={globalStyles.hourAppointmentTitle}>{appointment.type}</Text><Text style={globalStyles.hourAppointmentVenue}>{appointment.venue} · until {appointment.until}</Text></View><Ionicons name="chevron-forward" size={18} color="#8b9aaa" /></Pressable>)}</View></View>;
                })}
              </View>
            </View>
            <View style={globalStyles.upcomingHeader}>
              <View>
                <Text style={globalStyles.upcomingTitle}>Upcoming appointments</Text>
                <Text style={globalStyles.upcomingSubtitle}>Approved and ordered by time</Text>
              </View>
              <Text style={globalStyles.upcomingCount}>{upcomingAppointments.length}</Text>
            </View>
            <View style={globalStyles.appointmentSearchWrap}>
              <Ionicons name="search-outline" size={18} color="#7b8794" />
              <TextInput value={filterText} onChangeText={setFilterText} placeholder="Search appointments" placeholderTextColor="#9aa6b2" style={globalStyles.appointmentSearch} />
            </View>
            <View style={globalStyles.filterOptions}>
              {FILTERS.map((filter) => <Pressable key={filter.value} style={[globalStyles.filterOption, filterRange === filter.value && globalStyles.filterOptionActive]} onPress={() => setFilterRange(filter.value)}><Text style={[globalStyles.filterOptionText, filterRange === filter.value && globalStyles.filterOptionTextActive]}>{filter.label}</Text></Pressable>)}
            </View>
          </View>
        )}
        renderItem={({ item }) => <AppointmentListItem appointment={item} onPress={() => setSelectedAppointment(item)} />}
        ListEmptyComponent={<Text style={globalStyles.emptyListText}>No upcoming appointments match this filter.</Text>}
      />

      <Nav activeTab="Schedule" />
      <AppointmentDetails appointment={selectedAppointment} onClose={() => setSelectedAppointment(null)} />
    </View>
  );
}

type FilterRange = 'all' | 'week' | 'month';
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 13 }, (_, index) => index + 8);
const FILTERS: { label: string; value: FilterRange }[] = [{ label: 'All', value: 'all' }, { label: 'This week', value: 'week' }, { label: 'This month', value: 'month' }];

function AppointmentListItem({ appointment, onPress }: { appointment: Appointment; onPress: () => void }) {
  return <Pressable style={globalStyles.upcomingAppointment} onPress={onPress}><View style={globalStyles.upcomingDateBox}><Text style={globalStyles.upcomingDateMonth}>{parseDate(appointment.date).toLocaleDateString(undefined, { month: 'short' }).toUpperCase()}</Text><Text style={globalStyles.upcomingDateDay}>{parseDate(appointment.date).getDate()}</Text></View><View style={globalStyles.upcomingAppointmentInfo}><Text style={globalStyles.upcomingAppointmentTitle}>{appointment.type}</Text><Text style={globalStyles.upcomingAppointmentMeta}>{appointment.from} - {appointment.until} · {appointment.venue}</Text><Text style={globalStyles.upcomingAppointmentMission}>{appointment.mission}</Text></View><Ionicons name="chevron-forward" size={18} color="#8b9aaa" /></Pressable>;
}

function AppointmentDetails({ appointment, onClose }: { appointment: Appointment | null; onClose: () => void }) {
  return <Modal visible={Boolean(appointment)} transparent animationType="fade" onRequestClose={onClose}><Pressable style={globalStyles.scheduleModalBackdrop} onPress={onClose}><Pressable style={globalStyles.scheduleModalCard} onPress={(event) => event.stopPropagation()}>{appointment ? <><View style={globalStyles.modalHeadingRow}><View><Text style={globalStyles.modalEyebrow}>Approved appointment</Text><Text style={globalStyles.scheduleModalTitle}>{appointment.type}</Text></View><Pressable onPress={onClose} accessibilityLabel="Close appointment details"><Ionicons name="close" size={22} color="#64748b" /></Pressable></View><Text style={globalStyles.scheduleModalDate}>{appointment.date} · {appointment.from} - {appointment.until}</Text><Text style={globalStyles.scheduleModalMission}>{appointment.mission}</Text><Text style={globalStyles.scheduleModalDetail}><Ionicons name="location-outline" size={16} color="#3e7185" />  {appointment.venue}</Text><Text style={globalStyles.scheduleModalReason}>{appointment.reason}</Text>{appointment.notes ? <Text style={globalStyles.scheduleModalNotes}>Note: {appointment.notes}</Text> : null}<Pressable style={globalStyles.modalCloseButton} onPress={onClose}><Text style={globalStyles.modalCloseButtonText}>Done</Text></Pressable></> : null}</Pressable></Pressable></Modal>;
}

function parseDate(value: string) { const [month, day, year] = value.split('/').map(Number); return new Date(year, month - 1, day); }
function startOfDay(value: Date) { return new Date(value.getFullYear(), value.getMonth(), value.getDate()); }
function isSameDay(first: Date, second: Date) { return first.toDateString() === second.toDateString(); }
function getCalendarDays(month: Date) { const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay(); const totalDays = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate(); return Array.from({ length: firstDay + totalDays }, (_, index) => index < firstDay ? null : new Date(month.getFullYear(), month.getMonth(), index - firstDay + 1)); }
function appointmentTimestamp(appointment: Appointment) { const [hours, minutes] = appointment.from.split(':').map(Number); const date = parseDate(appointment.date); return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours || 0, minutes || 0).getTime(); }
function matchesRange(appointment: Appointment, range: FilterRange, today: Date) { const date = parseDate(appointment.date); if (range === 'month') return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear(); if (range === 'week') { const end = new Date(today); end.setDate(today.getDate() + 7); return date < end; } return true; }
function formatHour(hour: number) { return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`; }
