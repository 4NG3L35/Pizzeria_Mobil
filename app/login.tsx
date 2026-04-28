import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { CustomInput } from '../components/ui/CustomInput';
import { CustomButton } from '../components/ui/CustomButton';
import { getDatabase } from '../database/db';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
      return;
    }

    try {
      const db = await getDatabase();
      const user: any = await db.getFirstAsync(
        'SELECT * FROM users WHERE (email = $email1 OR username = $email2) AND password = $password',
        { $email1: email.trim(), $email2: email.trim(), $password: password.trim() }
      );

      if (user) {
        // Autenticación exitosa
        login({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        });
        
        // Redirigir según el rol
        if (user.role === 'admin') {
          router.replace('/(drawer)/dashboard');
        } else {
          router.replace('/(drawer)/menu');
        }
      } else {
        const allUsers = await db.getAllAsync('SELECT * FROM users');
        console.log('Usuarios en BD:', allUsers);
        console.log('Intento de login con:', { email: email.trim(), password: password.trim() });
        Alert.alert('Error', 'Correo o contraseña incorrectos');
      }
    } catch (error: any) {
      console.error('Error in login:', error);
      Alert.alert('Error', `Hubo un problema al iniciar sesión: ${error.message || error}`);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Pizza Villa</Text>
          <Text style={styles.subtitle}>Speranza</Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            placeholder="Usuario o Correo Electrónico"
            iconName="person-outline"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <CustomInput
            placeholder="Contraseña"
            iconName="lock-closed-outline"
            isPassword
            value={password}
            onChangeText={setPassword}
          />
          
          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          <CustomButton 
            title="INICIAR SESIÓN" 
            onPress={handleLogin} 
            style={{ marginTop: 20 }}
          />

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes cuenta? </Text>
            <Link href="/registro" replace asChild>
              <TouchableOpacity>
                <Text style={styles.registerLink}>Regístrate aquí</Text>
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
    fontSize: 42,
    fontWeight: '900',
    color: '#D9381E',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: '#F39C12',
    fontWeight: '600',
    marginTop: -5,
  },
  form: {
    width: '100%',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#888',
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: '#D9381E',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
