import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Home, Users, Grid3x3, Settings, TrendingUp } from 'lucide-react-native';

interface MenuItem {
  title: string;
  icon: any;
  route: string;
}

const menuItems: MenuItem[] = [
  { title: 'Dashboard', icon: Home, route: '/(tabs)' },
  { title: 'Employees', icon: Users, route: '/(tabs)/employees' },
  { title: 'Grid View', icon: Grid3x3, route: '/(tabs)/grid' },
  { title: 'Settings', icon: Settings, route: '/(tabs)/settings' },
];

export default function HorizontalMenu() {
  const pathname = usePathname();

  function isActive(route: string): boolean {
    if (route === '/(tabs)') {
      return pathname === '/(tabs)' || pathname === '/';
    }
    return pathname.includes(route.replace('/(tabs)/', ''));
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {menuItems.map((item) => {
        const active = isActive(item.route);
        return (
          <TouchableOpacity
            key={item.title}
            style={[styles.menuItem, active && styles.menuItemActive]}
            onPress={() => router.push(item.route as any)}
          >
            <item.icon
              size={18}
              color={active ? '#4a9eff' : '#8e8e93'}
            />
            <Text
              style={[styles.menuItemText, active && styles.menuItemTextActive]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  content: {
    paddingHorizontal: 16,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  menuItemActive: {
    backgroundColor: 'rgba(74, 158, 255, 0.15)',
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8e8e93',
  },
  menuItemTextActive: {
    color: '#4a9eff',
  },
});
