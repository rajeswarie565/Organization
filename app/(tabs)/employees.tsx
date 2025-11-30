import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HamburgerMenu from '@/components/HamburgerMenu';
import HorizontalMenu from '@/components/HorizontalMenu';
import EmployeeTile from '@/components/EmployeeTile';
import EmployeeDetail from '@/components/EmployeeDetail';
import { supabase } from '@/lib/supabase';
import { Employee, graphqlRequest, MUTATIONS } from '@/lib/graphql';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Filter } from 'lucide-react-native';

export default function EmployeesScreen() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { userRole } = useAuth();

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchQuery, employees]);

  async function fetchEmployees() {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterEmployees() {
    if (!searchQuery.trim()) {
      setFilteredEmployees(employees);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.position.toLowerCase().includes(query) ||
        emp.class.toLowerCase().includes(query)
    );
    setFilteredEmployees(filtered);
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

  async function handleToggleFlag(id: string) {
    try {
      await graphqlRequest(MUTATIONS.TOGGLE_FLAG, { id });
      await fetchEmployees();
    } catch (error) {
      console.error('Error toggling flag:', error);
    }
  }

  async function handleDelete(id: string) {
    try {
      await graphqlRequest(MUTATIONS.DELETE_EMPLOYEE, { id });
      await fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  }

  function handleEdit(employee: Employee) {
    console.log('Edit employee:', employee);
  }

  const renderEmployee = useCallback(
    ({ item }: { item: Employee }) => (
      <EmployeeTile
        employee={item}
        onPress={() => handleEmployeePress(item)}
        onEdit={userRole === 'admin' ? handleEdit : undefined}
        onDelete={userRole === 'admin' ? handleDelete : undefined}
        onToggleFlag={userRole === 'admin' ? handleToggleFlag : undefined}
      />
    ),
    [userRole]
  );

  const keyExtractor = useCallback((item: Employee) => item.id, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
        <View style={styles.headerTop}>
          <HamburgerMenu />
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Employees</Text>
            <Text style={styles.headerSubtitle}>
              {filteredEmployees.length} total
            </Text>
          </View>
        </View>
      </LinearGradient>

      <HorizontalMenu />

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search employees..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a9eff" />
        </View>
      ) : (
        <FlatList
          data={filteredEmployees}
          renderItem={renderEmployee}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No employees found</Text>
            </View>
          }
        />
      )}

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
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a2e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  separator: {
    height: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
