import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { CustomInput } from '../components/ui/CustomInput';
import { CustomButton } from '../components/ui/CustomButton';
import { supabase } from '../database/supabase';

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.nombre || !formData.correo || !formData.password) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios (Nombre, Correo, Contraseña)');
      return;
    }

    setLoading(true);
    try {
      const username = `${formData.nombre} ${formData.apellido}`.trim();
      const email = formData.correo.trim();
      const password = formData.password.trim();

      // Registrar al usuario en Supabase Auth
      // Al pasar la metadata 'username' y 'role', nuestro trigger de base de datos 
      // creará automáticamente el perfil en la tabla public.profiles.
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username,
            role: 'client', // Rol inicial por defecto
          }
        }
      });

      if (error) {
        Alert.alert('Error', error.message);
        setLoading(false);
        return;
      }

      // Si el registro fue exitoso
      if (data?.session) {
        Alert.alert('Éxito', '¡Cuenta creada correctamente! Iniciando sesión...', [
          { text: 'OK', onPress: () => router.replace('/(drawer)/menu') }
        ]);
      } else {
        // En Supabase, por defecto la confirmación por correo está activada.
        // Si está activa, el usuario no inicia sesión de golpe sino que debe confirmar su mail.
        // Damos un aviso amigable por si acaso.
        Alert.alert(
          'Registro Exitoso', 
          'Se ha creado tu cuenta. Si la confirmación por correo está activa en tu Supabase, revisa tu correo. De lo contrario, puedes iniciar sesión directamente.',
          [
            { text: 'OK', onPress: () => router.replace('/login') }
          ]
        );
      }

    } catch (error: any) {
      console.error('Error al registrar usuario:', error);
      Alert.alert('Error', `Hubo un problema al crear la cuenta: ${error.message || error}`);
    } finally {
      setLoading(false);
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
            editable={!loading}
          />
          <CustomInput
            placeholder="Apellido"
            iconName="people-outline"
            value={formData.apellido}
            onChangeText={(text) => setFormData({ ...formData, apellido: text })}
            editable={!loading}
          />
          <CustomInput
            placeholder="Correo Electrónico"
            iconName="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.correo}
            onChangeText={(text) => setFormData({ ...formData, correo: text })}
            editable={!loading}
          />
          <CustomInput
            placeholder="Teléfono"
            iconName="call-outline"
            keyboardType="phone-pad"
            value={formData.telefono}
            onChangeText={(text) => setFormData({ ...formData, telefono: text })}
            editable={!loading}
          />
          <CustomInput
            placeholder="Contraseña"
            iconName="lock-closed-outline"
            isPassword
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            editable={!loading}
          />

          <CustomButton
            title={loading ? "CREANDO CUENTA..." : "CREAR CUENTA"}
            onPress={handleRegister}
            style={{ marginTop: 20 }}
            disabled={loading}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
            <Link href="/login" replace asChild>
              <TouchableOpacity disabled={loading}>
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
