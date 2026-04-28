import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { CustomInput } from '../components/ui/CustomInput';
import { CustomButton } from '../components/ui/CustomButton';
import { getDatabase } from '../database/db';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    password: '',
  });

  const handleRegister = async () => {
    if (!formData.nombre || !formData.correo || !formData.password) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios (Nombre, Correo, Contraseña)');
      return;
    }

    try {
      const db = await getDatabase();

      // Checar si el correo ya existe
      const existingUser = await db.getFirstAsync('SELECT * FROM users WHERE email = $email', { $email: formData.correo.trim() });

      if (existingUser) {
        Alert.alert('Error', 'Este correo ya está registrado.');
        return;
      }

      // Insertar usuario
      const username = `${formData.nombre} ${formData.apellido}`.trim();
      const result = await db.runAsync(
        'INSERT INTO users (username, email, password, role) VALUES ($username, $email, $password, $role)',
        { $username: username, $email: formData.correo.trim(), $password: formData.password.trim(), $role: 'client' }
      );

      login({
        id: result.lastInsertRowId,
        username: username,
        email: formData.correo.trim(),
        role: 'client'
      });

      Alert.alert('Éxito', 'Cuenta creada correctamente.', [
        { text: 'OK', onPress: () => router.replace('/(drawer)/menu') }
      ]);

    } catch (error: any) {
      console.error('Error registering user:', error);
      Alert.alert('Error', `Hubo un problema al crear la cuenta: ${error.message || error}`);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Crea tu Cuenta</Text>
          <Text style={styles.subtitle}>Únete a la familia Pizza Villa</Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            placeholder="Nombre"
            iconName="person-outline"
            value={formData.nombre}
            onChangeText={(text) => setFormData({ ...formData, nombre: text })}
          />
          <CustomInput
            placeholder="Apellido"
            iconName="people-outline"
            value={formData.apellido}
            onChangeText={(text) => setFormData({ ...formData, apellido: text })}
          />
          <CustomInput
            placeholder="Correo Electrónico"
            iconName="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.correo}
            onChangeText={(text) => setFormData({ ...formData, correo: text })}
          />
          <CustomInput
            placeholder="Teléfono"
            iconName="call-outline"
            keyboardType="phone-pad"
            value={formData.telefono}
            onChangeText={(text) => setFormData({ ...formData, telefono: text })}
          />
          <CustomInput
            placeholder="Contraseña"
            iconName="lock-closed-outline"
            isPassword
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
          />

          <CustomButton
            title="CREAR CUENTA"
            onPress={handleRegister}
            style={{ marginTop: 20 }}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
            <Link href="/login" replace asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Inicia Sesión</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#D9381E',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
