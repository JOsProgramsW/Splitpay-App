export interface CuotaDetalle {
  cuotaId: number;
  usuarioId: number;
  nombreUsuario: string;
  montoAsignado: number;
  estadoPago: 'Pendiente' | 'EnRevision' | 'Pagado' | string;
}

export interface GastoResponse {
  gastoId: number;
  concepto: string;
  descripcion?: string;
  montoTotal: number;
  fechaGasto: string;
  creadoPor: string;
  totalCuotas: number;
  cuotasPagadas: number;
  cuotas: CuotaDetalle[];
}

export interface CreateGastoRequest {
  concepto: string;
  descripcion?: string;
  montoTotal: number;
}

export interface MiembroGrupo {
  usuarioId: number;
  nombreCompleto: string;
  email: string;
  rol: string;
}

export interface GrupoResumen {
  grupoId: number;
  nombreGrupo: string;
  codigoInvitacion: string;
  deudaPendienteIndividual: number;
  totalPorRecaudarGrupo: number;
  totalRecaudadoGrupo: number;
  totalMiembros: number;
  miembros: MiembroGrupo[];
}