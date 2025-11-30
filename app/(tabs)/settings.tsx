import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import HamburgerMenu from '@/components/HamburgerMenu';
import HorizontalMenu from '@/components/HorizontalMenu';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  Mail,
  Shield,
  Bell,
  Lock,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { user, userRole, signOut } = useAuth();

  async function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/auth/login');
        },
      },
    ]);
  }

  function handlePress(title: string) {
    Alert.alert(title, 'This feature is coming soon!');
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
        <View style={styles.headerTop}>
          <HamburgerMenu />
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Settings</Text>
          </View>
        </View>
      </LinearGradient>

      <HorizontalMenu />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <User size={32} color="#4a9eff" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.email?.split('@')[0]}
              </Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <View style={styles.roleBadge}>
                <Shield size={14} color="#4a9eff" />
                <Text style={styles.roleText}>
                  {userRole === 'admin' ? 'Administrator' : 'Employee'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuList}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handlePress('Profile')}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.menuIcon}>
                  <User size={20} color="#4a9eff" />
                </View>
                <Text style={styles.menuItemText}>Edit Profile</Text>
              </View>
              <ChevronRight size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handlePress('Email')}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.menuIcon}>
                  <Mail size={20} color="#4a9eff" />
                </View>
                <Text style={styles.menuItemText}>Change Email</Text>
              </View>
              <ChevronRight size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handlePress('Password')}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.menuIcon}>
                  <Lock size={20} color="#4a9eff" />
                </View>
                <Text style={styles.menuItemText}>Change Password</Text>
              </View>
              <ChevronRight size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuList}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handlePress('Notifications')}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.menuIcon}>
                  <Bell size={20} color="#4a9eff" />
                </View>
                <Text style={styles.menuItemText}>Notifications</Text>
              </View>
              <ChevronRight size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handlePress('Privacy')}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.menuIcon}>
                  <Shield size={20} color="#4a9eff" />
                </View>
                <Text style={styles.menuItemText}>Privacy & Security</Text>
              </View>
              <ChevronRight size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuList}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handlePress('Help')}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.menuIcon}>
                  <HelpCircle size={20} color="#4a9eff" />
                </View>
                <Text style={styles.menuItemText}>Help Center</Text>
              </View>
              <ChevronRight size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handlePress('About')}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.menuIcon}>
                  <Info size={20} color="#4a9eff" />
                </View>
                <Text style={styles.menuItemText}>About</Text>
              </View>
              <ChevronRight size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LogOut size={20} color="#ff4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Employee Management System</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#e8f4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
    textTransform: 'capitalize',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#e8f4ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a9eff',
  },
  menuList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ff4444',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff4444',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  footerVersion: {
    fontSize: 12,
    color: '#999',
  },
});
