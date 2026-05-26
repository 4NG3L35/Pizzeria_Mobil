import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { CustomInput } from '../components/ui/CustomInput';
import { CustomButton } from '../components/ui/CustomButton';
import { supabase } from '../database/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState(''); // Puede ser correo o nombre de usuario
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
      return;
    }

    setLoading(true);
    try {
      let targetEmail = identifier.trim();

      // SOPORTE INTELIGENTE: Si no contiene '@', asumimos que ingresó su nombre de usuario.
      // Buscamos el correo correspondiente en la tabla 'profiles' de Supabase.
      if (!targetEmail.includes('@')) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', targetEmail)
          .maybeSingle(); // Usamos maybeSingle para evitar crasheos si no hay coincidencia

        if (profile?.email) {
          targetEmail = profile.email;
        } else {
          Alert.alert('Error', 'No se encontró ningún usuario con ese nombre de usuario.');
          setLoading(false);
          return;
        }
      }

      // Autenticación real en Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: password.trim(),
      });

      if (error) {
        Alert.alert('Error al iniciar sesión', error.message);
        setLoading(false);
        return;
      }

      // Si todo sale bien, buscamos el rol en el perfil para la redirección inmediata
      if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        const role = profile?.role || 'client';

        // Redirigir según el rol
        if (role === 'admin') {
          router.replace('/(drawer)/dashboard');
        } else {
          router.replace('/(drawer)/menu');
        }
      }

    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      Alert.alert('Error', `Hubo un problema al iniciar sesión: ${error.message || error}`);
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
          <Text style={styles.title}>Pizza Villa</Text>
          <Text style={styles.subtitle}>Speranza</Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            placeholder="Usuario o Correo Electrónico"
            iconName="person-outline"
            value={identifier}
            onChangeText={setIdentifier}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          <CustomInput
            placeholder="Contraseña"
            iconName="lock-closed-outline"
            isPassword
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
          
          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity disabled={loading}>
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          <CustomButton 
            title={loading ? "INICIANDO SESIÓN..." : "INICIAR SESIÓN"} 
            onPress={handleLogin} 
            style={{ marginTop: 20 }}
            disabled={loading}
          />

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes cuenta? </Text>
            <Link href="/registro" replace asChild>
              <TouchableOpacity disabled={loading}>
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
