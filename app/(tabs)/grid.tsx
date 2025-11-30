import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HamburgerMenu from '@/components/HamburgerMenu';
import HorizontalMenu from '@/components/HorizontalMenu';
import EmployeeDetail from '@/components/EmployeeDetail';
import { supabase } from '@/lib/supabase';
import { Employee } from '@/lib/graphql';
import { Grid3x3, List } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = 140;

export default function GridScreen() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await fetchEmployees();
    setRefreshing(false);
  }

  function handleEmployeePress(employee: Employee) {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  }

  function handleCloseDetail() {
    setShowDetailModal(false);
    setTimeout(() => setSelectedEmployee(null), 300);
  }

  const columns = [
    { key: 'name', label: 'Name', width: 160 },
    { key: 'email', label: 'Email', width: 200 },
    { key: 'position', label: 'Position', width: 160 },
    { key: 'class', label: 'Department', width: 140 },
    { key: 'age', label: 'Age', width: 80 },
    { key: 'salary', label: 'Salary', width: 120 },
    { key: 'phone', label: 'Phone', width: 140 },
    { key: 'attendance', label: 'Attendance', width: 120 },
    { key: 'hire_date', label: 'Hire Date', width: 120 },
    { key: 'is_active', label: 'Status', width: 100 },
  ];

  function renderCellValue(employee: Employee, key: string) {
    const value = employee[key as keyof Employee];

    switch (key) {
      case 'salary':
        return `$${Number(value).toLocaleString()}`;
      case 'attendance':
        return `${value}%`;
      case 'hire_date':
        return new Date(value as string).toLocaleDateString();
      case 'is_active':
        return value ? 'Active' : 'Inactive';
      default:
        return String(value || '-');
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
          <View style={styles.headerTop}>
            <HamburgerMenu />
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Grid View</Text>
            </View>
          </View>
        </LinearGradient>
        <HorizontalMenu />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a9eff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
        <View style={styles.headerTop}>
          <HamburgerMenu />
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Grid View</Text>
            <Text style={styles.headerSubtitle}>
              {employees.length} employees
            </Text>
          </View>
          <TouchableOpacity
            style={styles.viewToggle}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? (
              <List size={24} color="#fff" />
            ) : (
              <Grid3x3 size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <HorizontalMenu />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              {columns.map((column) => (
                <View
                  key={column.key}
                  style={[styles.headerCell, { width: column.width }]}
                >
                  <Text style={styles.headerText}>{column.label}</Text>
                </View>
              ))}
            </View>

            {employees.map((employee, rowIndex) => (
              <TouchableOpacity
                key={employee.id}
                style={[
                  styles.tableRow,
                  rowIndex % 2 === 0 && styles.tableRowEven,
                  employee.flagged && styles.tableRowFlagged,
                ]}
                onPress={() => handleEmployeePress(employee)}
              >
                {columns.map((column) => (
                  <View
                    key={column.key}
                    style={[styles.cell, { width: column.width }]}
                  >
                    <Text
                      style={[
                        styles.cellText,
                        !employee.is_active && styles.cellTextInactive,
                      ]}
                      numberOfLines={1}
                    >
                      {renderCellValue(employee, column.key)}
                    </Text>
                  </View>
                ))}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Showing {employees.length} employees
          </Text>
          <Text style={styles.footerHint}>Tap any row to view details</Text>
        </View>
      </ScrollView>

      <EmployeeDetail
        employee={selectedEmployee}
        visible={showDetailModal}
        onClose={handleCloseDetail}
      />
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
  headerSubtitle: {
    fontSize: 14,
    color: '#bbb',
  },
  viewToggle: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  table: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 2,
    borderBottomColor: '#4a9eff',
  },
  headerCell: {
    padding: 16,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableRowEven: {
    backgroundColor: '#f8f9fa',
  },
  tableRowFlagged: {
    backgroundColor: '#ffeeee',
  },
  cell: {
    padding: 16,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 14,
    color: '#333',
  },
  cellTextInactive: {
    color: '#999',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  footerHint: {
    fontSize: 12,
    color: '#999',
  },
});
