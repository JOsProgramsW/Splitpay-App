import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { gastoService } from '../services/gastoService';
import { GastoResponse } from '../types/gastos';
import { ExpenseCard } from '../components/ExpenseCard';

export default function ExpensesListScreen() {
  const [gastos, setGastos] = useState<GastoResponse[]>([]);
  const [filtro, setFiltro] = useState<'Todos' | 'Pendientes'>('Todos');
  const [cargando, setCargando] = useState(true);

  const cargarGastos = async () => {
    try {
      setCargando(true);
      const data = await gastoService.listarGastos(filtro);
      setGastos(data);
    } catch (error) {
      console.error('Error al cargar gastos:', error);
    } finally {
      setCargando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarGastos();
    }, [filtro])
  );

  return (
    <View style={styles.container}>
      <View style={styles.filtrosRow}>
        {(['Todos', 'Pendientes'] as const).map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.pill, filtro === item && styles.pillActiva]}
            onPress={() => setFiltro(item)}
          >
            <Text style={[styles.pillTexto, filtro === item && styles.pillTextoActivo]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {cargando ? (
        <ActivityIndicator size="large" color="#0F172A" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={gastos}
          keyExtractor={(item) => item.gastoId.toString()}
          renderItem={({ item }) => <ExpenseCard gasto={item} />}
          ListEmptyComponent={
            <Text style={styles.vacio}>No hay gastos registrados en esta categoría.</Text>
          }
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  filtrosRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  pillActiva: { backgroundColor: '#0F172A' },
  pillTexto: { fontWeight: '600', color: '#334155' },
  pillTextoActivo: { color: '#FFFFFF' },
  vacio: { textAlign: 'center', color: '#64748B', marginTop: 40, fontSize: 15 },
});