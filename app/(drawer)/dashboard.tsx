import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../../components/Header';
import { StatCard } from '../../components/ui/StatCard';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Header title="Dashboard" />
      <ScrollView style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>¡Hola, Administrador!</Text>
          <Text style={styles.dateText}>Resumen del negocio</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard title="Pedidos Hoy" value="34" iconName="cart-outline" color="#D9381E" />
          <StatCard title="Ingresos" value="Bs 1,840" iconName="cash-outline" color="#2ecc71" />
        </View>
        <View style={styles.statsRow}>
          <StatCard title="Pendientes" value="7" iconName="time-outline" color="#F39C12" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pedidos Recientes</Text>
          {/* Mockup list */}
          <View style={styles.orderCard}>
            <View>
              <Text style={styles.orderId}>#1042</Text>
              <Text style={styles.customerName}>Ana Lopez</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: '#F39C1220' }]}>
              <Text style={[styles.statusText, { color: '#F39C12' }]}>Pendiente</Text>
            </View>
          </View>
          <View style={styles.orderCard}>
            <View>
              <Text style={styles.orderId}>#1041</Text>
              <Text style={styles.customerName}>Carlos Vera</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: '#2ecc7120' }]}>
              <Text style={[styles.statusText, { color: '#2ecc71' }]}>Completado</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    padding: 16,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  customerName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
