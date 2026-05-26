import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Header } from '../../components/Header';
import { supabase } from '../../database/supabase';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function MisPedidosScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Error cargando mis pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();

    if (user) {
      const channel = supabase
        .channel(`mis-pedidos-${user.id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${user.id}` },
          () => {
            fetchMyOrders();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Mis Pedidos" />
      
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#D9381E" />
          <Text style={styles.loaderText}>Cargando tu historial...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {orders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={60} color="#ccc" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyText}>Aún no has realizado ningún pedido.</Text>
            </View>
          ) : (
            orders.map((order, index) => {
              const statusStyle = getStatusStyle(order.status);
              const personalOrderNumber = orders.length - index;
              
              return (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderId}>Pedido #{personalOrderNumber}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                      <Text style={[styles.statusText, { color: statusStyle.text }]}>
                        {statusStyle.label}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.orderDate}>{formatDate(order.created_at)}</Text>
                  
                  <View style={styles.divider} />
                  
                  <Text style={styles.instructionsText} numberOfLines={2}>
                    {order.instructions || 'Sin detalles adicionales.'}
                  </Text>
                  
                  <View style={styles.orderFooter}>
                    <Text style={styles.totalLabel}>Total pagado:</Text>
                    <Text style={styles.orderPrice}>Bs {Number(order.total_price).toFixed(2)}</Text>
                  </View>
                </View>
              );
            })
          )}
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
  loaderText: { marginTop: 12, fontSize: 16, color: '#666', fontStyle: 'italic' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 16, color: '#888', textAlign: 'center' },
  orderCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05,
    shadowRadius: 3, elevation: 2,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  orderId: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  orderDate: { fontSize: 14, color: '#888', marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#eee', marginBottom: 12 },
  instructionsText: { fontSize: 14, color: '#555', fontStyle: 'italic', marginBottom: 12 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 14, fontWeight: '600', color: '#666' },
  orderPrice: { fontSize: 20, fontWeight: '900', color: '#D9381E' },
});
