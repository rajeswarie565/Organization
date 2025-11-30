import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import HamburgerMenu from '@/components/HamburgerMenu';
import HorizontalMenu from '@/components/HorizontalMenu';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  Users,
  TrendingUp,
  Award,
  AlertCircle,
  ChevronRight,
} from 'lucide-react-native';

interface Stats {
  total: number;
  active: number;
  flagged: number;
  avgAttendance: number;
}

export default function HomeScreen() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, userRole } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('is_active, flagged, attendance');

      if (error) throw error;

      const total = data?.length || 0;
      const active = data?.filter((e) => e.is_active).length || 0;
      const flagged = data?.filter((e) => e.flagged).length || 0;
      const avgAttendance =
        data?.reduce((sum, e) => sum + e.attendance, 0) / total || 0;

      setStats({
        total,
        active,
        flagged,
        avgAttendance: Math.round(avgAttendance),
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
        <View style={styles.headerTop}>
          <HamburgerMenu />
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Welcome back!</Text>
            <Text style={styles.userName}>{user?.email?.split('@')[0]}</Text>
          </View>
        </View>
      </LinearGradient>

      <HorizontalMenu />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dashboard Overview</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4a9eff" />
            </View>
          ) : (
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: '#e8f4ff' }]}>
                <View style={styles.statIcon}>
                  <Users size={24} color="#4a9eff" />
                </View>
                <Text style={styles.statValue}>{stats?.total || 0}</Text>
                <Text style={styles.statLabel}>Total Employees</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: '#d4edda' }]}>
                <View style={styles.statIcon}>
                  <TrendingUp size={24} color="#28a745" />
                </View>
                <Text style={styles.statValue}>{stats?.active || 0}</Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: '#fff3cd' }]}>
                <View style={styles.statIcon}>
                  <Award size={24} color="#ffc107" />
                </View>
                <Text style={styles.statValue}>{stats?.avgAttendance || 0}%</Text>
                <Text style={styles.statLabel}>Avg Attendance</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: '#f8d7da' }]}>
                <View style={styles.statIcon}>
                  <AlertCircle size={24} color="#dc3545" />
                </View>
                <Text style={styles.statValue}>{stats?.flagged || 0}</Text>
                <Text style={styles.statLabel}>Flagged</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/employees')}
            >
              <View style={styles.actionContent}>
                <View style={styles.actionIcon}>
                  <Users size={24} color="#4a9eff" />
                </View>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>View Employees</Text>
                  <Text style={styles.actionDescription}>
                    Browse tile view
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/grid')}
            >
              <View style={styles.actionContent}>
                <View style={styles.actionIcon}>
                  <TrendingUp size={24} color="#28a745" />
                </View>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>Grid View</Text>
                  <Text style={styles.actionDescription}>
                    Detailed data table
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#ccc" />
            </TouchableOpacity>

            {userRole === 'admin' && (
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => {}}
              >
                <View style={styles.actionContent}>
                  <View style={styles.actionIcon}>
                    <AlertCircle size={24} color="#dc3545" />
                  </View>
                  <View style={styles.actionInfo}>
                    <Text style={styles.actionTitle}>Flagged Items</Text>
                    <Text style={styles.actionDescription}>
                      Review flagged employees
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#ccc" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.roleCard}>
            <Text style={styles.roleTitle}>Your Role</Text>
            <Text style={styles.roleValue}>
              {userRole === 'admin' ? 'Administrator' : 'Employee'}
            </Text>
            <Text style={styles.roleDescription}>
              {userRole === 'admin'
                ? 'Full access to all features and data'
                : 'Limited access to personal data'}
            </Text>
          </View>
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
  greeting: {
    fontSize: 14,
    color: '#bbb',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: 150,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  actionsContainer: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionInfo: {
    flex: 1,
    gap: 4,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  actionDescription: {
    fontSize: 14,
    color: '#666',
  },
  roleCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  roleValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4a9eff',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
