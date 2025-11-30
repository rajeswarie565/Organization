import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import {
  Menu,
  X,
  Home,
  Users,
  Grid3x3,
  Settings,
  ChevronDown,
  ChevronRight,
  FileText,
  BarChart,
  LogOut,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

interface MenuItem {
  title: string;
  icon: any;
  route?: string;
  submenu?: { title: string; icon: any; route: string }[];
}

export default function HamburgerMenu() {
  const [visible, setVisible] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [slideAnim] = useState(new Animated.Value(-width * 0.8));
  const { signOut, userRole } = useAuth();

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: Home,
      route: '/(tabs)',
    },
    {
      title: 'Employees',
      icon: Users,
      submenu: [
        { title: 'All Employees', icon: Users, route: '/(tabs)/employees' },
        { title: 'Grid View', icon: Grid3x3, route: '/(tabs)/grid' },
      ],
    },
    {
      title: 'Reports',
      icon: FileText,
      submenu: [
        { title: 'Analytics', icon: BarChart, route: '/(tabs)' },
        { title: 'Attendance', icon: FileText, route: '/(tabs)' },
      ],
    },
    {
      title: 'Settings',
      icon: Settings,
      route: '/(tabs)/settings',
    },
  ];

  function openMenu() {
    setVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  function closeMenu() {
    Animated.timing(slideAnim, {
      toValue: -width * 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  }

  function handleItemPress(item: MenuItem) {
    if (item.submenu) {
      setExpandedItem(expandedItem === item.title ? null : item.title);
    } else if (item.route) {
      closeMenu();
      router.push(item.route as any);
    }
  }

  function handleSubmenuPress(route: string) {
    closeMenu();
    router.push(route as any);
  }

  async function handleSignOut() {
    closeMenu();
    await signOut();
  }

  return (
    <>
      <TouchableOpacity style={styles.menuButton} onPress={openMenu}>
        <Menu size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.backdrop} onPress={closeMenu} />

          <Animated.View
            style={[
              styles.menuContainer,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Menu</Text>
              <TouchableOpacity onPress={closeMenu}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.roleContainer}>
              <Text style={styles.roleLabel}>Role:</Text>
              <Text style={styles.roleValue}>
                {userRole === 'admin' ? 'Administrator' : 'Employee'}
              </Text>
            </View>

            <View style={styles.menuItems}>
              {menuItems.map((item) => (
                <View key={item.title}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleItemPress(item)}
                  >
                    <View style={styles.menuItemContent}>
                      <item.icon size={20} color="#fff" />
                      <Text style={styles.menuItemText}>{item.title}</Text>
                    </View>
                    {item.submenu && (
                      expandedItem === item.title ? (
                        <ChevronDown size={20} color="#fff" />
                      ) : (
                        <ChevronRight size={20} color="#fff" />
                      )
                    )}
                  </TouchableOpacity>

                  {item.submenu && expandedItem === item.title && (
                    <View style={styles.submenu}>
                      {item.submenu.map((subitem) => (
                        <TouchableOpacity
                          key={subitem.title}
                          style={styles.submenuItem}
                          onPress={() => handleSubmenuPress(subitem.route)}
                        >
                          <subitem.icon size={18} color="#bbb" />
                          <Text style={styles.submenuItemText}>
                            {subitem.title}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <LogOut size={20} color="#ff4444" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.8,
    backgroundColor: '#1a1a2e',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  roleContainer: {
    padding: 20,
    backgroundColor: '#16213e',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleLabel: {
    fontSize: 14,
    color: '#8e8e93',
  },
  roleValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a9eff',
  },
  menuItems: {
    flex: 1,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingLeft: 20,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  submenu: {
    backgroundColor: '#16213e',
    paddingVertical: 8,
  },
  submenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    paddingLeft: 52,
  },
  submenuItemText: {
    fontSize: 14,
    color: '#bbb',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2a2a3e',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4444',
  },
});
