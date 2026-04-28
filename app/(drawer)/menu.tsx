import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Header } from '../../components/Header';
import { ProductCard } from '../../components/ui/ProductCard';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'expo-router';

const mockProducts = [
  { id: '1', title: 'Pizza Hawaiana', description: 'Jamón, piña, queso mozzarella.', price: 75, category: 'Pizzas', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  { id: '2', title: 'Pizza Pepperoni', description: 'Pepperoni doble, queso mozzarella.', price: 80, category: 'Pizzas', imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  { id: '3', title: 'Pizza 4 Quesos', description: 'Mozzarella, parmesano, roquefort, provolone.', price: 85, category: 'Pizzas', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  { id: '4', title: 'Refresco 2L', description: 'Cola, Limón o Naranja.', price: 15, category: 'Bebidas', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  { id: '5', title: 'Pan al Ajo', description: '4 porciones de pan tostado con mantequilla de ajo.', price: 20, category: 'Extras', imageUrl: require('../../assets/images/garlic_bread.png') },
];

const categories = ['Pizzas', 'Bebidas', 'Extras'];

export default function MenuScreen() {
  const router = useRouter();
  const { addItem, totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Pizzas');

  const filteredProducts = mockProducts.filter(p => 
    p.category === activeCategory &&
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header title="Menú / Catálogo" />
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabs}>
        {categories.map(category => (
          <TouchableOpacity 
            key={category} 
            style={[styles.tab, activeCategory === category && styles.activeTab]}
            onPress={() => setActiveCategory(category)}
          >
            <Text style={[styles.tabText, activeCategory === category && styles.activeTabText]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            title={product.title}
            description={product.description}
            price={product.price}
            imageUrl={product.imageUrl}
            onAdd={() => addItem({ id: product.id, title: product.title, price: product.price })}
          />
        ))}
      </ScrollView>

      {totalItems > 0 && (
        <TouchableOpacity style={styles.floatingCart} onPress={() => router.push('/(drawer)/pedido-detalle')} activeOpacity={0.9}>
          <View style={styles.cartInfo}>
            <Ionicons name="cart" size={24} color="#fff" />
            <Text style={styles.cartCount}>{totalItems} items</Text>
          </View>
          <Text style={styles.cartTotal}>Ver Carrito</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#D9381E',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#D9381E',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, 
  },
  floatingCart: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#D9381E',
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#D9381E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartCount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cartTotal: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
