import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Nav from '../components/nav';
import { getAppointments, subscribeToAppointments, type Appointment } from '../data/appointments';

function formatDate(value: Date) {
  return [value.getMonth() + 1, value.getDate(), value.getFullYear()]
    .map((part, index) => (index < 2 ? String(part).padStart(2, '0') : String(part)))
    .join('/');
}

export default function Home() {
  const [appointments, setAppointments] = useState<Appointment[]>(getAppointments());
  const { width } = useWindowDimensions();
  const isCompact = width < 700;
  const today = formatDate(new Date());

  useEffect(() => subscribeToAppointments(() => setAppointments([...getAppointments()])), []);

  const todayAppointments = appointments.filter((appointment) => appointment.date === today);
  const underReview = todayAppointments.filter((appointment) => appointment.status === 'underReview');
  const approved = todayAppointments.filter((appointment) => appointment.status === 'approved');
  const rejected = todayAppointments.filter((appointment) => appointment.status === 'rejected');

  return (
    <View style={styles.page}>
      <Pressable style={styles.logoutButton} onPress={() => router.replace('/(Tabs)/logIn')}>
        <Ionicons name="log-out-outline" size={18} color="#c6283f" />
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoWrap}>
          <View style={styles.logoRing}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
          </View>
        </View>

        <View style={[styles.metricGrid, isCompact && styles.metricGridCompact]}>
          <Metric label="Total requests today" value={todayAppointments.length} color="#e63950" />
          <Metric label="Under review today" value={underReview.length} color="#ffbf0f" darkText />
          <Metric label="Approved today" value={approved.length} color="#25a847" />
          <Metric label="Accepted appointments" value={approved.length} color="#147ee8" />
        </View>

        <View style={[styles.mainGrid, isCompact && styles.mainGridCompact]}>
          <View style={[styles.analysisPanel, !isCompact && styles.analysisPanelWide]}>
            <Text style={styles.panelTitle}>Case analysis</Text>
            <View style={styles.analysisSpace} />
            <AnalysisLegend label="Rejected" value={rejected.length} color="#e63950" />
            <AnalysisLegend label="Under review" value={underReview.length} color="#ffbf0f" />
            <AnalysisLegend label="Approved" value={approved.length} color="#25a847" />
          </View>

          <View style={styles.appointmentsPanel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Nearest upcoming appointments today</Text>
              <Text style={styles.todayLabel}>{today}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <TableCell text="Status" header />
                  <TableCell text="Case" header />
                  <TableCell text="Location" header />
                  <TableCell text="Mission" header />
                  <TableCell text="Time" header />
                </View>
                {todayAppointments.length === 0 ? (
                  <Text style={styles.emptyState}>No appointments scheduled today.</Text>
                ) : todayAppointments.map((appointment) => (
                  <View key={appointment.id} style={styles.tableRow}>
                    <TableCell text={statusLabel(appointment.status)} color={statusColor(appointment.status)} />
                    <TableCell text={appointment.type} />
                    <TableCell text={appointment.venue} />
                    <TableCell text={appointment.mission} />
                    <TableCell text={`${appointment.from} - ${appointment.until}`} />
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
      <Nav activeTab="home" />
    </View>
  );
}

function Metric({ label, value, color, darkText = false }: { label: string; value: number; color: string; darkText?: boolean }) {
  return (
    <View style={[styles.metric, { backgroundColor: color }]}>
      <Text style={[styles.metricLabel, darkText && styles.darkMetricText]}>{label}</Text>
      <Text style={[styles.metricValue, darkText && styles.darkMetricText]}>{value}</Text>
    </View>
  );
}

function AnalysisLegend({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.legendRow}>
      <Text style={styles.legendLabel}>{label}</Text>
      <View style={[styles.legendBar, { backgroundColor: color }]} />
      <Text style={styles.legendValue}>{value}</Text>
    </View>
  );
}

function TableCell({ text, header = false, color }: { text: string; header?: boolean; color?: string }) {
  return <Text style={[styles.tableCell, header && styles.tableCellHeader, color ? { color } : null]}>{text}</Text>;
}

function statusLabel(status: Appointment['status']) {
  return status === 'underReview' ? 'Under review' : status === 'approved' ? 'Approved' : 'Rejected';
}

function statusColor(status: Appointment['status']) {
  return status === 'underReview' ? '#c47f00' : status === 'approved' ? '#16803a' : '#c6283f';
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f6f8fb' },
  logoutButton: { position: 'absolute', top: 24, left: 20, zIndex: 2, minHeight: 40, paddingHorizontal: 12, borderRadius: 9, borderWidth: 1, borderColor: '#f1b8c2', backgroundColor: '#ffffff', flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoutText: { color: '#c6283f', fontSize: 13, fontWeight: '800' },
  content: { padding: 20, paddingTop: 28, paddingBottom: 132 },
  logoWrap: { alignItems: 'center', marginBottom: 26 },
  logoRing: { width: 78, height: 78, borderRadius: 39, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dbe5f3', alignItems: 'center', justifyContent: 'center', shadowColor: '#172033', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 9, elevation: 3 },
  logo: { width: 66, height: 66, resizeMode: 'contain' },
  metricGrid: { flexDirection: 'row', gap: 18, marginBottom: 44 },
  metricGridCompact: { flexWrap: 'wrap', gap: 10 },
  metric: { flex: 1, minWidth: 145, minHeight: 116, borderRadius: 17, padding: 20, alignItems: 'center', justifyContent: 'center', shadowColor: '#172033', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 3 },
  metricLabel: { color: '#ffffff', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  metricValue: { color: '#ffffff', fontSize: 32, fontWeight: '900', marginTop: 8 },
  darkMetricText: { color: '#39404c' },
  mainGrid: { flexDirection: 'row', gap: 34, alignItems: 'stretch' },
  mainGridCompact: { flexDirection: 'column', gap: 16 },
  analysisPanel: { flex: 1, minHeight: 380, backgroundColor: '#ffffff', borderRadius: 17, padding: 22, shadowColor: '#172033', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 2 },
  analysisPanelWide: { maxWidth: 410 },
  appointmentsPanel: { flex: 2, minHeight: 380, backgroundColor: '#ffffff', borderRadius: 17, padding: 22, shadowColor: '#172033', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 2 },
  panelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 14, marginBottom: 20 },
  panelTitle: { color: '#3e4855', fontSize: 21, fontWeight: '700' },
  todayLabel: { color: '#667085', fontSize: 12 },
  analysisSpace: { flex: 1, minHeight: 230 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 9 },
  legendLabel: { width: 84, color: '#667085', fontSize: 10, textAlign: 'right' },
  legendBar: { width: 46, height: 13 },
  legendValue: { color: '#667085', fontSize: 10 },
  table: { minWidth: 650, flex: 1 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#e9edf2', paddingVertical: 15 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eef1f4', paddingVertical: 17 },
  tableCell: { width: 130, paddingHorizontal: 10, color: '#52606d', fontSize: 13 },
  tableCellHeader: { color: '#59636e', fontWeight: '800', fontSize: 12 },
  emptyState: { color: '#64748b', textAlign: 'center', paddingVertical: 70, fontSize: 14 },
});