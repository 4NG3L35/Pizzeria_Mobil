import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Header } from '../../components/Header';
import { StatCard } from '../../components/ui/StatCard';
import { supabase } from '../../database/supabase';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function ReportesScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('total_price, created_at, status')
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Error cargando reportes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();

    // Actualizar reportes si hay nuevas órdenes
    const channel = supabase
      .channel('reports-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchReports();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Cálculos de métricas globales (solo pedidos completados o todos, aquí usaremos todos los no cancelados)
  const validOrders = orders.filter(o => o.status !== 'cancelled');
  const totalSales = validOrders.reduce((sum, order) => sum + Number(order.total_price), 0);
  const totalOrdersCount = validOrders.length;
  const ticketPromedio = totalOrdersCount > 0 ? (totalSales / totalOrdersCount) : 0;
  
  // Calcular usuarios únicos (simulado con total para demostración, ya que agrupar por user_id requeriría otra query o procesarlo aquí)
  const uniqueUsers = new Set(validOrders.map(o => o.user_id)).size || 0;

  // Preparar datos para el gráfico de líneas (Últimos 7 días)
  const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const dataPoints = [0, 0, 0, 0, 0, 0, 0];

  validOrders.forEach(order => {
    const date = new Date(order.created_at);
    // getDay() devuelve 0 para Domingo, 1 para Lunes, etc.
    // Lo mapeamos para que Lunes sea 0 y Domingo sea 6
    let dayIndex = date.getDay() - 1;
    if (dayIndex === -1) dayIndex = 6; // Domingo

    dataPoints[dayIndex] += Number(order.total_price);
  });

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: dataPoints.every(v => v === 0) ? [0, 0, 0, 0, 0, 0, 1] : dataPoints, // Para que el gráfico no falle si todo es 0
        color: (opacity = 1) => `rgba(217, 56, 30, ${opacity})`, // Rojo de Pizzeria
        strokeWidth: 3
      }
    ],
    legend: ['Ventas en Bs']
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#D9381E'
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Reportes del Sistema" />
      
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#D9381E" />
          <Text style={styles.loaderText}>Generando reportes de ventas...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          
          <Text style={styles.sectionTitle}>Resumen General</Text>
          
          <View style={styles.statsRow}>
            <StatCard title="Ventas Totales" value={`Bs ${totalSales.toFixed(0)}`} iconName="cash-outline" color="#2ecc71" />
            <StatCard title="Total Pedidos" value={String(totalOrdersCount)} iconName="albums-outline" color="#3498db" />
          </View>
          <View style={styles.statsRow}>
            <StatCard title="Clientes Únicos" value={String(uniqueUsers || 1)} iconName="people-outline" color="#9b59b6" />
            <StatCard title="Ticket Promedio" value={`Bs ${ticketPromedio.toFixed(0)}`} iconName="receipt-outline" color="#e67e22" />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ventas Semanales (Bs)</Text>
            
            {dataPoints.every(v => v === 0) ? (
              <View style={styles.emptyChart}>
                <Ionicons name="stats-chart-outline" size={48} color="#ccc" />
                <Text style={styles.emptyChartText}>No hay ventas suficientes para graficar.</Text>
              </View>
            ) : (
              <LineChart
                data={chartData}
                width={screenWidth - 64} // padding
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            )}
          </View>

        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  content: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 12, fontSize: 16, color: '#666' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  chart: { marginVertical: 8, borderRadius: 16, alignSelf: 'center' },
  emptyChart: { height: 180, justifyContent: 'center', alignItems: 'center' },
  emptyChartText: { marginTop: 10, color: '#888', fontSize: 14 }
});
