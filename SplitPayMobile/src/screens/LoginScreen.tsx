import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [tipoRegistro, setTipoRegistro] = useState<'CrearGrupo' | 'UnirseGrupo'>('CrearGrupo');
  const [loading, setLoading] = useState(false);

  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreGrupo, setNombreGrupo] = useState('');
  const [codigoInvitacion, setCodigoInvitacion] = useState('');

  const handleSubmit = async () => {
    if (!email || !password || (isRegister && !nombreCompleto)) {
      Alert.alert('Campos requeridos', 'Por favor completa los datos obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isRegister ? '/Auth/register' : '/Auth/login';
      const payload = isRegister
        ? { nombreCompleto, email, password, tipoRegistro, nombreGrupo, codigoInvitacion }
        : { email, password };

      const response = await apiClient.post(endpoint, payload);
      await signIn(response.data);
    } catch (error: any) {
      const msg = error.response?.data?.mensaje || 'No se pudo conectar con el servidor.';
      Alert.alert('Error de autenticación', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>SPLITPAY</Text>
      <Text style={styles.subtitle}>Control de Gastos Compartidos</Text>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, !isRegister && styles.toggleActive]}
          onPress={() => setIsRegister(false)}
        >
          <Text style={[styles.toggleText, !isRegister && styles.textWhite]}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, isRegister && styles.toggleActive]}
          onPress={() => setIsRegister(true)}
        >
          <Text style={[styles.toggleText, isRegister && styles.textWhite]}>Registrarse</Text>
        </TouchableOpacity>
      </View>

      {isRegister && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nombre Completo"
            value={nombreCompleto}
            onChangeText={setNombreCompleto}
          />
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.subBtn, tipoRegistro === 'CrearGrupo' && styles.subActive]}
              onPress={() => setTipoRegistro('CrearGrupo')}
            >
              <Text style={styles.subText}>Crear Grupo (Admin)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.subBtn, tipoRegistro === 'UnirseGrupo' && styles.subActive]}
              onPress={() => setTipoRegistro('UnirseGrupo')}
            >
              <Text style={styles.subText}>Unirse con Código</Text>
            </TouchableOpacity>
          </View>

          {tipoRegistro === 'CrearGrupo' ? (
            <TextInput
              style={styles.input}
              placeholder="Nombre del Grupo (ej. Depa 4B)"
              value={nombreGrupo}
              onChangeText={setNombreGrupo}
            />
          ) : (
            <TextInput
              style={styles.input}
              placeholder="Código de Invitación (6 caracteres)"
              autoCapitalize="characters"
              value={codigoInvitacion}
              onChangeText={setCodigoInvitacion}
            />
          )}
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F9FAFB' },
  logo: { fontSize: 32, fontWeight: '900', textAlign: 'center', color: '#111827', letterSpacing: 2 },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#6B7280', marginBottom: 28 },
  toggleRow: { flexDirection: 'row', marginBottom: 16, borderRadius: 10, backgroundColor: '#E5E7EB', padding: 4 },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  toggleActive: { backgroundColor: '#1F2937' },
  toggleText: { fontWeight: '600', color: '#374151' },
  textWhite: { color: '#FFFFFF' },
  subBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  subActive: { backgroundColor: '#D1D5DB' },
  subText: { fontSize: 12, fontWeight: '600', color: '#111827' },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, padding: 14, marginBottom: 14 },
  submitBtn: { backgroundColor: '#111827', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  submitText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});