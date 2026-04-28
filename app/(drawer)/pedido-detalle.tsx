import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Header } from '../../components/Header';
import { CustomInput } from '../../components/ui/CustomInput';
import { CustomButton } from '../../components/ui/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

export default function PedidoDetalleScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, totalPrice, clearCart, removeItem } = useCart();
  const [instructions, setInstructions] = useState('');

  const handleConfirmar = () => {
    if (items.length === 0) {
      Alert.alert('Carrito Vacío', 'Agrega algunos productos antes de confirmar.');
      return;
    }
    
    Alert.alert(
      '¡Pedido Confirmado!', 
      'Tu pedido está en proceso. Gracias por preferir Pizza Villa.',
      [
        { 
          text: 'OK', 
          onPress: () => {
            clearCart();
            setInstructions('');
            router.replace('/(drawer)/menu');
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="Tu Pedido" />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Detalles del Cliente</Text>
          <View style={styles.customerInfo}>
            <Ionicons name="person-circle-outline" size={40} color="#888" />
            <View style={styles.customerDetails}>
              <Text style={styles.customerName}>{user?.username || 'Cliente'}</Text>
              <Text style={styles.customerEmail}>{user?.email || 'cliente@pizzavilla.com'}</Text>
            </View>
          </View>
          
          <Text style={styles.label}>Dirección de Entrega</Text>
          <CustomInput 
            placeholder="Ej. Av. Principal #123"
            iconName="location-outline"
          />

          <Text style={styles.label}>Instrucciones Especiales</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Ej. Sin cebolla, tocar el timbre..."
              multiline
              numberOfLines={3}
              value={instructions}
              onChangeText={setInstructions}
              textAlignVertical="top"
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
                  name="trash-outline" 
                  size={20} 
                  color="#D9381E" 
                  onPress={() => removeItem(item.id)} 
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

        <CustomButton 
          title="CONFIRMAR PEDIDO" 
          onPress={handleConfirmar} 
          style={{ marginTop: 16 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  customerDetails: {
    marginLeft: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  customerEmail: {
    fontSize: 14,
    color: '#666',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  textAreaContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
  },
  textArea: {
    height: 60,
    fontSize: 16,
    color: '#333',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cartItemLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 16,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#D9381E',
  },
});
