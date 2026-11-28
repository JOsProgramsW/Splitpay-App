import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GastoResponse } from '../types/gastos';

interface Props {
  gasto: GastoResponse;
}

export const ExpenseCard: React.FC<Props> = ({ gasto }) => {
  const progreso = gasto.totalCuotas > 0 ? (gasto.cuotasPagadas / gasto.totalCuotas) * 100 : 0;
  const fechaFormateada = new Date(gasto.fechaGasto).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.concepto}>{gasto.concepto}</Text>
          <Text style={styles.fecha}>{fechaFormateada}</Text>
        </View>
        <Text style={styles.monto}>${gasto.montoTotal.toFixed(2)}</Text>
      </View>

      {gasto.descripcion ? <Text style={styles.descripcion}>{gasto.descripcion}</Text> : null}

      <View style={styles.footer}>
        <Text style={styles.progresoTexto}>
          {gasto.cuotasPagadas} de {gasto.totalCuotas} pagados
        </Text>
        <View style={styles.barraFondo}>
          <View style={[styles.barraRelleno, { width: `${progreso}%` }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  concepto: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  fecha: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  monto: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  descripcion: {
    fontSize: 13,
    color: '#475569',
    marginTop: 6,
  },
  footer: {
    marginTop: 12,
  },
  progresoTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  barraFondo: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barraRelleno: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 4,
  },
});