import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ComponentProps } from 'react';
import { TouchableOpacity, View } from 'react-native';
import globalStyles from '../styles/globalStyles';

type NavItem = {
  key: 'home' | 'requestAppoinment' | 'SecretaryDashBoard' | 'Schedule';
  icon: ComponentProps<typeof Ionicons>['name'];
  route: '/home' | '/requestAppoinment' | '/SecretaryDashBoard' | '/Schedule';
};

export default function Nav({ activeTab = 'home' }: { activeTab?: NavItem['key'] }) {
  const navItems: NavItem[] = [
    { key: 'home', icon: 'home-outline', route: '/home' },
    { key: 'requestAppoinment', icon: 'add-circle-outline', route: '/requestAppoinment' },
    { key: 'SecretaryDashBoard', icon: 'person-outline', route: '/SecretaryDashBoard' },
    { key: 'Schedule', icon: 'calendar-outline', route: '/Schedule' },
  ];

  return (
    <View style={globalStyles.bottomNavWrapper}>
      <View style={globalStyles.glassNavBar}>
        {navItems.map((item) => {
          const isActive = activeTab === item.key;

          return (
            <TouchableOpacity
              key={item.key}
              style={[globalStyles.navItem, isActive && globalStyles.navItemActive]}
              activeOpacity={0.8}
              onPress={() => router.push(item.route)}
            >
              <Ionicons
                name={item.icon}
                size={24}
                style={[globalStyles.navIcon, isActive && globalStyles.navIconActive]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
