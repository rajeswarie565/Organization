import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { Employee } from '@/lib/graphql';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  MoreVertical,
  Edit,
  Flag,
  Trash2,
  X,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

interface EmployeeTileProps {
  employee: Employee;
  onPress: () => void;
  onEdit?: (employee: Employee) => void;
  onDelete?: (id: string) => void;
  onToggleFlag?: (id: string) => void;
}

export default function EmployeeTile({
  employee,
  onPress,
  onEdit,
  onDelete,
  onToggleFlag,
}: EmployeeTileProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { userRole } = useAuth();
  const isAdmin = userRole === 'admin';

  function handleEdit() {
    setMenuVisible(false);
    onEdit?.(employee);
  }

  function handleFlag() {
    setMenuVisible(false);
    onToggleFlag?.(employee.id);
  }

  function handleDelete() {
    setMenuVisible(false);
    Alert.alert(
      'Delete Employee',
      `Are you sure you want to delete ${employee.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete?.(employee.id),
        },
      ]
    );
  }

  return (
    <View style={[styles.container, employee.flagged && styles.containerFlagged]}>
      <TouchableOpacity style={styles.content} onPress={onPress}>
        <View style={styles.header}>
          <View
            style={[
              styles.avatar,
              !employee.is_active && styles.avatarInactive,
            ]}
          >
            <User size={24} color={employee.is_active ? '#4a9eff' : '#666'} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.name} numberOfLines={1}>
              {employee.name}
            </Text>
            <Text style={styles.position} numberOfLines={1}>
              {employee.position}
            </Text>
          </View>
          {isAdmin && (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setMenuVisible(true)}
            >
              <MoreVertical size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.info}>
          <View style={styles.infoRow}>
            <Mail size={14} color="#666" />
            <Text style={styles.infoText} numberOfLines={1}>
              {employee.email}
            </Text>
          </View>
          {employee.phone && (
            <View style={styles.infoRow}>
              <Phone size={14} color="#666" />
              <Text style={styles.infoText} numberOfLines={1}>
                {employee.phone}
              </Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Briefcase size={14} color="#666" />
            <Text style={styles.infoText}>{employee.class}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {employee.attendance}% Attendance
            </Text>
          </View>
          {!employee.is_active && (
            <View style={styles.inactiveBadge}>
              <Text style={styles.inactiveBadgeText}>Inactive</Text>
            </View>
          )}
          {employee.flagged && (
            <View style={styles.flaggedBadge}>
              <Flag size={12} color="#ff4444" />
            </View>
          )}
        </View>
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menu}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Actions</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <X size={20} color="#333" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
              <Edit size={18} color="#4a9eff" />
              <Text style={styles.menuItemText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleFlag}>
              <Flag size={18} color="#ff9500" />
              <Text style={styles.menuItemText}>
                {employee.flagged ? 'Unflag' : 'Flag'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
              <Trash2 size={18} color="#ff4444" />
              <Text style={[styles.menuItemText, { color: '#ff4444' }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  containerFlagged: {
    borderWidth: 2,
    borderColor: '#ff4444',
  },
  content: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  position: {
    fontSize: 14,
    color: '#666',
  },
  menuButton: {
    padding: 4,
  },
  info: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: '#e8f4ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a9eff',
  },
  inactiveBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  inactiveBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  flaggedBadge: {
    backgroundColor: '#ffeeee',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    maxWidth: 300,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
