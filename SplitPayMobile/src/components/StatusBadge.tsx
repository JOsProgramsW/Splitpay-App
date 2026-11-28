import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  estado: string;
}

export const StatusBadge: React.FC<Props> = ({ estado }) => {
  const getEstilo = () => {
    switch (estado) {
      case 'Pagado':
        return { bg: '#DCFCE7', text: '#166534', label: 'Pagado' };
      case 'EnRevision':
        return { bg: '#FEF9C3', text: '#854D0E', label: 'En Revisión' };
      default:
        return { bg: '#FEE2E2', text: '#991B1B', label: 'Pendiente' };
    }
  };

  const estilo = getEstilo();

  return (
    <View style={[styles.badge, { backgroundColor: estilo.bg }]}>
      <Text style={[styles.text, { color: estilo.text }]}>{estilo.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});