import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Header } from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PerfilScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Header title="Mi Perfil" />
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle-outline" size={100} color="#ccc" />
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={24} color="#666" style={styles.icon} />
            <View>
              <Text style={styles.label}>Nombre de Usuario</Text>
              <Text style={styles.value}>{user?.username || 'Usuario'}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={24} color="#666" style={styles.icon} />
            <View>
              <Text style={styles.label}>Correo Electrónico</Text>
              <Text style={styles.value}>{user?.email || 'correo@ejemplo.com'}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#666" style={styles.icon} />
            <View>
              <Text style={styles.label}>Tipo de Cuenta</Text>
              <Text style={styles.value}>{user?.role === 'admin' ? 'Administrador' : 'Cliente'}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  content: { flex: 1, padding: 16, alignItems: 'center' },
  avatarContainer: { marginTop: 20, marginBottom: 30, alignItems: 'center' },
  infoCard: { width: '100%', backgroundColor: '#fff', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2, marginBottom: 30 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 16 },
  label: { fontSize: 14, color: '#888', marginBottom: 4 },
  value: { fontSize: 16, color: '#333', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 16 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D9381E', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 30, shadowColor: '#D9381E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});
