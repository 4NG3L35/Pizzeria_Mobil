import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 20 }}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#D9381E" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function DrawerLayout() {
  const { isAdmin } = useAuth();

  return (
    <Drawer
      initialRouteName={isAdmin ? 'dashboard' : 'menu'}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
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
    </Drawer>
  );
}

const styles = StyleSheet.create({
  logoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#D9381E',
    fontWeight: 'bold',
  },
});
