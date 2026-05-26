import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Header } from '../../components/Header';
import { CustomInput } from '../../components/ui/CustomInput';
import { CustomButton } from '../../components/ui/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { supabase } from '../../database/supabase';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function PedidoDetalleScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, totalPrice, clearCart, removeItem } = useCart();
  
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [instructions, setInstructions] = useState('');
  const [direccion, setDireccion] = useState('');
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  // Coordenadas por defecto 
  const [region, setRegion] = useState({
    latitude: -16.5000, 
    longitude: -68.1193,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });
  const [markerCoordinate, setMarkerCoordinate] = useState(region);

  const getCurrentLocation = async () => {
    setLocating(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación.');
        setLocating(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setRegion(newRegion);
      setMarkerCoordinate(newRegion);
    } catch (error) {
      Alert.alert('Error', 'No pudimos obtener tu ubicación actual.');
    } finally {
      setLocating(false);
    }
  };

  const handleConfirmar = async () => {
    if (items.length === 0) {
      Alert.alert('Carrito Vacío', 'Agrega algunos productos antes de confirmar.');
      return;
    }

    if (!user) {
      Alert.alert('Sesión no Iniciada', 'Por favor inicia sesión para realizar tu pedido.');
      router.replace('/login');
      return;
    }

    if (deliveryMethod === 'delivery' && !direccion.trim()) {
      Alert.alert('Dirección Requerida', 'Por favor ingresa tu dirección de entrega.');
      return;
    }

    setLoading(true);
    try {
      let finalInstructions = deliveryMethod === 'pickup' 
        ? `RECOJO EN LOCAL. ${instructions.trim() ? `Instrucciones: ${instructions.trim()}` : ''}`
        : `ENVÍO A DOMICILIO. Dirección: ${direccion.trim()} (Lat: ${markerCoordinate.latitude.toFixed(4)}, Lng: ${markerCoordinate.longitude.toFixed(4)}). ${instructions.trim() ? `Instrucciones: ${instructions.trim()}` : ''}`;
      
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_price: totalPrice,
          instructions: finalInstructions,
          status: 'pending'
        })
        .select('id')
        .single();

      if (orderError) throw orderError;

      const details = items.map(item => ({
        order_id: orderData.id,
        pizza_id: Number(item.id),
        quantity: item.quantity,
        price: item.price
      }));

      const { error: detailsError } = await supabase
        .from('order_details')
        .insert(details);

      if (detailsError) throw detailsError;

      Alert.alert(
        '¡Pedido Confirmado!', 
        deliveryMethod === 'pickup' 
          ? 'Tu pedido está siendo preparado. Pasa a recogerlo en 30 minutos.' 
          : 'Tu pedido está en camino a la cocina. Te lo enviaremos pronto.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              clearCart();
              setInstructions('');
              setDireccion('');
              router.replace('/(drawer)/mis-pedidos'); // Redirigir al historial para que lo vea
            }
          }
        ]
      );

    } catch (err: any) {
      console.error('Error al confirmar pedido:', err);
      Alert.alert('Error', `No pudimos procesar tu pedido: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="Tu Pedido" />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* Selector de Método de Entrega */}
        <View style={styles.methodSelector}>
          <TouchableOpacity 
            style={[styles.methodOption, deliveryMethod === 'delivery' && styles.methodOptionActive]}
            onPress={() => setDeliveryMethod('delivery')}
          >
            <Ionicons name="bicycle-outline" size={24} color={deliveryMethod === 'delivery' ? '#fff' : '#666'} />
            <Text style={[styles.methodText, deliveryMethod === 'delivery' && styles.methodTextActive]}>Envío a Domicilio</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.methodOption, deliveryMethod === 'pickup' && styles.methodOptionActive]}
            onPress={() => setDeliveryMethod('pickup')}
          >
            <Ionicons name="storefront-outline" size={24} color={deliveryMethod === 'pickup' ? '#fff' : '#666'} />
            <Text style={[styles.methodText, deliveryMethod === 'pickup' && styles.methodTextActive]}>Recoger en Local</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Detalles del Cliente</Text>
          <View style={styles.customerInfo}>
            <Ionicons name="person-circle-outline" size={40} color="#888" />
            <View style={styles.customerDetails}>
              <Text style={styles.customerName}>{user?.username || 'Cliente'}</Text>
              <Text style={styles.customerEmail}>{user?.email || 'correo@ejemplo.com'}</Text>
            </View>
          </View>
          
          {deliveryMethod === 'delivery' && (
            <>
              <Text style={styles.label}>Dirección de Entrega *</Text>
              <CustomInput 
                placeholder="Ej. Av. Principal #123"
                iconName="location-outline"
                value={direccion}
                onChangeText={setDireccion}
                editable={!loading}
              />

              <Text style={styles.label}>Ubica el pin en el mapa</Text>
              <View style={styles.mapContainer}>
                <MapView 
                  style={styles.map}
                  region={region}
                  onRegionChangeComplete={(r) => setMarkerCoordinate(r)}
                >
                  <Marker coordinate={markerCoordinate} title="Tu ubicación" description="Entregaremos aquí" />
                </MapView>
                <View style={styles.mapOverlayPointer} pointerEvents="none">
                  <Ionicons name="location" size={40} color="#D9381E" />
                </View>
              </View>

              <TouchableOpacity 
                style={styles.locationButton} 
                onPress={getCurrentLocation}
                disabled={locating}
              >
                {locating ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="navigate-circle-outline" size={24} color="#fff" />
                )}
                <Text style={styles.locationButtonText}>
                  {locating ? 'Ubicando...' : 'Ubicar mi posición actual'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <Text style={styles.label}>Instrucciones Especiales</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder={deliveryMethod === 'pickup' ? "Ej. Paso a recogerlo a las 8pm..." : "Ej. Tocar el timbre fuerte, sin cebolla..."}
              multiline
              numberOfLines={3}
              value={instructions}
              onChangeText={setInstructions}
              textAlignVertical="top"
              editable={!loading}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Resumen (Carrito)</Text>
          {items.length === 0 ? (
            <Text style={styles.emptyText}>No hay productos en tu carrito.</Text>
          ) : (
            items.map(item => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.cartItemLeft}>
                  <Text style={styles.itemText}>{item.quantity}x {item.title}</Text>
                  <Text style={styles.itemPrice}>Bs {(item.price * item.quantity).toFixed(2)}</Text>
                </View>
                <Ionicons 
                  name="trash-outline" size={20} color="#D9381E" 
                  onPress={() => !loading && removeItem(item.id)} 
                />
              </View>
            ))
          )}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalAmount}>Bs {totalPrice.toFixed(2)}</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#D9381E" />
            <Text style={styles.loadingText}>Procesando tu pedido...</Text>
          </View>
        ) : (
          <CustomButton title="CONFIRMAR PEDIDO" onPress={handleConfirmar} style={{ marginTop: 16 }} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  content: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  methodSelector: { flexDirection: 'row', backgroundColor: '#e0e0e0', borderRadius: 12, padding: 4, marginBottom: 16 },
  methodOption: { flex: 1, flexDirection: 'row', paddingVertical: 12, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  methodOptionActive: { backgroundColor: '#D9381E', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
  methodText: { fontSize: 14, fontWeight: '600', color: '#666', marginLeft: 8 },
  methodTextActive: { color: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  customerInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  customerDetails: { marginLeft: 12 },
  customerName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  customerEmail: { fontSize: 14, color: '#666' },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 8 },
  mapContainer: { height: 180, width: '100%', borderRadius: 12, overflow: 'hidden', marginBottom: 12, position: 'relative' },
  map: { ...StyleSheet.absoluteFillObject },
  mapOverlayPointer: { position: 'absolute', top: '50%', left: '50%', marginLeft: -20, marginTop: -40 },
  locationButton: { flexDirection: 'row', backgroundColor: '#3498DB', paddingVertical: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginBottom: 16 },
  locationButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginLeft: 8 },
  textAreaContainer: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0', padding: 12 },
  textArea: { height: 60, fontSize: 16, color: '#333' },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cartItemLeft: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 16 },
  itemText: { fontSize: 16, color: '#333', flex: 1 },
  itemPrice: { fontSize: 16, fontWeight: '600', color: '#666' },
  emptyText: { color: '#888', fontStyle: 'italic', textAlign: 'center', marginVertical: 10 },
  divider: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  totalAmount: { fontSize: 24, fontWeight: '900', color: '#D9381E' },
  loadingContainer: { alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  loadingText: { marginTop: 8, fontSize: 16, color: '#666' },
});
