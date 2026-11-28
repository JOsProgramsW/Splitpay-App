import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { gastoService } from '../services/gastoService';

type Props = NativeStackScreenProps<any, 'CreateExpense'>;

export default function CreateExpenseScreen({ navigation, route }: Props) {
  const totalMiembros: number = route.params?.totalMiembros || 1;

  const [concepto, setConcepto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [montoTotal, setMontoTotal] = useState('');
  const [guardando, setGuardando] = useState(false);

  const montoNumerico = parseFloat(montoTotal) || 0;
  const cuotaEstimada = totalMiembros > 0 ? montoNumerico / totalMiembros : 0;

  const handleGuardar = async () => {
    if (!concepto.trim()) {
      Alert.alert('Validación', 'Ingresa el concepto del gasto.');
      return;
    }
    if (montoNumerico <= 0) {
      Alert.alert('Validación', 'El monto total debe ser mayor a $0.00.');
      return;
    }

    try {
      setGuardando(true);
      await gastoService.crearGasto({
        concepto: concepto.trim(),
        descripcion: descripcion.trim() || undefined,
        montoTotal: montoNumerico,
      });
      Alert.alert('Éxito', 'Gasto registrado y cuotas asignadas equitativamente.', [
        { text: 'Aceptar', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.mensaje || 'No se pudo registrar el gasto.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.label}>Concepto *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Recibo de Luz CFE"
        value={concepto}
        onChangeText={setConcepto}
      />

      <Text style={styles.label}>Descripción (Opcional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Detalles del gasto..."
        multiline
        numberOfLines={3}
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <Text style={styles.label}>Monto Total ($) *</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        keyboardType="decimal-pad"
        value={montoTotal}
        onChangeText={setMontoTotal}
      />

      <View style={styles.previewBox}>
        <Text style={styles.previewTitulo}>Vista previa de prorrateo automático</Text>
        <Text style={styles.previewDetalle}>
          Se dividirá entre {totalMiembros} {totalMiembros === 1 ? 'miembro' : 'miembros'}:
        </Text>
        <Text style={styles.previewMonto}>${cuotaEstimada.toFixed(2)} c/u</Text>
      </View>

      <TouchableOpacity
        style={[styles.botonGuardar, guardando && { opacity: 0.7 }]}
        onPress={handleGuardar}
        disabled={guardando}
      >
        {guardando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.botonTexto}>Guardar y Asignar Cuotas</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  label: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#0F172A',
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  previewBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  previewTitulo: { fontSize: 13, fontWeight: '700', color: '#1D4ED8' },
  previewDetalle: { fontSize: 14, color: '#1E3A8A', marginTop: 4 },
  previewMonto: { fontSize: 22, fontWeight: '800', color: '#1E40AF', marginTop: 4 },
  botonGuardar: {
    backgroundColor: '#0F172A',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  botonTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});