import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { gastoService } from '../services/gastoService';
import { GastoResponse, GrupoResumen } from '../types/gastos';
import { ExpenseCard } from '../components/ExpenseCard';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<any>();

  const [resumen, setResumen] = useState<GrupoResumen | null>(null);
  const [ultimosGastos, setUltimosGastos] = useState<GastoResponse[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarDashboard = async () => {
    try {
      setCargando(true);
      const [datosResumen, listaGastos] = await Promise.all([
        gastoService.obtenerResumenGrupo(),
        gastoService.listarGastos(),
      ]);
      setResumen(datosResumen);
      setUltimosGastos(listaGastos.slice(0, 3));
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    } finally {
      setCargando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarDashboard();
    }, [])
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={cargando} onRefresh={cargarDashboard} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.saludo}>Hola, {user?.nombreCompleto}</Text>
          <View style={styles.badgeGrupo}>
            <Text style={styles.badgeTexto}>
              Grupo: {resumen?.nombreGrupo || user?.nombreGrupo} | COD:{' '}
              {resumen?.codigoInvitacion || user?.codigoInvitacion} | Rol: {user?.rol}
            </Text>
          </View>
        </View>
      </View>

      {cargando && !resumen ? (
        <ActivityIndicator size="large" color="#0F172A" style={{ marginVertical: 30 }} />
      ) : (
        <View style={styles.cardBalance}>
          <Text style={styles.balanceLabel}>Tu Deuda Pendiente</Text>
          <Text style={styles.balanceMonto}>
            ${(resumen?.deudaPendienteIndividual ?? 0).toFixed(2)}
          </Text>

          {user?.rol === 'Admin' && (
            <View style={styles.adminRow}>
              <Text style={styles.adminTexto}>
                Por Recaudar (Grupo): ${(resumen?.totalPorRecaudarGrupo ?? 0).toFixed(2)}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.accionesRow}>
        <TouchableOpacity
          style={styles.btnSecundario}
          onPress={() => navigation.navigate('ExpensesList')}
        >
          <Text style={styles.btnSecundarioTexto}>Ver Gastos</Text>
        </TouchableOpacity>

        {user?.rol === 'Admin' && (
          <TouchableOpacity
            style={styles.btnPrimario}
            onPress={() =>
              navigation.navigate('CreateExpense', {
                totalMiembros: resumen?.totalMiembros ?? 1,
              })
            }
          >
            <Text style={styles.btnPrimarioTexto}>+ Nuevo Gasto</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.seccionTitulo}>Últimos Movimientos</Text>
      {ultimosGastos.length === 0 ? (
        <Text style={styles.sinMovimientos}>Aún no hay gastos registrados en el grupo.</Text>
      ) : (
        ultimosGastos.map((g) => <ExpenseCard key={g.gastoId} gasto={g} />)
      )}

      <TouchableOpacity style={styles.btnCerrar} onPress={signOut}>
        <Text style={styles.btnCerrarTexto}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 18 },
  header: { marginBottom: 16, marginTop: 8 },
  saludo: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  badgeGrupo: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  badgeTexto: { fontSize: 12, fontWeight: '600', color: '#334155' },
  cardBalance: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  balanceLabel: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  balanceMonto: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', marginTop: 4 },
  adminRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  adminTexto: { color: '#38BDF8', fontSize: 13, fontWeight: '700' },
  accionesRow: { flexDirection: 'row', gap: 12, marginBottom: 22 },
  btnPrimario: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnPrimarioTexto: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  btnSecundario: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnSecundarioTexto: { color: '#0F172A', fontWeight: '700', fontSize: 15 },
  seccionTitulo: { fontSize: 17, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  sinMovimientos: { color: '#64748B', textAlign: 'center', marginVertical: 20 },
  btnCerrar: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  btnCerrarTexto: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});