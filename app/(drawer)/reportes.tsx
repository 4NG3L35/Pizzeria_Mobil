import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../../components/Header';
import { StatCard } from '../../components/ui/StatCard';

export default function ReportesScreen() {
  return (
    <View style={styles.container}>
      <Header title="Reportes del Sistema" />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.sectionTitle}>Resumen General</Text>
        
        <View style={styles.statsRow}>
          <StatCard title="Ventas Totales" value="Bs 28,400" iconName="cash-outline" color="#2ecc71" />
          <StatCard title="Total Pedidos" value="362" iconName="albums-outline" color="#3498db" />
        </View>
        <View style={styles.statsRow}>
          <StatCard title="Clientes Reg." value="219" iconName="people-outline" color="#9b59b6" />
          <StatCard title="Ticket Promedio" value="Bs 83" iconName="receipt-outline" color="#e67e22" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ventas por día de semana</Text>
          <View style={styles.chartContainer}>
            {/* Gráfica de barras simulada */}
            <View style={styles.barGroup}>
              <View style={[styles.bar, { height: '40%' }]} />
              <Text style={styles.barLabel}>Lun</Text>
            </View>
            <View style={styles.barGroup}>
              <View style={[styles.bar, { height: '50%' }]} />
              <Text style={styles.barLabel}>Mar</Text>
            </View>
            <View style={styles.barGroup}>
              <View style={[styles.bar, { height: '45%' }]} />
              <Text style={styles.barLabel}>Mié</Text>
            </View>
            <View style={styles.barGroup}>
              <View style={[styles.bar, { height: '60%' }]} />
              <Text style={styles.barLabel}>Jue</Text>
            </View>
            <View style={styles.barGroup}>
              <View style={[styles.bar, { height: '80%' }]} />
              <Text style={styles.barLabel}>Vie</Text>
            </View>
            <View style={styles.barGroup}>
              <View style={[styles.bar, { height: '100%', backgroundColor: '#D9381E' }]} />
              <Text style={styles.barLabel}>Sáb</Text>
            </View>
            <View style={styles.barGroup}>
              <View style={[styles.bar, { height: '90%' }]} />
              <Text style={styles.barLabel}>Dom</Text>
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
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: '60%',
    backgroundColor: '#3498db',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
});
