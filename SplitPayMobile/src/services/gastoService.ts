import apiClient from '../api/apiClient';
import { CreateGastoRequest, GastoResponse, GrupoResumen } from '../types/gastos';

export const gastoService = {
  obtenerResumenGrupo: async (): Promise<GrupoResumen> => {
    const response = await apiClient.get<GrupoResumen>('/Grupos/resumen');
    return response.data;
  },

  listarGastos: async (estado?: string): Promise<GastoResponse[]> => {
    const params = estado && estado !== 'Todos' ? { estado } : {};
    const response = await apiClient.get<GastoResponse[]>('/Gastos', { params });
    return response.data;
  },

  crearGasto: async (datos: CreateGastoRequest): Promise<GastoResponse> => {
    const response = await apiClient.post<GastoResponse>('/Gastos', datos);
    return response.data;
  },

  eliminarGasto: async (gastoId: number): Promise<void> => {
    await apiClient.delete(`/Gastos/${gastoId}`);
  },
};