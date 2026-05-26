import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Header } from '../../components/Header';
import { ProductCard } from '../../components/ui/ProductCard';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../database/supabase';

export default function MenuScreen() {
  const router = useRouter();
  const { addItem, totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Pizzas');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pizzas')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      if (data) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Error cargando el catálogo:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = ['Pizzas', 'Bebidas', 'Extras'];

  const filteredProducts = products.filter(p =>
    p.category === activeCategory &&
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLocalImage = (title: string) => {
    if (!title) return require('../../assets/images/placeholder.jpg');
    const t = title.toLowerCase();

    // Pizzas
    if (t.includes('margarita')) return require('../../assets/images/pizza_margarita.jpg');
    if (t.includes('pepperoni')) return require('../../assets/images/pizza_pepperoni.jpg');
    if (t.includes('cuatro quesos') || t.includes('4 quesos')) return require('../../assets/images/pizza_cuatro_quesos.jpg');
    if (t.includes('vegetariana')) return require('../../assets/images/pizza_vegetariana.jpg');
    if (t.includes('carnívora') || t.includes('carnivora')) return require('../../assets/images/pizza_carnivora.jpg');
    if (t.includes('barbacoa')) return require('../../assets/images/pizza_barbacoa.jpg');

    // Bebidas
    if (t.includes('coca cola')) return require('../../assets/images/bebida_coca_cola.jpg');
    if (t.includes('sprite')) return require('../../assets/images/bebida_sprite.jpg');
    if (t.includes('fanta')) return require('../../assets/images/bebida_fanta.jpg');
    if (t.includes('naranja')) return require('../../assets/images/jugo_naranja.jpg');
    if (t.includes('papaya')) return require('../../assets/images/jugo_papaya.jpg');

    // Extras
    if (t.includes('pan al ajo')) return require('../../assets/images/pan_ajo.png');
    if (t.includes('palitos')) return require('../../assets/images/extra_palitos_queso.jpg');
    if (t.includes('alitas')) return require('../../assets/images/ALITAS-SALSA-1024x1024.jpg');

    return require('../../assets/images/placeholder.jpg');
  };

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

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#D9381E" />
          <Text style={styles.loaderText}>Cargando delicias...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="pizza-outline" size={60} color="#ccc" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyText}>No encontramos productos en esta categoría.</Text>
            </View>
          ) : (
            filteredProducts.map(product => {
              const localImageSource = getLocalImage(product.title);

              return (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  description={product.description}
                  price={Number(product.price)}
                  imageUrl={localImageSource}
                  onAdd={() => addItem({ id: String(product.id), title: product.title, price: Number(product.price) })}
                />
              );
            })
          )}
        </ScrollView>
      )}

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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
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
