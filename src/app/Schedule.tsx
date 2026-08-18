import { Text, View } from 'react-native';
import Nav from '../components/nav';
import globalStyles from '../styles/globalStyles';

export default function Schedule() {
  return (
    <View style={globalStyles.homePage}>
      <View style={globalStyles.homeContent}>
        <Text style={globalStyles.homeTitle}>Schedule</Text>
      </View>

      <Nav activeTab="Schedule" />
    </View>
  );
}
