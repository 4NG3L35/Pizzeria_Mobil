import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function NotificacionesScreen() {
  const router = useRouter();

  const [notifications, setNotifications] = useState([
    {
      id: '3',
      title: 'Bienvenido a Pizza Villa 🍕',
      message: 'Gracias por registrarte. ¡Esperamos que disfrutes nuestras delicias!',
      time: 'Ayer',
      read: false,
      icon: 'pizza'
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.notificationCard, !item.read && styles.unreadCard]}
            onPress={() => markAsRead(item.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, !item.read && styles.unreadIconContainer]}>
              <Ionicons name={item.icon as any} size={24} color={item.read ? '#888' : '#D9381E'} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.title, !item.read && styles.unreadText]}>{item.title}</Text>
              <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            {!item.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f8f8', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  listContent: { padding: 16 },
  notificationCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, alignItems: 'center' },
  unreadCard: { backgroundColor: '#fff5f3', borderColor: '#ffe0db', borderWidth: 1 },
  iconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  unreadIconContainer: { backgroundColor: '#ffe0db' },
  textContainer: { flex: 1 },
  title: { fontSize: 16, color: '#333', marginBottom: 4 },
  unreadText: { fontWeight: 'bold', color: '#D9381E' },
  message: { fontSize: 14, color: '#666', marginBottom: 8, lineHeight: 20 },
  time: { fontSize: 12, color: '#aaa', fontStyle: 'italic' },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#D9381E', marginLeft: 8 },
});
