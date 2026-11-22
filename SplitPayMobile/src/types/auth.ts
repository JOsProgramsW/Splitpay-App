export interface UserSession {
  token: string;
  usuarioId: number;
  nombreCompleto: string;
  email: string;
  rol: 'Admin' | 'Miembro';
  grupoId: number;
  nombreGrupo: string;
  codigoInvitacion: string;
}