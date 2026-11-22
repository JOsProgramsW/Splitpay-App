import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hola, {user?.nombreCompleto}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          Grupo: {user?.nombreGrupo} | COD: {user?.codigoInvitacion} | Rol: {user?.rol}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Estado de Sesión JWT</Text>
        <Text style={styles.cardValue}>Conectado correctamente</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#F9FAFB' },
  greeting: { fontSize: 22, fontWeight: '700', color: '#111827' },
  badge: { backgroundColor: '#E5E7EB', padding: 10, borderRadius: 8, marginTop: 8, marginBottom: 24 },
  badgeText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 24 },
  cardLabel: { fontSize: 14, color: '#6B7280' },
  cardValue: { fontSize: 18, fontWeight: '700', color: '#059669', marginTop: 4 },
  logoutBtn: { backgroundColor: '#DC2626', padding: 14, borderRadius: 10, alignItems: 'center' },
  logoutText: { color: '#FFF', fontWeight: '700' },
});