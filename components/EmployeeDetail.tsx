import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { Employee } from '@/lib/graphql';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Award,
  TrendingUp,
  Flag,
} from 'lucide-react-native';
import { BlurView } from 'expo-blur';

interface EmployeeDetailProps {
  employee: Employee | null;
  visible: boolean;
  onClose: () => void;
}

export default function EmployeeDetail({
  employee,
  visible,
  onClose,
}: EmployeeDetailProps) {
  if (!employee) return null;

  const hireDate = new Date(employee.hire_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <BlurView intensity={20} style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <View
                  style={[
                    styles.avatar,
                    !employee.is_active && styles.avatarInactive,
                  ]}
                >
                  <User
                    size={40}
                    color={employee.is_active ? '#4a9eff' : '#666'}
                  />
                </View>
                <View style={styles.headerInfo}>
                  <Text style={styles.name}>{employee.name}</Text>
                  <Text style={styles.position}>{employee.position}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {employee.flagged && (
                <View style={styles.flaggedBanner}>
                  <Flag size={16} color="#ff4444" />
                  <Text style={styles.flaggedText}>This employee is flagged</Text>
                </View>
              )}

              {!employee.is_active && (
                <View style={styles.inactiveBanner}>
                  <Text style={styles.inactiveText}>Inactive Employee</Text>
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact Information</Text>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <View style={styles.infoIcon}>
                      <Mail size={18} color="#4a9eff" />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Email</Text>
                      <Text style={styles.infoValue}>{employee.email}</Text>
                    </View>
                  </View>

                  {employee.phone && (
                    <View style={styles.infoItem}>
                      <View style={styles.infoIcon}>
                        <Phone size={18} color="#4a9eff" />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Phone</Text>
                        <Text style={styles.infoValue}>{employee.phone}</Text>
                      </View>
                    </View>
                  )}

                  {employee.address && (
                    <View style={styles.infoItem}>
                      <View style={styles.infoIcon}>
                        <MapPin size={18} color="#4a9eff" />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Address</Text>
                        <Text style={styles.infoValue}>{employee.address}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Employment Details</Text>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <View style={styles.infoIcon}>
                      <Briefcase size={18} color="#4a9eff" />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Department</Text>
                      <Text style={styles.infoValue}>{employee.class}</Text>
                    </View>
                  </View>

                  <View style={styles.infoItem}>
                    <View style={styles.infoIcon}>
                      <Calendar size={18} color="#4a9eff" />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Hire Date</Text>
                      <Text style={styles.infoValue}>{hireDate}</Text>
                    </View>
                  </View>

                  <View style={styles.infoItem}>
                    <View style={styles.infoIcon}>
                      <DollarSign size={18} color="#4a9eff" />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Salary</Text>
                      <Text style={styles.infoValue}>
                        ${employee.salary.toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoItem}>
                    <View style={styles.infoIcon}>
                      <User size={18} color="#4a9eff" />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Age</Text>
                      <Text style={styles.infoValue}>{employee.age} years</Text>
                    </View>
                  </View>
                </View>
              </View>

              {employee.subjects && employee.subjects.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Skills & Expertise</Text>
                  <View style={styles.skillsContainer}>
                    {employee.subjects.map((skill, index) => (
                      <View key={index} style={styles.skillBadge}>
                        <Award size={14} color="#4a9eff" />
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Performance</Text>
                <View style={styles.performanceCard}>
                  <TrendingUp size={24} color="#4a9eff" />
                  <View style={styles.performanceContent}>
                    <Text style={styles.performanceLabel}>
                      Attendance Rate
                    </Text>
                    <Text style={styles.performanceValue}>
                      {employee.attendance}%
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.performanceBadge,
                      employee.attendance >= 90
                        ? styles.performanceBadgeGood
                        : employee.attendance >= 75
                        ? styles.performanceBadgeWarning
                        : styles.performanceBadgePoor,
                    ]}
                  >
                    <Text
                      style={[
                        styles.performanceBadgeText,
                        employee.attendance >= 90
                          ? styles.performanceBadgeTextGood
                          : employee.attendance >= 75
                          ? styles.performanceBadgeTextWarning
                          : styles.performanceBadgeTextPoor,
                      ]}
                    >
                      {employee.attendance >= 90
                        ? 'Excellent'
                        : employee.attendance >= 75
                        ? 'Good'
                        : 'Needs Improvement'}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '90%',
    maxHeight: '85%',
    maxWidth: 600,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 24,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#e8f4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInactive: {
    backgroundColor: '#f0f0f0',
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  position: {
    fontSize: 16,
    color: '#666',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    maxHeight: 500,
  },
  flaggedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffeeee',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ffdddd',
  },
  flaggedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff4444',
  },
  inactiveBanner: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  inactiveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  section: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e8f4ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a9eff',
  },
  performanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  performanceContent: {
    flex: 1,
    gap: 4,
  },
  performanceLabel: {
    fontSize: 14,
    color: '#666',
  },
  performanceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  performanceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  performanceBadgeGood: {
    backgroundColor: '#d4edda',
  },
  performanceBadgeWarning: {
    backgroundColor: '#fff3cd',
  },
  performanceBadgePoor: {
    backgroundColor: '#f8d7da',
  },
  performanceBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  performanceBadgeTextGood: {
    color: '#155724',
  },
  performanceBadgeTextWarning: {
    color: '#856404',
  },
  performanceBadgeTextPoor: {
    color: '#721c24',
  },
  button: {
    backgroundColor: '#0f3460',
    padding: 16,
    margin: 24,
    marginTop: 0,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
