import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function DrawerLayout() {
  const { isAdmin } = useAuth();

  return (
    <Drawer
      initialRouteName={isAdmin ? 'dashboard' : 'menu'}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#D9381E',
        drawerInactiveTintColor: '#333',
        drawerStyle: {
          backgroundColor: '#f8f8f8',
        },
      }}
    >
      <Drawer.Screen
        name="dashboard"
        options={{
          drawerItemStyle: isAdmin ? {} : { display: 'none' },
          drawerLabel: 'Dashboard',
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="reportes"
        options={{
          drawerItemStyle: isAdmin ? {} : { display: 'none' },
          drawerLabel: 'Reportes',
          title: 'Reportes',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />
      
      <Drawer.Screen
        name="menu"
        options={{
          drawerItemStyle: isAdmin ? { display: 'none' } : {},
          drawerLabel: 'Menú',
          title: 'Menú',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="restaurant-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="pedido-detalle"
        options={{
          drawerItemStyle: isAdmin ? { display: 'none' } : {},
          drawerLabel: 'Carrito',
          title: 'Pedido',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="mis-pedidos"
        options={{
          drawerItemStyle: isAdmin ? { display: 'none' } : {},
          drawerLabel: 'Mis Pedidos',
          title: 'Mis Pedidos',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="promociones"
        options={{
          drawerItemStyle: isAdmin ? { display: 'none' } : {},
          drawerLabel: 'Promociones',
          title: 'Promociones',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="pricetag-outline" size={size} color={color} />
          ),
        }}
      />
      
      {/* Común para ambos */}
      <Drawer.Screen
        name="perfil"
        options={{
          drawerLabel: 'Mi Perfil',
          title: 'Mi Perfil',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
