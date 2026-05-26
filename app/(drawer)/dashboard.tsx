import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Header } from '../../components/Header';
import { StatCard } from '../../components/ui/StatCard';
import { supabase } from '../../database/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrdersAndStats = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total_price,
          instructions,
          status,
          created_at,
          profiles (
            username
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Error cargando pedidos en Dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndStats();

    // Recargar datos al instante 
    const channel = supabase
      .channel('dashboard-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrdersAndStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // P creados hoy
  const totalOrdersToday = orders.filter(order => {
    const today = new Date().toISOString().split('T')[0];
    const orderDate = new Date(order.created_at).toISOString().split('T')[0];
    return orderDate === today;
  }).length;

  //  total de ingresos
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_price), 0);

  //  C de p por estado
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const cookingOrders = orders.filter(order => order.status === 'cooking').length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;

  // Cambiar estado pedido
  const handleUpdateStatus = (orderId: number, currentStatus: string) => {
    if (currentStatus === 'delivered') {
      Alert.alert('Pedido Entregado', 'Este pedido ya ha sido entregado correctamente.');
      return;
    }

    let nextStatus = '';
    let statusLabel = '';
    if (currentStatus === 'pending') {
      nextStatus = 'cooking';
      statusLabel = 'Cocinando 🧑‍🍳';
    } else if (currentStatus === 'cooking') {
      nextStatus = 'delivered';
      statusLabel = 'Entregado 📦';
    }

    Alert.alert(
      'Actualizar Pedido',
      `¿Deseas cambiar el estado del pedido #${orderId} a "${statusLabel}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sí, actualizar', 
          onPress: async () => {
            // Actualización optimista local
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));

            const { error } = await supabase
              .from('orders')
              .update({ status: nextStatus })
              .eq('id', orderId);

            if (error) {
              Alert.alert('Error', 'No se pudo actualizar el estado.');
              // Revertir en caso de error
              fetchOrdersAndStats();
            }
          }
        }
      ]
    );
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: '#F39C1220', text: '#F39C12', label: 'Pendiente' };
      case 'cooking':
        return { bg: '#3498DB20', text: '#3498DB', label: 'Cocinando' };
      case 'delivered':
        return { bg: '#2ECC7120', text: '#2ECC71', label: 'Entregado' };
      default:
        return { bg: '#88820', text: '#888', label: 'Desconocido' };
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Dashboard Admin" />
      
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#D9381E" />
          <Text style={styles.loaderText}>Cargando datos del negocio...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>¡Hola, Administrador! 👋</Text>
            <Text style={styles.dateText}>Panel de Monitoreo de Ventas en Tiempo Real</Text>
          </View>

          <View style={styles.statsRow}>
            <StatCard 
              title="Pedidos Hoy" 
              value={String(totalOrdersToday)} 
              iconName="cart-outline" 
              color="#D9381E" 
            />
            <StatCard 
              title="Ingresos" 
              value={`Bs ${totalRevenue.toFixed(0)}`} 
              iconName="cash-outline" 
              color="#2ECC71" 
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard 
              title="Pendientes" 
              value={String(pendingOrders)} 
              iconName="time-outline" 
              color="#F39C12" 
            />
            <StatCard 
              title="Cocinando" 
              value={String(cookingOrders)} 
              iconName="restaurant-outline" 
              color="#3498DB" 
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard 
              title="Entregados" 
              value={String(deliveredOrders)} 
              iconName="checkmark-circle-outline" 
              color="#2ECC71" 
            />
            <View style={{ flex: 1, marginHorizontal: 8 }} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pedidos Recientes (Pulsa para cambiar estado)</Text>
            
            {orders.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No hay pedidos registrados en la plataforma.</Text>
              </View>
            ) : (
              orders.map(order => {
                const statusStyle = getStatusStyle(order.status);
                const clientName = order.profiles?.username || 'Cliente Pizza Villa';

                return (
                  <TouchableOpacity 
                    key={order.id} 
                    style={styles.orderCard}
                    onPress={() => handleUpdateStatus(order.id, order.status)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.orderLeft}>
                      <View style={styles.orderInfo}>
                        <Text style={styles.orderId}>Pedido #{order.id}</Text>
                        <Text style={styles.customerName}>{clientName}</Text>
                        <Text style={styles.instructionsText} numberOfLines={1}>
                          {order.instructions || 'Sin instrucciones adicionales.'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.orderRight}>
                      <Text style={styles.orderPrice}>Bs {Number(order.total_price).toFixed(2)}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>
                          {statusStyle.label}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </ScrollView>
      )}
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
    paddingBottom: 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
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
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  orderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderInfo: {
    flex: 1,
    paddingRight: 10,
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
  instructionsText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },
  orderRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
