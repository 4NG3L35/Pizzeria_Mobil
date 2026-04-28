import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { useEffect } from 'react';
import { initDatabase } from '../database/db';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <CartProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="registro" />
            <Stack.Screen name="(drawer)" />
          </Stack>
          <StatusBar style="light" backgroundColor="#D9381E" />
        </CartProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
